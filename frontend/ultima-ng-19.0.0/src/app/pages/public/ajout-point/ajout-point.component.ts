import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, NgZone, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import * as L from 'leaflet';

@Component({
    selector: 'app-ajout-point',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, DropdownModule],
    templateUrl: './ajout-point.component.html',
    styleUrl: './ajout-point.component.scss'
})
export class AjoutPointComponent implements AfterViewInit {
    @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

    readonly REGIONS = ['CONAKRY', 'BASSE GUINEE', 'MOYENNE GUINEE', 'HAUTE GUINEE', 'GUINEE FORESTIERE'];
    regionOptions = this.REGIONS.map((r) => ({ label: r, value: r }));
    typeOptions = [
        { label: 'ABT', value: 'ABT' },
        { label: 'Kiosque', value: 'KIOSQUE' },
        { label: 'Partenaire', value: 'PART' },
        { label: 'Point de service', value: 'PS' },
        { label: 'Guichet', value: 'GUICHET' }
    ];

    form: { type: string | null; delegation: string | null; agence: string; pointVente: string; nom: string; contact: string } = {
        type: null,
        delegation: null,
        agence: '',
        pointVente: '',
        nom: '',
        contact: ''
    };

    coords = signal<{ lat: number; lng: number; acc?: number } | null>(null);
    geoStatus = signal<'loading' | 'ok' | 'denied' | 'error'>('loading');
    submitting = signal(false);
    submitted = signal(false);
    errorMsg = signal<string | null>(null);

    private map!: L.Map;
    private marker?: L.Marker;
    private userService = inject(UserService);
    private zone = inject(NgZone);

    ngAfterViewInit(): void {
        // La géolocalisation est prioritaire et indépendante de la carte.
        this.captureGps();
        if (this.mapContainer) this.initMap();
    }

    /** Types "terrain" (territoire administratif) vs points de service (structure CRG). */
    isTerritorial(): boolean {
        return this.form.type === 'ABT' || this.form.type === 'KIOSQUE' || this.form.type === 'PART';
    }

    captureGps(): void {
        if (!navigator.geolocation) {
            this.geoStatus.set('error');
            return;
        }
        this.geoStatus.set('loading');
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                // Le callback s'exécute hors zone Angular -> on réintègre la zone pour rafraîchir la vue.
                this.zone.run(() => {
                    this.coords.set({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy });
                    this.geoStatus.set('ok');
                    this.showOnMap();
                }),
            (err) => this.zone.run(() => this.geoStatus.set(err.code === 1 ? 'denied' : 'error')),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    }

    private initMap(): void {
        if (!this.mapContainer) return;
        this.map = L.map(this.mapContainer.nativeElement, { center: [10.4, -11.3], zoom: 6 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(this.map);
        setTimeout(() => this.map.invalidateSize(), 200);
    }

    private showOnMap(): void {
        const c = this.coords();
        if (!c || !this.map) return;
        const icon = L.divIcon({ className: 'reseau-pin', html: '<span style="background:#0891b2"></span>', iconSize: [22, 22], iconAnchor: [11, 22] });
        if (this.marker) this.marker.setLatLng([c.lat, c.lng]);
        else this.marker = L.marker([c.lat, c.lng], { icon }).addTo(this.map);
        this.map.setView([c.lat, c.lng], 16);
    }

    submit(): void {
        this.errorMsg.set(null);
        const c = this.coords();
        if (!this.form.type) {
            this.errorMsg.set('Choisissez le type de point.');
            return;
        }
        if (!this.form.nom.trim()) {
            this.errorMsg.set('Le nom est obligatoire.');
            return;
        }
        if (!c) {
            this.errorMsg.set('Position GPS non captée. Activez la localisation puis « Recapter ma position ».');
            return;
        }
        const dto = {
            type: this.form.type,
            delegation: this.form.delegation,
            agence: this.form.agence,
            pointVente: this.form.pointVente,
            nom: this.form.nom,
            contact: this.form.contact,
            latitude: c.lat,
            longitude: c.lng
        };
        this.submitting.set(true);
        this.userService.soumettrePoint$(dto).subscribe({
            next: (_r: IResponse) => {
                this.submitting.set(false);
                this.submitted.set(true);
            },
            error: (e) => {
                this.submitting.set(false);
                this.errorMsg.set(e?.message || "Erreur lors de l'envoi. Réessayez.");
            }
        });
    }

    nouveau(): void {
        this.submitted.set(false);
        this.form = { type: null, delegation: null, agence: '', pointVente: '', nom: '', contact: '' };
        this.errorMsg.set(null);
    }
}
