import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';

import { ChangementTelephoneService } from '@/service/changement-telephone.service';
import { UserService } from '@/service/user.service';
import { DemandeChangementTelephone, RejetTelephoneRequest } from '@/interface/demande-changement-telephone';

@Component({
    selector: 'app-da-validation-telephone',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        DialogModule,
        ConfirmDialogModule,
        InputTextModule,
        TextareaModule,
        ProgressSpinnerModule,
        TableModule,
        TagModule,
        ToastModule,
        CheckboxModule,
        TooltipModule,
        DividerModule
    ],
    providers: [MessageService, ConfirmationService, UserService],
    templateUrl: './da-validation-telephone.component.html'
})
export class DaValidationTelephoneComponent implements OnInit {
    private service = inject(ChangementTelephoneService);
    private userService = inject(UserService);
    private toast = inject(MessageService);
    private confirm = inject(ConfirmationService);

    demandes = signal<DemandeChangementTelephone[]>([]);
    loading = signal(false);
    submitting = signal(false);

    // Dialog rejet
    showRejetDialog = signal(false);
    rejetForm: RejetTelephoneRequest = { motif: '', definitif: false };

    // Dialog "Voir fiche client + actions"
    showFicheDialog = signal(false);
    ficheLoading = signal(false);
    fiche = signal<any | null>(null);
    ficheError = signal<string | null>(null);

    selectedDemande = signal<DemandeChangementTelephone | null>(null);

    // Telephone actuel dans SAF (pour comparer avec ancienTelephone declare par l'agent)
    telCorrespond = computed<boolean | null>(() => {
        const f = this.fiche();
        const d = this.selectedDemande();
        if (!f || !d) return null;
        return (f.telPrincipal ?? '').trim() === (d.ancienTelephone ?? '').trim();
    });

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.loading.set(true);
        this.service.listAttenteDA().subscribe({
            next: (res) => {
                this.demandes.set(((res.data as any)?.demandes ?? []) as DemandeChangementTelephone[]);
                this.loading.set(false);
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                this.loading.set(false);
            }
        });
    }

    /** Ouvre le dialog de fiche signaletique + actions de validation */
    openFicheClient(d: DemandeChangementTelephone) {
        this.selectedDemande.set(d);
        this.fiche.set(null);
        this.ficheError.set(null);
        this.ficheLoading.set(true);
        this.showFicheDialog.set(true);

        this.userService.getFicheSignaletique$(d.codCliente).subscribe({
            next: (res) => {
                const data = (res as any)?.data;
                const fiche = data?.data || data?.ficheSignaletique || data;
                this.fiche.set(fiche ?? null);
                this.ficheLoading.set(false);
            },
            error: (err) => {
                this.ficheError.set(err?.message || 'Echec recuperation de la fiche client');
                this.ficheLoading.set(false);
            }
        });
    }

    confirmApprouver(d: DemandeChangementTelephone) {
        this.confirm.confirm({
            message: `Approuver le changement: ${d.ancienTelephone} -> ${d.nouveauTelephone} pour le client ${d.codCliente} ?`,
            header: 'Approuver la demande',
            icon: 'pi pi-check-circle',
            accept: () => this.approuver(d.id!)
        });
    }

    private approuver(id: number) {
        this.submitting.set(true);
        this.service.approuver(id).subscribe({
            next: () => {
                this.toast.add({ severity: 'success', summary: 'Demande approuvee', detail: '' });
                this.submitting.set(false);
                this.showFicheDialog.set(false);
                this.refresh();
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                this.submitting.set(false);
            }
        });
    }

    openRejet(d: DemandeChangementTelephone, definitif: boolean) {
        this.selectedDemande.set(d);
        this.rejetForm = { motif: '', definitif };
        this.showRejetDialog.set(true);
    }

    submitRejet() {
        const id = this.selectedDemande()?.id;
        if (!id) return;
        if (!this.rejetForm.motif || this.rejetForm.motif.trim().length === 0) {
            this.toast.add({ severity: 'warn', summary: 'Motif obligatoire', detail: '' });
            return;
        }
        this.submitting.set(true);
        this.service.rejeter(id, this.rejetForm).subscribe({
            next: () => {
                this.toast.add({
                    severity: 'success',
                    summary: this.rejetForm.definitif ? 'Demande rejetee definitivement' : 'Demande rejetee',
                    detail: ''
                });
                this.showRejetDialog.set(false);
                this.showFicheDialog.set(false);
                this.submitting.set(false);
                this.refresh();
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Erreur', detail: err.message });
                this.submitting.set(false);
            }
        });
    }
}
