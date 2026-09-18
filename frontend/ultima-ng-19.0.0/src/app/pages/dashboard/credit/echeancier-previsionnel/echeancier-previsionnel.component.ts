import { Echeancier } from '@/interface/demande-individuel.interface';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, computed, input } from '@angular/core';

registerLocaleData(localeFr, 'fr-FR');

/**
 * Tableau de l'échéancier prévisionnel avec moratoire (V147), calculé par le backend.
 * Réutilisé tel quel par la saisie de la demande groupe (aperçu), l'analyse agricole et le
 * détail du dossier vu par les approbateurs (DA / DR / DE / DG). Aucune formule ici : l'objet
 * reçu est affiché, avec les repères SAF pour la mise en place manuelle dans le core banking.
 */
@Component({
    selector: 'app-echeancier-previsionnel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './echeancier-previsionnel.component.html'
})
export class EcheancierPrevisionnelComponent {
    /** Échéancier à afficher ; null/undefined = rien (ou message d'erreur si `erreur` est renseigné). */
    echeancier = input<Echeancier | null | undefined>(null);
    titre = input<string>('Échéancier prévisionnel');
    /** Message renvoyé par le backend quand les modalités sont incohérentes (durée ≠ moratoire + échéances). */
    erreur = input<string | null | undefined>(null);
    /** Repères SAF (durée en jours, cuotas, taux annuel, date de début du plan) pour l'agent qui saisit le crédit dans SAF. */
    afficherReperesSaf = input<boolean>(true);

    /** Échéancier effectivement rendu : rien tant qu'une erreur est affichée. */
    visible = computed<Echeancier | null>(() => (this.erreur() ? null : this.echeancier() ?? null));
}
