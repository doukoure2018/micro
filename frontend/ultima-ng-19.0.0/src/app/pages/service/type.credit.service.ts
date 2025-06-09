import { Injectable } from '@angular/core';

export interface TypeCreditDto {
    tip_CREDITO: number;
    des_TIP_CREDITO: string;
}

@Injectable({
    providedIn: 'root'
})
export class TypeCreditService {
    private readonly creditTypes: TypeCreditDto[] = [
        { tip_CREDITO: 1, des_TIP_CREDITO: 'CREDIT RURAL SOLIDAIRE' },
        { tip_CREDITO: 2, des_TIP_CREDITO: 'CREDIT AGRICOLE SOLIDAIRE ORDINAIRE' },
        { tip_CREDITO: 3, des_TIP_CREDITO: 'CREDIT COMMERCIALE SOLIDAIRE' },
        { tip_CREDITO: 4, des_TIP_CREDITO: 'ASSOCIATION DE CAUTION MUTUELLE' },
        { tip_CREDITO: 5, des_TIP_CREDITO: 'CREDIT STOCKAGE ET EMBOUCHE' },
        { tip_CREDITO: 6, des_TIP_CREDITO: 'CREDIT MOYEN TERME' },
        { tip_CREDITO: 7, des_TIP_CREDITO: 'CREDIT FONCTIONNAIRES EPARGNANTS' },
        { tip_CREDITO: 8, des_TIP_CREDITO: 'CREDIT DEPANNAGE FONCTIONNAIRES ET RETRAITES' },
        { tip_CREDITO: 9, des_TIP_CREDITO: 'CREDIT MOURABAHA' },
        { tip_CREDITO: 10, des_TIP_CREDITO: 'CREDIT AGRICOLE SOLIDAIRE RENTE' },
        { tip_CREDITO: 11, des_TIP_CREDITO: 'CREDIT COMMERCIAL PECHE' },
        { tip_CREDITO: 12, des_TIP_CREDITO: 'CREDIT OIM' },
        { tip_CREDITO: 13, des_TIP_CREDITO: 'CREDIT ELUS' },
        { tip_CREDITO: 14, des_TIP_CREDITO: 'CREDIT ANAMIF' },
        { tip_CREDITO: 15, des_TIP_CREDITO: 'CREDITS CT PERSONNEL CDS' },
        { tip_CREDITO: 16, des_TIP_CREDITO: 'CREDITS CT PERSONNEL PRETS SOCIAUX' },
        { tip_CREDITO: 17, des_TIP_CREDITO: 'CREDITS CT PERSONNEL PRETS VEHICULE' },
        { tip_CREDITO: 18, des_TIP_CREDITO: 'CREDITS MT PERSONNEL CDS' },
        { tip_CREDITO: 19, des_TIP_CREDITO: 'CREDITS MT PERSONNEL PRETS SOCIAUX' },
        { tip_CREDITO: 20, des_TIP_CREDITO: 'CREDITS MT PERSONNEL PRETS VEHICULE' },
        { tip_CREDITO: 21, des_TIP_CREDITO: 'CREDITS LT PERSONNE CDS' },
        { tip_CREDITO: 22, des_TIP_CREDITO: 'CREDITS LT PERSONNEL PRETS SOCIAUX' },
        { tip_CREDITO: 23, des_TIP_CREDITO: 'CREDITS LT PERSONNEL PRETS VEHICULE' },
        { tip_CREDITO: 24, des_TIP_CREDITO: 'CREDIT WARRANTAGE' },
        { tip_CREDITO: 25, des_TIP_CREDITO: 'CREDIT TONTINE' },
        { tip_CREDITO: 26, des_TIP_CREDITO: 'CREDIT MOTEUR HORS BORD' },
        { tip_CREDITO: 27, des_TIP_CREDITO: 'CREDIT PROJET VILLAGE DURABLE GUINEE' },
        { tip_CREDITO: 28, des_TIP_CREDITO: 'CREDIT AVANCE SALAIRE FONCTIONAIRES VIRES' },
        { tip_CREDITO: 29, des_TIP_CREDITO: 'CREDIT PRÊTS SCOLAIRES' },
        { tip_CREDITO: 30, des_TIP_CREDITO: 'CREDIT PRETS EQUIPEMENTS' },
        { tip_CREDITO: 31, des_TIP_CREDITO: 'CREDIT PRÊTS INVESTISSEMENTS FONCTIONNAIRE' },
        { tip_CREDITO: 32, des_TIP_CREDITO: 'CREDIT BOEUF PDABAD' },
        { tip_CREDITO: 33, des_TIP_CREDITO: 'MICROCREDIT KIOSQUE' },
        { tip_CREDITO: 34, des_TIP_CREDITO: 'CREDIT EXPLOITATION AGRICOLE' },
        { tip_CREDITO: 35, des_TIP_CREDITO: 'CREDIT INTRANTS ET TRANSFORMATION PRODUITS AGRICOLES' },
        { tip_CREDITO: 36, des_TIP_CREDITO: 'CREDIT EQUIPEMENT AGRICOLE' },
        { tip_CREDITO: 37, des_TIP_CREDITO: 'CREDIT AGRICOLE PRODUCTION ANANAS' },
        { tip_CREDITO: 38, des_TIP_CREDITO: 'CREDIT EXTENSION AGRICOLE' },
        { tip_CREDITO: 39, des_TIP_CREDITO: 'CREDIT MOTO BAJAJ' },
        { tip_CREDITO: 40, des_TIP_CREDITO: 'CREDIT PERFORM WORLD' },
        { tip_CREDITO: 41, des_TIP_CREDITO: 'CREDIT EQUIPEMENT PERFORM WORLD' },
        { tip_CREDITO: 42, des_TIP_CREDITO: 'CREDIT PRODUCTION AGRICOLE' },
        { tip_CREDITO: 43, des_TIP_CREDITO: 'CREDIT TRANSFORMATION COMMERCIALISATION PRODUITS' },
        { tip_CREDITO: 44, des_TIP_CREDITO: 'CREDIT EQUIPEMENT AGRICOLE ET DE TRANSFORMATION PRODUITS' },
        { tip_CREDITO: 45, des_TIP_CREDITO: 'PASSEPORT BRIQUETERIE' },
        { tip_CREDITO: 46, des_TIP_CREDITO: 'PASSEPORT PDV CIMENT' },
        { tip_CREDITO: 47, des_TIP_CREDITO: 'PASSEPORT SALARIE' },
        { tip_CREDITO: 100, des_TIP_CREDITO: 'CREDITS REGULARISE OPS' }
    ];

    /**
     * Retourne tous les types de crédit disponibles
     */
    getAllCreditTypes(): TypeCreditDto[] {
        return [...this.creditTypes];
    }

    /**
     * Recherche un type de crédit par son ID
     * @param tipCredito - L'ID du type de crédit
     * @returns Le type de crédit trouvé ou undefined
     */
    getCreditTypeById(tipCredito: number): TypeCreditDto | undefined {
        return this.creditTypes.find((type) => type.tip_CREDITO === tipCredito);
    }

    /**
     * Retourne la description d'un type de crédit
     * @param tipCredito - L'ID du type de crédit
     * @returns La description du type de crédit ou un message par défaut
     */
    getCreditTypeDescription(tipCredito: number | undefined): string {
        if (!tipCredito) {
            return 'Type de crédit non défini';
        }

        const creditType = this.getCreditTypeById(tipCredito);
        return creditType ? creditType.des_TIP_CREDITO : `Type de crédit ${tipCredito}`;
    }

    /**
     * Recherche des types de crédit par mot-clé dans la description
     * @param keyword - Le mot-clé à rechercher
     * @returns Liste des types de crédit correspondants
     */
    searchCreditTypes(keyword: string): TypeCreditDto[] {
        if (!keyword.trim()) {
            return this.getAllCreditTypes();
        }

        const searchTerm = keyword.toLowerCase().trim();
        return this.creditTypes.filter((type) => type.des_TIP_CREDITO.toLowerCase().includes(searchTerm));
    }

    /**
     * Vérifie si un type de crédit existe
     * @param tipCredito - L'ID du type de crédit à vérifier
     * @returns true si le type existe, false sinon
     */
    creditTypeExists(tipCredito: number): boolean {
        return this.creditTypes.some((type) => type.tip_CREDITO === tipCredito);
    }

    /**
     * Retourne les types de crédit par catégorie
     * @param category - La catégorie à filtrer (ex: 'AGRICOLE', 'PERSONNEL', etc.)
     * @returns Liste des types de crédit de la catégorie
     */
    getCreditTypesByCategory(category: string): TypeCreditDto[] {
        const searchTerm = category.toLowerCase();
        return this.creditTypes.filter((type) => type.des_TIP_CREDITO.toLowerCase().includes(searchTerm));
    }

    /**
     * Retourne un type de crédit aléatoire (utile pour les tests)
     */
    getRandomCreditType(): TypeCreditDto {
        const randomIndex = Math.floor(Math.random() * this.creditTypes.length);
        return this.creditTypes[randomIndex];
    }

    /**
     * Retourne le nombre total de types de crédit
     */
    getTotalCreditTypesCount(): number {
        return this.creditTypes.length;
    }
}
