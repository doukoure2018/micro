import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import * as L from 'leaflet';

interface ReseauPoint {
    id?: number;
    delegation: string;
    agence: string;
    pointVente?: string;
    nom: string;
    contact?: string;
    type: string;
    latitude?: number;
    longitude?: number;
    commune?: string; // deduite par point-dans-polygone
}

interface CommuneFeature {
    name: string;
    bbox: [number, number, number, number];
    geom: any;
}

@Component({
    selector: 'app-digi-map',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, DropdownModule, ProgressSpinnerModule],
    templateUrl: './digi-map.component.html',
    styleUrl: './digi-map.component.scss'
})
export class DigiMapComponent implements AfterViewInit, OnDestroy {
    @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

    readonly TYPES = ['ABT', 'PS', 'KIOSQUE', 'GUICHET', 'PART'];
    readonly TYPE_COLORS: Record<string, string> = {
        PS: '#22c55e',
        KIOSQUE: '#3b82f6',
        ABT: '#f59e0b',
        GUICHET: '#ef4444',
        PART: '#8b5cf6'
    };
    readonly TYPE_LABELS: Record<string, string> = {
        PS: 'Point de service',
        KIOSQUE: 'Kiosque',
        ABT: 'ABT',
        GUICHET: 'Guichet',
        PART: 'Partenaire'
    };

    delegationOptions: { label: string; value: string | null }[] = [{ label: 'Toutes les délégations', value: null }];

    // Filtres
    searchTerm = '';
    selectedDelegation: string | null = null;
    selectedCommune: string | null = null;
    typeVisible: Record<string, boolean> = { ABT: true, PS: true, KIOSQUE: true, GUICHET: true, PART: true };

    state = signal<{ points: ReseauPoint[]; loading: boolean }>({ points: [], loading: true });

    private map!: L.Map;
    private markersLayer = L.layerGroup();
    private communeLayer = L.layerGroup();
    private markerById: Record<number, L.Marker> = {};
    private communeFeatures: CommuneFeature[] = [];

    private userService = inject(UserService);
    private http = inject(HttpClient);
    private destroyRef = inject(DestroyRef);

    ngAfterViewInit(): void {
        this.initMap();
        this.loadCommunes();
        this.loadPoints();
    }

    ngOnDestroy(): void {
        if (this.map) this.map.remove();
    }

    private initMap(): void {
        const guinea = L.latLngBounds(L.latLng(7.0, -15.5), L.latLng(12.9, -7.3));
        this.map = L.map(this.mapContainer.nativeElement, {
            center: [10.4, -11.3],
            zoom: 7,
            minZoom: 6,
            maxBounds: guinea,
            maxBoundsViscosity: 0.7
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);
        this.communeLayer.addTo(this.map); // sous les marqueurs
        this.markersLayer.addTo(this.map);
        setTimeout(() => this.map.invalidateSize(), 200);
    }

    // ── Chargement ──────────────────────────────────────────────────────────────
    private loadCommunes(): void {
        this.http
            .get<any>('/geo/guinea-communes.geojson')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (fc) => {
                    this.communeFeatures = (fc?.features || [])
                        .filter((f: any) => f?.geometry && f?.properties?.name)
                        .map((f: any) => ({ name: f.properties.name, bbox: this.computeBbox(f.geometry), geom: f.geometry }));
                    this.assignCommunesIfReady();
                },
                error: () => {}
            });
    }

    private loadPoints(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getReseauPoints$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const points: ReseauPoint[] = (response.data as any)?.points || [];
                    const delegations = Array.from(new Set(points.map((p) => p.delegation).filter(Boolean))).sort();
                    this.delegationOptions = [{ label: 'Toutes les délégations', value: null }, ...delegations.map((d) => ({ label: d, value: d }))];
                    this.state.update((s) => ({ ...s, points, loading: false }));
                    this.assignCommunesIfReady();
                    this.renderMarkers();
                },
                error: () => this.state.update((s) => ({ ...s, points: [], loading: false }))
            });
    }

    /** Assigne la commune à chaque point dès que points ET géométries sont dispo. */
    private assignCommunesIfReady(): void {
        const pts = this.state().points;
        if (!this.communeFeatures.length || !pts.length) return;
        pts.forEach((p) => {
            if (p.latitude != null && p.longitude != null) {
                p.commune = this.findCommune(p.longitude, p.latitude) || 'Hors commune';
            }
        });
        this.state.update((s) => ({ ...s, points: [...s.points] })); // rafraîchit liste/options
    }

    // ── Point-dans-polygone ──────────────────────────────────────────────────────
    private findCommune(lng: number, lat: number): string | null {
        for (const c of this.communeFeatures) {
            const [minX, minY, maxX, maxY] = c.bbox;
            if (lng < minX || lng > maxX || lat < minY || lat > maxY) continue;
            if (this.geomContains(c.geom, lng, lat)) return c.name;
        }
        return null;
    }

    private geomContains(geom: any, lng: number, lat: number): boolean {
        if (geom.type === 'Polygon') return this.ringsContain(geom.coordinates, lng, lat);
        if (geom.type === 'MultiPolygon') return geom.coordinates.some((poly: any) => this.ringsContain(poly, lng, lat));
        return false;
    }

    /** Ray-casting even-odd sur tous les anneaux d'un polygone (gère les trous). */
    private ringsContain(rings: number[][][], lng: number, lat: number): boolean {
        let inside = false;
        for (const ring of rings) {
            for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
                const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
                if (intersect) inside = !inside;
            }
        }
        return inside;
    }

    private computeBbox(geom: any): [number, number, number, number] {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const scan = (coords: any): void => {
            if (typeof coords[0] === 'number') {
                const x = coords[0], y = coords[1];
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            } else {
                coords.forEach(scan);
            }
        };
        scan(geom.coordinates);
        return [minX, minY, maxX, maxY];
    }

    // ── Filtres / liste ──────────────────────────────────────────────────────────
    filteredPoints(): ReseauPoint[] {
        const term = this.searchTerm.trim().toLowerCase();
        return this.state().points.filter((p) => {
            if (this.selectedDelegation && p.delegation !== this.selectedDelegation) return false;
            if (this.selectedCommune && p.commune !== this.selectedCommune) return false;
            if (this.typeVisible[p.type] === false) return false;
            if (p.latitude == null || p.longitude == null) return false;
            if (term) {
                const hay = `${p.nom} ${p.agence} ${p.pointVente || ''} ${p.type} ${p.delegation} ${p.commune || ''} ${p.contact || ''}`.toLowerCase();
                if (!hay.includes(term)) return false;
            }
            return true;
        });
    }

    /** Communes présentes (dans la délégation choisie), pour le sélecteur de zone. */
    getCommuneOptions(): { label: string; value: string | null }[] {
        const communes = Array.from(
            new Set(
                this.state()
                    .points.filter((p) => (!this.selectedDelegation || p.delegation === this.selectedDelegation) && p.commune)
                    .map((p) => p.commune as string)
            )
        ).sort();
        return [{ label: 'Toutes les communes', value: null }, ...communes.map((c) => ({ label: c, value: c }))];
    }

    groupedByZone(): { zone: string; points: ReseauPoint[] }[] {
        const groups: Record<string, ReseauPoint[]> = {};
        this.filteredPoints().forEach((p) => {
            const z = p.commune || 'Hors commune';
            (groups[z] = groups[z] || []).push(p);
        });
        return Object.keys(groups)
            .sort()
            .map((zone) => ({ zone, points: groups[zone].sort((a, b) => a.nom.localeCompare(b.nom)) }));
    }

    countByType(type: string): number {
        return this.state().points.filter(
            (p) => p.type === type && (!this.selectedDelegation || p.delegation === this.selectedDelegation) && (!this.selectedCommune || p.commune === this.selectedCommune)
        ).length;
    }

    onDelegationChange(): void {
        this.selectedCommune = null;
        this.drawCommuneBoundary(null);
        this.renderMarkers();
    }

    onCommuneChange(): void {
        this.drawCommuneBoundary(this.selectedCommune);
        this.renderMarkers();
    }

    onFilterChange(): void {
        this.renderMarkers();
    }

    toggleType(type: string): void {
        this.typeVisible[type] = !this.typeVisible[type];
        this.renderMarkers();
    }

    locatePoint(p: ReseauPoint): void {
        if (p.latitude == null || p.longitude == null || !this.map) return;
        this.map.setView([p.latitude, p.longitude], 15, { animate: true });
        const m = p.id != null ? this.markerById[p.id] : undefined;
        if (m) m.openPopup();
    }

    // ── Carte ────────────────────────────────────────────────────────────────────
    private drawCommuneBoundary(name: string | null): void {
        this.communeLayer.clearLayers();
        if (!name) return;
        this.communeFeatures
            .filter((c) => c.name === name)
            .forEach((c) => {
                L.geoJSON({ type: 'Feature', geometry: c.geom } as any, {
                    style: { color: '#0891b2', weight: 2, fillColor: '#22d3ee', fillOpacity: 0.12 }
                }).addTo(this.communeLayer);
            });
    }

    private renderMarkers(): void {
        if (!this.map) return;
        this.markersLayer.clearLayers();
        this.markerById = {};
        const pts = this.filteredPoints();
        pts.forEach((p) => {
            const marker = L.marker([p.latitude!, p.longitude!], { icon: this.markerIcon(p.type) });
            marker.bindPopup(this.popupHtml(p));
            marker.addTo(this.markersLayer);
            if (p.id != null) this.markerById[p.id] = marker;
        });
        if (pts.length) {
            const bounds = L.latLngBounds(pts.map((p) => L.latLng(p.latitude!, p.longitude!)));
            this.map.fitBounds(bounds.pad(0.2), { maxZoom: 14 });
        }
    }

    private markerIcon(type: string): L.DivIcon {
        const color = this.TYPE_COLORS[type] || '#6b7280';
        return L.divIcon({
            className: 'reseau-pin',
            html: `<span style="background:${color}"></span>`,
            iconSize: [22, 22],
            iconAnchor: [11, 22],
            popupAnchor: [0, -20]
        });
    }

    private popupHtml(p: ReseauPoint): string {
        const color = this.TYPE_COLORS[p.type] || '#6b7280';
        return `
            <div style="min-width:180px">
              <div style="font-weight:700;margin-bottom:4px">${this.escape(p.nom)}</div>
              <div style="display:inline-block;background:${color};color:#fff;font-size:11px;padding:1px 8px;border-radius:10px;margin-bottom:6px">${this.escape(this.TYPE_LABELS[p.type] || p.type)}</div>
              <div style="font-size:12px;color:#444">
                ${p.commune ? `<div><b>Commune :</b> ${this.escape(p.commune)}</div>` : ''}
                <div><b>Délégation :</b> ${this.escape(p.delegation)}</div>
                <div><b>Agence :</b> ${this.escape(p.agence)}</div>
                ${p.pointVente ? `<div><b>Point de vente :</b> ${this.escape(p.pointVente)}</div>` : ''}
                ${p.contact ? `<div><b>Contact :</b> ${this.escape(p.contact)}</div>` : ''}
              </div>
            </div>`;
    }

    private escape(s?: string): string {
        if (!s) return '';
        return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
    }
}
