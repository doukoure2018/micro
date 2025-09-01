// mode-vue-ensemble.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CATEGORIES_DECAISSEMENT } from '@/interface/categorie-decaissement';

@Component({
    selector: 'app-mode-vue-ensemble',
    standalone: true,
    imports: [CommonModule, TableModule, CardModule, TagModule],
    templateUrl: './mode-vue-ensemble.component.html',
    styleUrl: './mode-vue-ensemble.component.scss'
})
export class ModeVueEnsembleComponent implements OnInit {
    @Input() tresorerieForm!: FormGroup;
    @Input() creditParams: any;

    mois = Array.from({ length: 12 }, (_, i) => i + 1);
    categoriesDecaissement = CATEGORIES_DECAISSEMENT;

    ngOnInit() {
        console.log('Vue ensemble initialized with form:', this.tresorerieForm);
    }

    // Obtenir le FormGroup d'un mois spécifique
    getMoisFormGroup(mois: number): FormGroup {
        return this.tresorerieForm.get(`mois${mois}`) as FormGroup;
    }

    // Obtenir les cumuls
    getCumuls() {
        let cumuls = {
            ventes: 0,
            autresRevenus: 0,
            pret: 0,
            totalEncaissements: 0,
            achatMarchandises: 0,
            mainoeuvre: 0,
            investissement: 0,
            impotstaxes: 0,
            loyer: 0,
            utilities: 0,
            transport: 0,
            salaires: 0,
            fraistelephone: 0,
            chargesfinancieres: 0,
            entretien: 0,
            autresdepenses: 0,
            totalDecaissements: 0,
            excedentDeficit: 0,
            interetsAVerser: 0,
            remboursementCapital: 0
        };

        for (let mois = 1; mois <= 12; mois++) {
            const moisData = this.getMoisFormGroup(mois).getRawValue();

            // Encaissements
            cumuls.ventes += this.safeValue(moisData.ventes);
            cumuls.autresRevenus += this.safeValue(moisData.autresRevenus);
            cumuls.pret += this.safeValue(moisData.pret);
            cumuls.totalEncaissements += this.safeValue(moisData.totalEncaissements);

            // Décaissements
            cumuls.achatMarchandises += this.safeValue(moisData.achatmarchandises);
            cumuls.mainoeuvre += this.safeValue(moisData.mainoeuvre);
            cumuls.investissement += this.safeValue(moisData.investissement);
            cumuls.impotstaxes += this.safeValue(moisData.impotstaxes);
            cumuls.loyer += this.safeValue(moisData.loyer);
            cumuls.utilities += this.safeValue(moisData.utilities);
            cumuls.transport += this.safeValue(moisData.transport);
            cumuls.salaires += this.safeValue(moisData.salaires);
            cumuls.fraistelephone += this.safeValue(moisData.fraistelephone);
            cumuls.chargesfinancieres += this.safeValue(moisData.chargesfinancieres);
            cumuls.entretien += this.safeValue(moisData.entretien);
            cumuls.autresdepenses += this.safeValue(moisData.autresdepenses);
            cumuls.totalDecaissements += this.safeValue(moisData.totalDecaissements);
            cumuls.excedentDeficit += this.safeValue(moisData.excedentDeficit);

            // Remboursements
            cumuls.interetsAVerser += this.safeValue(moisData.interetsAVerser);
            cumuls.remboursementCapital += this.safeValue(moisData.remboursementCapital);
        }

        return cumuls;
    }

    // Obtenir la valeur d'un champ pour un mois
    getFieldValue(mois: number, field: string): number {
        const moisForm = this.getMoisFormGroup(mois);
        const value = moisForm?.get(field)?.value;
        return this.safeValue(value);
    }

    // Convertir null/undefined en 0
    private safeValue(val: any): number {
        return val === null || val === undefined ? 0 : Number(val);
    }

    // Formater les montants
    formatMontant(montant: number): string {
        if (!montant || montant === 0) return '0';
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    // Obtenir la classe CSS pour les montants
    getMontantClass(value: number): string {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return '';
    }
}
