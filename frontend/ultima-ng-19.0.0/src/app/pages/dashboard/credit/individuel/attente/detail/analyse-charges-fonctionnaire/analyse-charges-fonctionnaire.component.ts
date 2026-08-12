import { AnalyseChargesFonctionnaire, DemandeIndividuel, PieceJointeDemande, quotiteCessibleFonctionnaire } from '@/interface/demande-individuel.interface';
import { UserService } from '@/service/user.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

registerLocaleData(localeFr, 'fr-FR');

/**
 * Écran d'analyse du crédit fonctionnaire : grille des 12 postes de charges,
 * quotité cessible et capacité résiduelle calculées en direct.
 * Remplace le bilan d'activité / flux de trésorerie des commerçants.
 */
@Component({
    selector: 'app-analyse-charges-fonctionnaire',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, DropdownModule, InputNumberModule, TagModule, ToastModule],
    templateUrl: './analyse-charges-fonctionnaire.component.html',
    providers: [MessageService]
})
export class AnalyseChargesFonctionnaireComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);

    demandeIndividuelId!: number;

    /** Libellés des 12 postes, dans l'ordre de la grille validée. */
    readonly postes: { key: ChargeKey; libelle: string }[] = [
        { key: 'chargeLoyer', libelle: 'Loyer' },
        { key: 'chargeTransport', libelle: 'Transport' },
        { key: 'chargeNourriture', libelle: 'Nourriture' },
        { key: 'chargeVignette', libelle: 'Vignette' },
        { key: 'chargeAssurance', libelle: 'Assurance' },
        { key: 'chargeElectricite', libelle: 'Électricité' },
        { key: 'chargeEau', libelle: 'Eau' },
        { key: 'chargeAssuranceMaladie', libelle: 'Assurance maladie' },
        { key: 'chargeScolarite', libelle: 'Scolarité' },
        { key: 'chargeCasSociaux', libelle: 'Cas sociaux' },
        { key: 'chargeAbonnementImage', libelle: 'Abonnement image (TV)' },
        { key: 'chargeServiceSalubrite', libelle: 'Service salubrité' }
    ];

    analyse: AnalyseChargesFonctionnaire = this.emptyAnalyse();

    state = signal<{
        loading: boolean;
        saving: boolean;
        uploading: boolean;
        demande?: DemandeIndividuel;
        pieces: PieceJointeDemande[];
    }>({ loading: true, saving: false, uploading: false, pieces: [] });

    typePieceOptions = [
        { label: 'Bulletin de salaire', value: 'BULLETIN_SALAIRE' },
        { label: 'Attestation de service', value: 'ATTESTATION_SERVICE' },
        { label: 'Autre pièce', value: 'AUTRE' }
    ];
    nouvellePieceType: 'BULLETIN_SALAIRE' | 'ATTESTATION_SERVICE' | 'AUTRE' = 'BULLETIN_SALAIRE';
    nouvellePieceFichier: File | null = null;

    ngOnInit(): void {
        this.demandeIndividuelId = +this.route.snapshot.paramMap.get('demandeindividuelId')!;
        this.chargerPieces();
        forkJoin({
            demande: this.userService.getDemandeWithGaranties$(this.demandeIndividuelId),
            analyse: this.userService.getAnalyseChargesFonctionnaire$(this.demandeIndividuelId)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({ demande, analyse }) => {
                    const demandeIndividuel = demande.data?.demandeIndividuel as DemandeIndividuel | undefined;
                    const saved = analyse.data?.analyseCharges as AnalyseChargesFonctionnaire | null;
                    if (saved) {
                        this.analyse = { ...this.emptyAnalyse(), ...saved };
                    } else if (demandeIndividuel?.demandeFonctionnaire?.autresRevenus != null) {
                        this.analyse.autresRevenusRetenus = demandeIndividuel.demandeFonctionnaire.autresRevenus;
                    }
                    this.state.update((s) => ({ ...s, loading: false, demande: demandeIndividuel }));
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || 'Chargement impossible', life: 7000 });
                }
            });
    }

    // ==================== CALCULS EN DIRECT (mêmes formules que le backend) ====================

    salaireNet(): number {
        return this.state().demande?.demandeFonctionnaire?.salaireNetMensuel || 0;
    }

    echeance(): number {
        return this.state().demande?.echeance || 0;
    }

    totalCharges(): number {
        return this.postes.reduce((total, poste) => total + (this.analyse[poste.key] || 0), 0);
    }

    quotiteCessible(): number {
        return quotiteCessibleFonctionnaire(this.salaireNet());
    }

    capaciteResiduelle(): number {
        return this.salaireNet() - this.quotiteCessible() + (this.analyse.autresRevenusRetenus || 0) - this.totalCharges();
    }

    echeanceDepasseQuotite(): boolean {
        return this.echeance() > this.quotiteCessible();
    }

    financable(): boolean {
        return this.capaciteResiduelle() >= 0 && this.echeance() > 0 && !this.echeanceDepasseQuotite();
    }

    // ==================== ENREGISTREMENT ====================

    enregistrer(): void {
        this.state.update((s) => ({ ...s, saving: true }));
        this.userService
            .saveAnalyseChargesFonctionnaire$(this.demandeIndividuelId, this.analyse)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const saved = response.data?.analyseCharges as AnalyseChargesFonctionnaire;
                    if (saved) {
                        this.analyse = { ...this.emptyAnalyse(), ...saved };
                    }
                    this.state.update((s) => ({ ...s, saving: false }));
                    this.messageService.add({
                        severity: saved?.verdict === 'FINANCABLE' ? 'success' : 'warn',
                        summary: 'Analyse enregistrée',
                        detail: saved?.verdict === 'FINANCABLE' ? 'Dossier finançable : donnez votre avis et approuvez la demande depuis le détail.' : 'Analyse enregistrée mais dossier NON finançable en l’état : l’approbation sera bloquée.',
                        life: 7000
                    });
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, saving: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || "Échec de l'enregistrement", life: 7000 });
                }
            });
    }

    retourDetail(): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', this.demandeIndividuelId]);
    }

    // ==================== PIECES JOINTES ====================

    chargerPieces(): void {
        this.userService
            .getPiecesDemande$(this.demandeIndividuelId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => this.state.update((s) => ({ ...s, pieces: response.data?.pieces || [] })),
                error: () => this.state.update((s) => ({ ...s, pieces: [] }))
            });
    }

    onNouvellePieceSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.nouvellePieceFichier = input.files && input.files.length > 0 ? input.files[0] : null;
    }

    ajouterPiece(): void {
        if (!this.nouvellePieceFichier) return;
        this.state.update((s) => ({ ...s, uploading: true }));
        this.userService
            .uploadPieceDemande$(this.demandeIndividuelId, this.nouvellePieceType, this.nouvellePieceFichier)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.nouvellePieceFichier = null;
                    this.state.update((s) => ({ ...s, uploading: false }));
                    this.chargerPieces();
                    this.messageService.add({ severity: 'success', summary: 'Pièce jointe', detail: 'Pièce enregistrée', life: 3000 });
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, uploading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || "Échec de l'envoi de la pièce", life: 7000 });
                }
            });
    }

    supprimerPiece(piece: PieceJointeDemande): void {
        if (!piece.pieceJointeId) return;
        this.userService
            .deletePieceDemande$(piece.pieceJointeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.chargerPieces(),
                error: (error) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || 'Suppression impossible', life: 5000 })
            });
    }

    libelleTypePiece(type?: string): string {
        const option = this.typePieceOptions.find((o) => o.value === type);
        return option ? option.label : type || 'Pièce';
    }

    private emptyAnalyse(): AnalyseChargesFonctionnaire {
        return {
            chargeLoyer: 0,
            chargeTransport: 0,
            chargeNourriture: 0,
            chargeVignette: 0,
            chargeAssurance: 0,
            chargeElectricite: 0,
            chargeEau: 0,
            chargeAssuranceMaladie: 0,
            chargeScolarite: 0,
            chargeCasSociaux: 0,
            chargeAbonnementImage: 0,
            chargeServiceSalubrite: 0,
            autresRevenusRetenus: 0
        };
    }
}

type ChargeKey =
    | 'chargeLoyer'
    | 'chargeTransport'
    | 'chargeNourriture'
    | 'chargeVignette'
    | 'chargeAssurance'
    | 'chargeElectricite'
    | 'chargeEau'
    | 'chargeAssuranceMaladie'
    | 'chargeScolarite'
    | 'chargeCasSociaux'
    | 'chargeAbonnementImage'
    | 'chargeServiceSalubrite';
