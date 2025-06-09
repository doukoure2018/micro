import { BilanEntreprise } from './bilan.entreprise';
import { BilanPersonnel } from './bilan.personnel';
import { CompteExploitation } from './compte.exploitation';
import { DemandeCredit } from './demande.credit';
import { Entreprise } from './entreprise';
import { Promoteur } from './promoteur';

export interface ResumeCredit {
    success?: boolean;
    demande_credit_id?: number;
    date_generation?: Date;
    promoteur?: Promoteur;
    entreprise?: Entreprise;
    bilan_entreprise?: BilanEntreprise;
    bilan_personnel?: BilanPersonnel;
    exploitation_actuelle?: CompteExploitation;
    exploitation_previsionnelle?: CompteExploitation;
    demande_credit?: DemandeCredit;
}
