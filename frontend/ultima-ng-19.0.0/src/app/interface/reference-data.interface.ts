// src/app/interface/reference-data.interface.ts

export interface ReferenceOption {
    code: string;
    label: string;
    codEmpresa?: string;
}

export interface DistrictOption extends ReferenceOption {
    codPays: string;
    codProvincia: string;
    codCanton?: string;
    codDistrito: string;
}

export class ReferenceData {
    // Secteurs d'activité
    static readonly SECTORS: ReferenceOption[] = [
        { code: '101', label: 'PRIMAIRE', codEmpresa: '00000' },
        { code: '102', label: 'SECONDAIRE', codEmpresa: '00000' },
        { code: '103', label: 'TERTIAIRE', codEmpresa: '00000' },
        { code: '104', label: 'QUATERNAIRE', codEmpresa: '00000' }
    ];

    // Activités
    static readonly ACTIVITIES: ReferenceOption[] = [
        { code: '101', label: 'AGRICULTURE ELEVAGE ET PECHE', codEmpresa: '00000' },
        { code: '102', label: 'COMMERCE', codEmpresa: '00000' },
        { code: '103', label: 'HOTELERIE ET RESTAURATION', codEmpresa: '00000' },
        { code: '104', label: 'ARTISANAT', codEmpresa: '00000' },
        { code: '105', label: 'SERVICE ET FORMATION', codEmpresa: '00000' },
        { code: '106', label: 'TRANSPORT ET AUTRES', codEmpresa: '00000' },
        { code: '107', label: 'IMMOBILIER ET LOGEMENT', codEmpresa: '00000' },
        { code: '108', label: 'BATIMENTS ET TRAVAUX PUBLICS', codEmpresa: '00000' },
        { code: '109', label: 'MINES ET GEOLOGIE', codEmpresa: '00000' },
        { code: '110', label: 'FONCTIONNAIRES ET SALARIES', codEmpresa: '00000' }
    ];

    // Professions
    static readonly PROFESSIONS: ReferenceOption[] = [
        { code: '101', label: 'CULTIVATEUR', codEmpresa: '00000' },
        { code: '102', label: 'ARTISAN', codEmpresa: '00000' },
        { code: '103', label: 'MECANICIEN', codEmpresa: '00000' },
        { code: '104', label: 'CHAUFFEUR', codEmpresa: '00000' },
        { code: '105', label: 'COMMERCANT', codEmpresa: '00000' },
        { code: '106', label: 'ENTREPRENEUR', codEmpresa: '00000' },
        { code: '107', label: 'ETUDIANT', codEmpresa: '00000' },
        { code: '108', label: 'FONCTIONNAIRE', codEmpresa: '00000' },
        { code: '109', label: 'JOURNALIER', codEmpresa: '00000' },
        { code: '110', label: 'MENAGERE', codEmpresa: '00000' },
        { code: '111', label: 'PECHEUR', codEmpresa: '00000' },
        { code: '112', label: 'EMPLOYE DE BUREAU', codEmpresa: '00000' },
        { code: '113', label: 'TECHNICIEN', codEmpresa: '00000' },
        { code: '114', label: 'TRAVAILLEUR AUTONOME', codEmpresa: '00000' },
        { code: '115', label: 'ACHETEUR', codEmpresa: '00000' },
        { code: '116', label: 'INFORMATICIEN', codEmpresa: '00000' },
        { code: '117', label: 'ETALAGISTE', codEmpresa: '00000' },
        { code: '118', label: 'PHARMACIEN', codEmpresa: '00000' },
        { code: '119', label: 'GARGOTIERE', codEmpresa: '00000' },
        { code: '120', label: 'TAILLEUR', codEmpresa: '00000' },
        { code: '121', label: 'FERAILLEUR', codEmpresa: '00000' },
        { code: '122', label: 'MACON', codEmpresa: '00000' },
        { code: '123', label: 'SALARIE SECT. PRIVE', codEmpresa: '00000' },
        { code: '124', label: 'MILITAIRE', codEmpresa: '00000' },
        { code: '125', label: 'GENDARME', codEmpresa: '00000' },
        { code: '126', label: 'POLICIER', codEmpresa: '00000' },
        { code: '127', label: 'DOUANIER', codEmpresa: '00000' },
        { code: '128', label: 'CAMBISTE', codEmpresa: '00000' },
        { code: '129', label: 'TRANSITEUR', codEmpresa: '00000' },
        { code: '130', label: 'COMPTABLE', codEmpresa: '00000' },
        { code: '131', label: 'ENSEIGNANT', codEmpresa: '00000' },
        { code: '132', label: 'MEDECIN', codEmpresa: '00000' },
        { code: '133', label: 'SAGE FEMME', codEmpresa: '00000' },
        { code: '134', label: 'MATRONE', codEmpresa: '00000' },
        { code: '135', label: 'AGENT TECH. DE SANTE', codEmpresa: '00000' },
        { code: '136', label: 'TOLIER', codEmpresa: '00000' },
        { code: '137', label: 'SOUDEUR', codEmpresa: '00000' },
        { code: '138', label: 'MENUISIER', codEmpresa: '00000' },
        { code: '139', label: 'PEINTRE', codEmpresa: '00000' },
        { code: '140', label: 'JUGE', codEmpresa: '00000' },
        { code: '141', label: 'AVOCAT', codEmpresa: '00000' },
        { code: '142', label: 'SCULPTEUR', codEmpresa: '00000' },
        { code: '143', label: 'ARTISTE', codEmpresa: '00000' },
        { code: '144', label: 'ARCHITECTE', codEmpresa: '00000' },
        { code: '145', label: 'ELECTRICIEN', codEmpresa: '00000' },
        { code: '146', label: 'PHOTOGRAPHE', codEmpresa: '00000' },
        { code: '147', label: 'FORGERON', codEmpresa: '00000' },
        { code: '998', label: 'BIJOUTIER', codEmpresa: '00000' },
        { code: '999', label: 'AUTRES PROFESSIONS', codEmpresa: '00000' }
    ];

    // Types de pièces d'identité
    static readonly ID_TYPES: ReferenceOption[] = [
        { code: '101', label: "N° CARTE D'IDENTITE NATIONALE", codEmpresa: '00000' },
        { code: '102', label: 'N° PASSEPORT', codEmpresa: '00000' },
        { code: '103', label: 'N° PERMIS DE CONDUIRE', codEmpresa: '00000' },
        { code: '104', label: "N° CARTE D'IDENTITE SCOLAIRE", codEmpresa: '00000' },
        { code: '105', label: 'NUMERO MATRICULE', codEmpresa: '00000' },
        { code: '106', label: 'NUMERO DU RCCM', codEmpresa: '00000' },
        { code: '107', label: "N° CARTE D'ELECTEUR", codEmpresa: '00000' },
        { code: '108', label: 'NUMERO TELEPHONE', codEmpresa: '00000' },
        { code: '109', label: 'N° IDENTIFICATION NATIONALE (NIN)', codEmpresa: '00000' },
        { code: '110', label: "N° CARTE AUTRE D' CARTE D'ID", codEmpresa: '00000' },
        { code: '111', label: "N° CARTE D'IDENTITE NLE BIOMETRIQUE", codEmpresa: '00000' }
    ];

    // Provinces
    static readonly PROVINCES: ReferenceOption[] = [
        { code: '101', label: 'CONAKRY' },
        { code: '102', label: 'BEYLA' },
        { code: '103', label: 'BOFFA' },
        { code: '104', label: 'BOKE' },
        { code: '105', label: 'COYAH' },
        { code: '106', label: 'DABOLA' },
        { code: '107', label: 'DALABA' },
        { code: '108', label: 'DINGUIRAYE' },
        { code: '109', label: 'DUBREKA' },
        { code: '110', label: 'FARANAH' },
        { code: '111', label: 'FORECARIAH' },
        { code: '112', label: 'FRIA' },
        { code: '113', label: 'GAOUAL' },
        { code: '114', label: 'GUECKEDOU' },
        { code: '115', label: 'KANKAN' },
        { code: '116', label: 'KEROUANE' },
        { code: '117', label: 'KINDIA' },
        { code: '118', label: 'KISSIDOUGOU' },
        { code: '119', label: 'KOUBIA' },
        { code: '120', label: 'KOUNDARA' },
        { code: '121', label: 'KOUROUSSA' },
        { code: '122', label: 'LABE' },
        { code: '123', label: 'LELOUMA' },
        { code: '124', label: 'LOLA' },
        { code: '125', label: 'MACENTA' },
        { code: '126', label: 'MALI' },
        { code: '127', label: 'MAMOU' },
        { code: '128', label: 'MANDIANA' },
        { code: '129', label: "N'ZEREKORE" },
        { code: '130', label: 'PITA' },
        { code: '131', label: 'SIGUIRI' },
        { code: '132', label: 'TELIMELE' },
        { code: '133', label: 'TOUGUE' },
        { code: '134', label: 'YOMOU' }
    ];

    // Get districts by province
    // Get districts by province
    static getDistrictsByProvince(provinceCode: string): ReferenceOption[] {
        const districtsByProvince: { [key: string]: ReferenceOption[] } = {
            '101': [
                // CONAKRY
                { code: '301', label: 'ALMAMYA I' },
                { code: '302', label: 'ALMAMYA II' },
                { code: '303', label: 'BOULBINET' },
                { code: '304', label: 'CORONTHIE I' },
                { code: '305', label: 'CORONTHIE II' },
                { code: '306', label: 'KASSA' },
                { code: '307', label: 'KOULEWONDY' },
                { code: '308', label: 'MANQUEPAS' },
                { code: '309', label: 'SANDERVALIA' },
                { code: '310', label: 'SANS FIL' },
                { code: '311', label: 'TAMARA' },
                { code: '312', label: 'TEMINETAYE' },
                { code: '313', label: 'TOMBO 1' },
                { code: '314', label: 'TOMBO 2' },
                { code: '301', label: 'DIXINN CENTRE I' },
                { code: '302', label: 'DIXINN CENTRE II' },
                { code: '303', label: 'DIXINN GARE' },
                { code: '304', label: 'DIXINN GARE RAILS' },
                { code: '305', label: 'DIXINN MOSQUEE' },
                { code: '306', label: 'DIXINN PORT' },
                { code: '307', label: 'BELLE VUE ECOLE' },
                { code: '308', label: 'BELLE VUE MARCHE I' },
                { code: '309', label: 'BELLE VUE MARCHE II' },
                { code: '310', label: 'CAMAYENNE' },
                { code: '311', label: 'CAMEROUN' },
                { code: '301', label: 'C.U MATAM' },
                { code: '302', label: 'MAFANCO CENTRE' },
                { code: '303', label: 'MATAM LIDO' },
                { code: '301', label: 'C.U DE RATOMA' },
                { code: '302', label: 'RATOMA DISPENSAIRE' },
                { code: '303', label: 'BANTOUNKA I' },
                { code: '304', label: 'BANTOUNKA II' },
                { code: '301', label: 'C.U DE MATOTO' },
                { code: '302', label: 'MATOTO KHABITAYA' },
                { code: '303', label: 'MATOTO MARCHE' },
                { code: '319', label: 'HAFIA MOSQUEE' },
                { code: '329', label: 'SIMBAYA I' },
                { code: '330', label: 'SIMBAYA II' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '102': [
                // BEYLA
                { code: '301', label: 'C.U DE BEYLA' },
                { code: '302', label: 'BANANKORO' },
                { code: '303', label: 'DABADOU' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '103': [
                // BOFFA
                { code: '301', label: 'C.U. DE BOFFA' },
                { code: '302', label: 'ALMAMYA I' },
                { code: '303', label: 'ALMAMYA II' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '104': [
                // BOKE
                { code: '301', label: 'C.U DE BOKE' },
                { code: '302', label: 'BARALANDE' },
                { code: '303', label: 'CORRERAH' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '105': [
                // COYAH
                { code: '301', label: 'C.U DE COYAH' },
                { code: '302', label: 'BATOUYAH' },
                { code: '303', label: 'CENTRE' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '106': [
                // DABOLA
                { code: '301', label: 'C.U DE DABOLA' },
                { code: '302', label: 'BABILIA' },
                { code: '303', label: 'BANIRÉ' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '107': [
                // DALABA
                { code: '301', label: 'C.U DE DALABA' },
                { code: '302', label: 'DALABA MISSIDE' },
                { code: '303', label: 'DAR ES SALAM' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '108': [
                // DINGUIRAYE
                { code: '301', label: 'C.U DE DINGUIRAYE' },
                { code: '302', label: 'BALLAGNOUMAYA' },
                { code: '303', label: 'BHOURIA' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '109': [
                // DUBREKA
                { code: '301', label: 'C.U DE DUBREKA' },
                { code: '302', label: 'ANSOUMANIAH' },
                { code: '303', label: 'BAILOBAYA CENTRE' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '110': [
                // FARANAH
                { code: '301', label: 'C.U DE FARANAH' },
                { code: '302', label: 'ABATTOIR I' },
                { code: '303', label: 'ABATTOIR II' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '111': [
                // FORECARIAH
                { code: '301', label: 'C.U DE FORECARIAH' },
                { code: '302', label: 'FATACO I' },
                { code: '303', label: 'FATACO II' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '112': [
                // FRIA
                { code: '301', label: 'C.U DE FRIA' },
                { code: '302', label: 'ALPHA YAYA' },
                { code: '303', label: 'AVIATION I' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '113': [
                // GAOUAL
                { code: '301', label: 'C.U DE GAOUAL' },
                { code: '302', label: 'BARKÈRÈ' },
                { code: '303', label: 'BASSANTO' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '114': [
                // GUECKEDOU
                { code: '301', label: 'C.U DE GUECKEDOU' },
                { code: '302', label: 'BAFILABEN' },
                { code: '303', label: 'BALLADOU' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '115': [
                // KANKAN
                { code: '301', label: 'C.U DE KANKAN' },
                { code: '302', label: 'AVIATION' },
                { code: '303', label: 'BANANKORODA' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '116': [
                // KEROUANE
                { code: '301', label: 'C.U DE KEROUANE' },
                { code: '302', label: 'DIALA' },
                { code: '303', label: 'KAMANDOU' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '117': [
                // KINDIA
                { code: '301', label: 'C.U DE KINDIA' },
                { code: '302', label: 'ABATOIRE 1' },
                { code: '303', label: 'ABATTOIRE 2' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '118': [
                // KISSIDOUGOU
                { code: '301', label: 'C.U DE KISSIDOUGOU' },
                { code: '302', label: 'DAR-ES-SALAM' },
                { code: '303', label: 'DOUNINKONO' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '119': [
                // KOUBIA
                { code: '301', label: 'C.U DE KOUBIA' },
                { code: '302', label: 'BASSARATA' },
                { code: '303', label: 'GORDIO' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '120': [
                // KOUNDARA
                { code: '301', label: 'C.U DE KOUNDARA' },
                { code: '302', label: 'KANDAÏDA' },
                { code: '303', label: 'ATHIABALY' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '121': [
                // KOUROUSSA
                { code: '301', label: 'C.U DE KOUROUSSA' },
                { code: '302', label: 'DIARAGBELA 1' },
                { code: '303', label: 'DIARGBELA 2' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '122': [
                // LABE
                { code: '301', label: 'C.U DE LABE' },
                { code: '302', label: 'BAMBAYA' },
                { code: '303', label: 'COMPAYA' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '123': [
                // LELOUMA
                { code: '301', label: 'C.U DE LELOUMA' },
                { code: '302', label: 'DIALA II' },
                { code: '303', label: 'DIALA MISSIDE' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '124': [
                // LOLA
                { code: '301', label: 'C.U DE LOLA' },
                { code: '302', label: 'BALEMOU' },
                { code: '303', label: 'DOUSSOU (NQ)' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '125': [
                // MACENTA
                { code: '301', label: 'C.U DE MACENTA' },
                { code: '302', label: 'BAMALA' },
                { code: '303', label: 'BANIZE' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '126': [
                // MALI
                { code: '301', label: 'C.U DE MALI' },
                { code: '302', label: 'BANDOUYA' },
                { code: '303', label: 'BARA' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '127': [
                // MAMOU
                { code: '301', label: 'C.U DE MAMOU' },
                { code: '302', label: 'ABATTOIR I' },
                { code: '303', label: 'ABATTOIR II' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '128': [
                // MANDIANA
                { code: '301', label: 'C.U DE MANDIANA' },
                { code: '302', label: 'CHATEAU' },
                { code: '303', label: 'HERMAKONO' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '129': [
                // N'ZEREKORE
                { code: '301', label: "C.U DE N'ZEREKORE" },
                { code: '302', label: 'BELLE VUE' },
                { code: '303', label: 'COMMERCIAL' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '130': [
                // PITA
                { code: '301', label: 'C.U DE PITA' },
                { code: '302', label: 'BENDOUGOU' },
                { code: '303', label: 'DOW SARE' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '131': [
                // SIGUIRI
                { code: '301', label: 'C.U DE SIGUIRI' },
                { code: '302', label: 'BAMBALA' },
                { code: '303', label: 'BOLIBANA I' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '132': [
                // TELIMELE
                { code: '301', label: 'C.U DE TELIMELE' },
                { code: '302', label: 'BAGUIRE' },
                { code: '303', label: 'BARKERE' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '133': [
                // TOUGUE
                { code: '301', label: 'C.U DE TOUGUE' },
                { code: '302', label: 'BALLAMA' },
                { code: '303', label: 'BOLLET' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ],
            '134': [
                // YOMOU
                { code: '301', label: 'C.U DE YOMOU' },
                { code: '302', label: 'GBAMOU' },
                { code: '303', label: 'GBANAHOLY' },
                { code: '399', label: 'AUTRES LOCALITES' }
            ]
        };

        return districtsByProvince[provinceCode] || [];
    }
}
