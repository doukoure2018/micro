import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

import { ChangementTelephoneService } from '@/service/changement-telephone.service';
import { CreateDemandeTelephoneRequest, DemandeChangementTelephone, ResoumissionTelephoneRequest, StatutChangementTelephone } from '@/interface/demande-changement-telephone';

@Component({
    selector: 'app-agent-changement-telephone',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        DialogModule,
        InputTextModule,
        TableModule,
        TagModule,
        TextareaModule,
        ToastModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        TooltipModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './agent-changement-telephone.component.html'
})
export class AgentChangementTelephoneComponent implements OnInit {
    private service = inject(ChangementTelephoneService);
    private toast = inject(MessageService);
    private confirm = inject(ConfirmationService);

    demandes = signal<DemandeChangementTelephone[]>([]);
    loading = signal(false);
    submitting = signal(false);

    showCreateDialog = signal(false);
    showResoumissionDialog = signal(false);
    selectedDemande = signal<DemandeChangementTelephone | null>(null);

    form: CreateDemandeTelephoneRequest = this.emptyForm();
    resoumissionForm: ResoumissionTelephoneRequest = { nouveauTelephone: '', raisonModification: '' };

    canCreate = computed(() => this.demandes() !== null);

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.loading.set(true);
        this.service.listMesDemandes().subscribe({
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

    openCreateDialog() {
        this.form = this.emptyForm();
        this.showCreateDialog.set(true);
    }

    submit() {
        if (!this.validateForm()) return;
        this.submitting.set(true);
        this.service.creer(this.form).subscribe({
            next: () => {
                this.toast.add({ severity: 'success', summary: 'Demande envoyee au DA', detail: '' });
                this.showCreateDialog.set(false);
                this.submitting.set(false);
                this.refresh();
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Echec', detail: err.message });
                this.submitting.set(false);
            }
        });
    }

    openResoumission(d: DemandeChangementTelephone) {
        this.selectedDemande.set(d);
        this.resoumissionForm = {
            nouveauTelephone: d.nouveauTelephone,
            raisonModification: d.raisonModification
        };
        this.showResoumissionDialog.set(true);
    }

    submitResoumission() {
        const id = this.selectedDemande()?.id;
        if (!id) return;
        if (!this.resoumissionForm.nouveauTelephone || !this.resoumissionForm.raisonModification) {
            this.toast.add({ severity: 'warn', summary: 'Champs requis', detail: 'Telephone et raison obligatoires' });
            return;
        }
        this.submitting.set(true);
        this.service.resoumettre(id, this.resoumissionForm).subscribe({
            next: () => {
                this.toast.add({ severity: 'success', summary: 'Demande resoumise au DA', detail: '' });
                this.showResoumissionDialog.set(false);
                this.submitting.set(false);
                this.refresh();
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Echec', detail: err.message });
                this.submitting.set(false);
            }
        });
    }

    confirmValiderSaf(d: DemandeChangementTelephone) {
        this.confirm.confirm({
            message: `Valider la mise a jour du telephone du client ${d.codCliente} dans SAF ?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.validerSaf(d.id!)
        });
    }

    private validerSaf(id: number) {
        this.submitting.set(true);
        this.service.validerSaf(id).subscribe({
            next: () => {
                this.toast.add({ severity: 'success', summary: 'Telephone mis a jour dans SAF', detail: '' });
                this.submitting.set(false);
                this.refresh();
            },
            error: (err) => {
                this.toast.add({ severity: 'error', summary: 'Echec SAF', detail: err.message });
                this.submitting.set(false);
            }
        });
    }

    statutSeverity(statut?: StatutChangementTelephone): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (statut) {
            case 'VALIDE_SAF': return 'success';
            case 'APPROUVE': return 'info';
            case 'EN_ATTENTE_DA': return 'warn';
            case 'REJETE': return 'danger';
            case 'REJETE_DEFINITIF': return 'danger';
            default: return 'secondary';
        }
    }

    statutLabel(statut?: StatutChangementTelephone): string {
        switch (statut) {
            case 'EN_ATTENTE_DA': return 'En attente DA';
            case 'APPROUVE': return 'Approuvee';
            case 'REJETE': return 'Rejetee';
            case 'REJETE_DEFINITIF': return 'Rejetee definitivement';
            case 'VALIDE_SAF': return 'Validee dans SAF';
            default: return statut ?? '';
        }
    }

    private validateForm(): boolean {
        const f = this.form;
        if (!f.codCliente || !f.ancienTelephone || !f.nouveauTelephone || !f.raisonModification || !f.dateModificationSouhaitee) {
            this.toast.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez remplir tous les champs obligatoires' });
            return false;
        }
        if (f.ancienTelephone === f.nouveauTelephone) {
            this.toast.add({ severity: 'warn', summary: 'Telephones identiques', detail: 'L\'ancien et le nouveau telephone doivent etre differents' });
            return false;
        }
        return true;
    }

    private emptyForm(): CreateDemandeTelephoneRequest {
        return {
            codCliente: '',
            nomClient: '',
            prenomClient: '',
            ancienTelephone: '',
            nouveauTelephone: '',
            raisonModification: '',
            dateModificationSouhaitee: new Date().toISOString().substring(0, 10)
        };
    }
}
