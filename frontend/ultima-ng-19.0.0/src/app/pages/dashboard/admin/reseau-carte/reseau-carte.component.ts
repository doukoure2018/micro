import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
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
}

@Component({
    selector: 'app-reseau-carte',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, DropdownModule, ProgressSpinnerModule],
    templateUrl: './reseau-carte.component.html',
    styleUrl: './reseau-carte.component.scss'
})
export class ReseauCarteComponent implements AfterViewInit, OnDestroy {
    @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

    readonly TYPES = ['ABT', 'PS', 'KIOSQUE', 'GUICHET', 'PART'];
    readonly TYPE_COLORS: Record<string, string> = {
        PS: '#22c55e',
        KIOSQUE: '#3b82f6',
        ABT: '#f59e0b',
        GUICHET: '#ef4444',
        PART: '#8b5cf6'
    };
    readonly DELEGATIONS = ['CONAKRY', 'BASSE GUINEE', 'MOYENNE GUINEE', 'HAUTE GUINEE', 'GUINEE FORESTIERE'];
    delegationOptions = [{ label: 'Toutes les délégations', value: null }, ...this.DELEGATIONS.map((d) => ({ label: d, value: d }))];

    // Filtres
    selectedDelegation: string | null = null;
    typeVisible: Record<string, boolean> = { ABT: true, PS: true, KIOSQUE: true, GUICHET: true, PART: true };

    state = signal<{ points: ReseauPoint[]; loading: boolean }>({ points: [], loading: true });

    private map!: L.Map;
    private markersLayer = L.layerGroup();

    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);

    ngAfterViewInit(): void {
        this.initMap();
        this.loadPoints();
    }

    ngOnDestroy(): void {
        if (this.map) this.map.remove();
    }

    private initMap(): void {
        // Bornes approximatives de la Guinee
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
        this.markersLayer.addTo(this.map);
        // Leaflet peut mal calculer la taille si le conteneur s'affiche tard
        setTimeout(() => this.map.invalidateSize(), 200);
    }

    private loadPoints(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getReseauPoints$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const points: ReseauPoint[] = (response.data as any)?.points || [];
                    this.state.update((s) => ({ ...s, points, loading: false }));
                    this.renderMarkers();
                },
                error: () => this.state.update((s) => ({ ...s, points: [], loading: false }))
            });
    }

    filteredPoints(): ReseauPoint[] {
        return this.state().points.filter(
            (p) =>
                (!this.selectedDelegation || p.delegation === this.selectedDelegation) &&
                this.typeVisible[p.type] !== false &&
                p.latitude != null &&
                p.longitude != null
        );
    }

    countByType(type: string): number {
        return this.state().points.filter((p) => p.type === type && (!this.selectedDelegation || p.delegation === this.selectedDelegation)).length;
    }

    onDelegationChange(): void {
        this.renderMarkers();
    }

    toggleType(type: string): void {
        this.typeVisible[type] = !this.typeVisible[type];
        this.renderMarkers();
    }

    private renderMarkers(): void {
        if (!this.map) return;
        this.markersLayer.clearLayers();
        const pts = this.filteredPoints();
        pts.forEach((p) => {
            const marker = L.marker([p.latitude!, p.longitude!], { icon: this.markerIcon(p.type) });
            marker.bindPopup(this.popupHtml(p));
            marker.addTo(this.markersLayer);
        });
        // Recentrer sur les points visibles si presents
        if (pts.length) {
            const bounds = L.latLngBounds(pts.map((p) => L.latLng(p.latitude!, p.longitude!)));
            this.map.fitBounds(bounds.pad(0.2), { maxZoom: 12 });
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
              <div style="display:inline-block;background:${color};color:#fff;font-size:11px;padding:1px 8px;border-radius:10px;margin-bottom:6px">${this.escape(p.type)}</div>
              <div style="font-size:12px;color:#444">
                <div><b>Délégation :</b> ${this.escape(p.delegation)}</div>
                <div><b>Agence :</b> ${this.escape(p.agence)}</div>
                ${p.pointVente ? `<div><b>Point de vente :</b> ${this.escape(p.pointVente)}</div>` : ''}
                ${p.contact ? `<div><b>Contact :</b> ${this.escape(p.contact)}</div>` : ''}
                <div style="color:#888;margin-top:2px">${p.latitude}, ${p.longitude}</div>
              </div>
            </div>`;
    }

    private escape(s?: string): string {
        if (!s) return '';
        return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
    }
}
