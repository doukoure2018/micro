import { LigneDecaissement } from './ligne-decaissement';
import { LigneEncaissement } from './ligne-encaissement';

export interface PrevisionMensuelle {
    id?: number;
    numeroMois: number;
    soldeDebut: number;

    // Encaissements
    encaissements: LigneEncaissement[];
    totalEncaissements?: number;

    // Décaissements
    decaissements: LigneDecaissement[];
    totalDecaissements?: number;

    // Calculs automatiques
    disponibleEnCaisse?: number;
    excedentDeficit?: number;
    interetsAVerser?: number;
    remboursementCapital?: number;
    soldeFin?: number;
}
