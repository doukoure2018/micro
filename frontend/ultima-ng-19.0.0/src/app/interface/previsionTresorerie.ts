import { PrevisionMensuelle } from './previsionsMensuelle';

export interface PrevisionTresorerie {
    id?: number;
    dossierId: number;
    clientId: number;
    clientNom?: string;
    dureeeMois: number;
    montantCredit: number;
    tauxInteret: number;
    dateCreation?: Date;
    statut?: 'EN_COURS' | 'VALIDE' | 'APPROUVE';
    previsionsMensuelles: PrevisionMensuelle[];
}
