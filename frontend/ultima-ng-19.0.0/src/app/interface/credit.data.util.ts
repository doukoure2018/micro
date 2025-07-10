import { CautionData } from './caution.data';
import { ChargeData } from './charge.data';
import { CreditDataResponse } from './credit.data.response';
import { ProduitData } from './produit.data';

export class CreditDataUtil {
    /**
     * Parse les données JSON des produits
     */
    static parseProduitsData(produitsDataJson?: string): ProduitData[] {
        if (!produitsDataJson || produitsDataJson.trim() === '') {
            return [];
        }

        try {
            const data = JSON.parse(produitsDataJson);
            return Array.isArray(data)
                ? data.map((item) => ({
                      libele: item.libele,
                      prixUnit: item.prix_unit || item.prixUnit,
                      prix_unit: item.prix_unit || item.prixUnit,
                      qte: item.qte,
                      observation: item.observation,
                      createdAt: item.created_at || item.createdAt,
                      created_at: item.created_at || item.createdAt
                  }))
                : [];
        } catch (error) {
            console.error('Erreur lors du parsing des données produits:', error);
            return [];
        }
    }

    /**
     * Parse les données JSON des charges
     */
    static parseChargesData(chargesDataJson?: string): ChargeData[] {
        if (!chargesDataJson || chargesDataJson.trim() === '') {
            return [];
        }

        try {
            const data = JSON.parse(chargesDataJson);
            return Array.isArray(data)
                ? data.map((item) => ({
                      libele: item.libele,
                      prixUnit: item.prix_unit || item.prixUnit,
                      prix_unit: item.prix_unit || item.prixUnit,
                      qte: item.qte,
                      createAt: item.create_at || item.createAt,
                      create_at: item.create_at || item.createAt
                  }))
                : [];
        } catch (error) {
            console.error('Erreur lors du parsing des données charges:', error);
            return [];
        }
    }

    /**
     * Parse les données JSON des cautions
     */
    static parseCautionsData(cautionsDataJson?: string): CautionData[] {
        if (!cautionsDataJson || cautionsDataJson.trim() === '') {
            return [];
        }

        try {
            const data = JSON.parse(cautionsDataJson);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Erreur lors du parsing des données cautions:', error);
            return [];
        }
    }

    /**
     * Convertit une date ISO string en objet Date
     */
    static parseDate(dateString?: string): Date | null {
        if (!dateString) return null;
        try {
            return new Date(dateString);
        } catch (error) {
            console.error('Erreur lors du parsing de la date:', error);
            return null;
        }
    }

    /**
     * Formate un montant pour l'affichage
     */
    static formatCurrency(amount?: number, currency: string = 'GNF'): string {
        if (amount === null || amount === undefined) return '0';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Valide les données de crédit
     */
    static validateCreditData(creditData: CreditDataResponse): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!creditData.referenceCredit) {
            errors.push('Référence de crédit requise');
        }

        if (!creditData.moyenPerson) {
            errors.push('Moyen de transport personnel requis');
        }

        if (!creditData.bien) {
            errors.push('Bien requis');
        }

        if (!creditData.capital || creditData.capital <= 0) {
            errors.push('Capital doit être supérieur à 0');
        }

        if (!creditData.statutActivite) {
            errors.push("Statut d'activité requis");
        }

        if (!creditData.experience) {
            errors.push('Expérience requise');
        }

        if (!creditData.lieuxAct) {
            errors.push("Lieu d'activité requis");
        }

        if (!creditData.frequenceValue || creditData.frequenceValue <= 0) {
            errors.push('Fréquence doit être supérieure à 0');
        }

        if (!creditData.garantieLibele) {
            errors.push('Libellé de garantie requis');
        }

        if (!creditData.garantieMontant || creditData.garantieMontant <= 0) {
            errors.push('Montant de garantie doit être supérieur à 0');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Calcule le total des produits à partir des données JSON
     */
    static calculateTotalProduits(produitsDataJson?: string): number {
        const produits = this.parseProduitsData(produitsDataJson);
        return produits.reduce((total, produit) => {
            const prix = produit.prixUnit || produit.prix_unit || 0;
            const qte = produit.qte || 0;
            return total + prix * qte;
        }, 0);
    }

    /**
     * Calcule le total des charges à partir des données JSON
     */
    static calculateTotalCharges(chargesDataJson?: string): number {
        const charges = this.parseChargesData(chargesDataJson);
        return charges.reduce((total, charge) => {
            const prix = charge.prixUnit || charge.prix_unit || 0;
            const qte = charge.qte || 0;
            return total + prix * qte;
        }, 0);
    }

    /**
     * Calcule le résultat net (produits - charges)
     */
    static calculateNetResult(creditData: CreditDataResponse): number {
        const totalProduits = this.calculateTotalProduits(creditData.produitsData);
        const totalCharges = this.calculateTotalCharges(creditData.chargesData);
        return totalProduits - totalCharges;
    }
}
