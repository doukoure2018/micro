// credit-activite.model.ts

/**
 * Interface pour les types de crédit
 */
export interface TypeCredit {
    tip_CREDITO: number;
    des_TIP_CREDITO: string;
}

/**
 * Interface pour les activités
 */
export interface Activite {
    code: number;
    libelle: string;
}

/**
 * Interface pour les sous-activités
 */
export interface SousActivite {
    codeActivite: number;
    code: number;
    libelle: string;
}

/**
 * Interface pour les sous-sous-activités
 */
export interface SousSousActivite {
    codeActivite: number;
    codeSousActivite: number;
    code: number;
    libelle: string;
}

/**
 * Service de données pour les types de crédit et activités
 */
export class CreditActiviteData {
    /**
     * Liste des types de crédit
     */
    static readonly TYPES_CREDIT: TypeCredit[] = [
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
     * Liste des activités principales
     */
    static readonly ACTIVITES: Activite[] = [
        { code: 101, libelle: 'AGRICULTURE ELEVAGE ET PECHE' },
        { code: 102, libelle: 'COMMERCE' },
        { code: 103, libelle: 'HOTELERIE ET RESTAURATION' },
        { code: 104, libelle: 'ARTISANAT' },
        { code: 105, libelle: 'SERVICE ET FORMATION' },
        { code: 106, libelle: 'TRANSPORT ET AUTRES' },
        { code: 107, libelle: 'IMMOBILIER ET LOGEMENT' },
        { code: 108, libelle: 'BATIMENTS ET TRAVAUX PUBLICS' },
        { code: 109, libelle: 'MINES ET GEOLOGIE' },
        { code: 110, libelle: 'FONCTIONNAIRES ET SALARIES' }
        // 199 - A NE PAS UTILISER est exclu
    ];

    /**
     * Liste des sous-activités
     */
    static readonly SOUS_ACTIVITES: SousActivite[] = [
        // Agriculture, Elevage et Pêche (101)
        { codeActivite: 101, code: 201, libelle: 'PRODUCTION VEGETALE' },
        { codeActivite: 101, code: 202, libelle: 'PRODUCTION ANIMALE' },
        { codeActivite: 101, code: 203, libelle: 'TRANSFORMATION AGRICOLE' },
        { codeActivite: 101, code: 204, libelle: 'COMMERCIALISATION AGRICOLE' },

        // Commerce (102)
        { codeActivite: 102, code: 201, libelle: 'COMMERCE DE GROS' },
        { codeActivite: 102, code: 202, libelle: 'COMMERCE DE DÉTAIL' },

        // Hôtellerie et Restauration (103)
        { codeActivite: 103, code: 201, libelle: 'HOTEL' },
        { codeActivite: 103, code: 202, libelle: 'MOTEL AUBERGE' },
        { codeActivite: 103, code: 203, libelle: 'RESTAURANT' },
        { codeActivite: 103, code: 204, libelle: 'CAFÉTARIAT' },

        // Artisanat (104)
        { codeActivite: 104, code: 201, libelle: 'MENUISERIE' },
        { codeActivite: 104, code: 202, libelle: 'SOUDURE' },
        { codeActivite: 104, code: 203, libelle: 'COIFFURE' },
        { codeActivite: 104, code: 204, libelle: 'MECANIQUE' },
        { codeActivite: 104, code: 205, libelle: 'MAÇONNERIE' },
        { codeActivite: 104, code: 206, libelle: 'CORDONNERIE' },

        // Service et Formation (105)
        { codeActivite: 105, code: 201, libelle: 'FORMATION' },
        { codeActivite: 105, code: 202, libelle: 'CABINET DE SOINS - CLINIQUE PRIVÉ' },
        { codeActivite: 105, code: 203, libelle: "CABINET D'EXPERTISE" },

        // Transport et Autres (106)
        { codeActivite: 106, code: 201, libelle: 'TRANSPORT DE PERSONNES' },
        { codeActivite: 106, code: 202, libelle: 'TRANSPORT DE MARCHANDISES' },
        { codeActivite: 106, code: 203, libelle: 'VENTE DE BILLETERIE - TOURISME' },

        // Immobilier et Logement (107)
        { codeActivite: 107, code: 201, libelle: 'APPARTEMENT ET MAISON LOCATIVE' },

        // Bâtiments et Travaux Publics (108)
        { codeActivite: 108, code: 201, libelle: 'CHANTIERS ETATIQUES' },
        { codeActivite: 108, code: 202, libelle: 'CHANTIERS PRIVES' },

        // Mines et Géologie (109)
        { codeActivite: 109, code: 201, libelle: 'EXPLOITATION DE CARRIÈRE' },
        { codeActivite: 109, code: 202, libelle: "EXPLOITATION D'AUTRES MINÉRAUX" },

        // Fonctionnaires et Salariés (110)
        { codeActivite: 110, code: 201, libelle: 'SALARIÉ ENTREPRISE PRIVÉE' },
        { codeActivite: 110, code: 202, libelle: 'SALARIÉ ENTREPRISE PUBLIQUE' },
        { codeActivite: 110, code: 203, libelle: "FONCTIONNAIRE D'ÉTAT" }
    ];

    /**
     * Liste des sous-sous-activités (échantillon - liste complète très longue)
     */
    static readonly SOUS_SOUS_ACTIVITES: SousSousActivite[] = [
        // Production Végétale (101-201)
        { codeActivite: 101, codeSousActivite: 201, code: 301, libelle: 'AGRUME' },
        { codeActivite: 101, codeSousActivite: 201, code: 302, libelle: 'ANACARDE' },
        { codeActivite: 101, codeSousActivite: 201, code: 303, libelle: 'ANANAS' },
        { codeActivite: 101, codeSousActivite: 201, code: 304, libelle: 'ARACHIDE' },
        { codeActivite: 101, codeSousActivite: 201, code: 305, libelle: 'AVOCAT' },
        { codeActivite: 101, codeSousActivite: 201, code: 306, libelle: 'BANANE' },
        { codeActivite: 101, codeSousActivite: 201, code: 307, libelle: 'CACAO' },
        { codeActivite: 101, codeSousActivite: 201, code: 308, libelle: 'CAFÉ' },
        { codeActivite: 101, codeSousActivite: 201, code: 309, libelle: 'CÉRÉALE BLE' },
        { codeActivite: 101, codeSousActivite: 201, code: 310, libelle: 'CÉRÉALE FONIO' },
        { codeActivite: 101, codeSousActivite: 201, code: 311, libelle: 'CÉRÉALE MAÏS' },
        { codeActivite: 101, codeSousActivite: 201, code: 312, libelle: 'CÉRÉALE MIL' },
        { codeActivite: 101, codeSousActivite: 201, code: 313, libelle: 'CÉRÉALE RIZ' },
        { codeActivite: 101, codeSousActivite: 201, code: 314, libelle: 'CÉRÉALE SORGHO' },
        { codeActivite: 101, codeSousActivite: 201, code: 340, libelle: 'AUTRES CULTURES' },

        // Production Animale (101-202)
        { codeActivite: 101, codeSousActivite: 202, code: 341, libelle: 'APICULTURE PRODUCTION MIEL' },
        { codeActivite: 101, codeSousActivite: 202, code: 342, libelle: 'AQUACULTURE' },
        { codeActivite: 101, codeSousActivite: 202, code: 343, libelle: 'AVICULTURE' },
        { codeActivite: 101, codeSousActivite: 202, code: 344, libelle: 'CHASSE' },
        { codeActivite: 101, codeSousActivite: 202, code: 345, libelle: 'ÉLEVAGE BOVIN' },
        { codeActivite: 101, codeSousActivite: 202, code: 346, libelle: 'ÉLEVAGE CAMELIN' },
        { codeActivite: 101, codeSousActivite: 202, code: 347, libelle: 'ÉLEVAGE CANIN' },
        { codeActivite: 101, codeSousActivite: 202, code: 348, libelle: 'ÉLEVAGE CAPRIN' },
        { codeActivite: 101, codeSousActivite: 202, code: 349, libelle: "ÉLEVAGE D'AULACODES" },
        { codeActivite: 101, codeSousActivite: 202, code: 350, libelle: 'ÉLEVAGE OVIN' },
        { codeActivite: 101, codeSousActivite: 202, code: 351, libelle: 'ÉLEVAGE PORCIN' },
        { codeActivite: 101, codeSousActivite: 202, code: 352, libelle: 'PÊCHE' },
        { codeActivite: 101, codeSousActivite: 202, code: 353, libelle: 'PISCICULTURE' },

        // Commerce de Gros (102-201)
        { codeActivite: 102, codeSousActivite: 201, code: 301, libelle: 'COMMERCE GÉNÉRAL' },
        { codeActivite: 102, codeSousActivite: 201, code: 302, libelle: 'FOURNITURES DE BUREAU ET SCOLAIRE' },
        { codeActivite: 102, codeSousActivite: 201, code: 303, libelle: 'MATÉRIELS DE CONSTRUCTION' },
        { codeActivite: 102, codeSousActivite: 201, code: 304, libelle: 'MATÉRIELS ET MOBILIER DE BUREAU' },
        { codeActivite: 102, codeSousActivite: 201, code: 305, libelle: 'PRODUITS ALIMENTAIRES' },

        // Commerce de Détail (102-202)
        { codeActivite: 102, codeSousActivite: 202, code: 301, libelle: 'COMMERCE GÉNÉRAL' },
        { codeActivite: 102, codeSousActivite: 202, code: 302, libelle: 'FOURNITURES DE BUREAU ET SCOLAIRE' },
        { codeActivite: 102, codeSousActivite: 202, code: 307, libelle: 'PHARMACIE' },

        // Hôtellerie (103)
        { codeActivite: 103, codeSousActivite: 201, code: 301, libelle: 'HOTEL' },
        { codeActivite: 103, codeSousActivite: 202, code: 302, libelle: 'MOTEL AUBERGE' },
        { codeActivite: 103, codeSousActivite: 203, code: 303, libelle: 'RESTAURANT' },
        { codeActivite: 103, codeSousActivite: 204, code: 304, libelle: 'CAFÉTARIAT' },

        // Salariés (110)
        { codeActivite: 110, codeSousActivite: 201, code: 301, libelle: 'BAPTEME' },
        { codeActivite: 110, codeSousActivite: 201, code: 302, libelle: 'MARIAGE' },
        { codeActivite: 110, codeSousActivite: 201, code: 303, libelle: 'HOSPITALISATION' },
        { codeActivite: 110, codeSousActivite: 201, code: 304, libelle: 'SOINS DE SANTE' },
        { codeActivite: 110, codeSousActivite: 201, code: 305, libelle: 'DECES' },
        { codeActivite: 110, codeSousActivite: 201, code: 306, libelle: 'PELERINAGE' },
        { codeActivite: 110, codeSousActivite: 201, code: 307, libelle: 'SACRIFICE' }

        // Note: La liste complète est très longue.
        // Vous pouvez ajouter le reste selon vos besoins
    ];

    /**
     * Obtenir les sous-activités filtrées par code d'activité
     */
    static getSousActivitesByActivite(codeActivite: number): SousActivite[] {
        return this.SOUS_ACTIVITES.filter((sa) => sa.codeActivite === codeActivite);
    }

    /**
     * Obtenir les sous-sous-activités filtrées
     */
    static getSousSousActivites(codeActivite: number, codeSousActivite: number): SousSousActivite[] {
        return this.SOUS_SOUS_ACTIVITES.filter((ssa) => ssa.codeActivite === codeActivite && ssa.codeSousActivite === codeSousActivite);
    }

    /**
     * Obtenir une activité par son code
     */
    static getActiviteByCode(code: number): Activite | undefined {
        return this.ACTIVITES.find((a) => a.code === code);
    }

    /**
     * Obtenir une sous-activité par ses codes
     */
    static getSousActiviteByCode(codeActivite: number, code: number): SousActivite | undefined {
        return this.SOUS_ACTIVITES.find((sa) => sa.codeActivite === codeActivite && sa.code === code);
    }

    /**
     * Obtenir un type de crédit par son ID
     */
    static getTypeCreditById(tipCredito: number): TypeCredit | undefined {
        return this.TYPES_CREDIT.find((tc) => tc.tip_CREDITO === tipCredito);
    }
}
