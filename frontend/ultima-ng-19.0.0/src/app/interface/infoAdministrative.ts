import { Agence } from './agence';
import { Delegation } from './delegation';
import { PointVente } from './point.vente';
import { IUser } from './user';

export interface InfoAdministrative {
    delegationDto: Delegation;
    user: IUser;
    pointVenteDto: PointVente;
    agenceDto: Agence;
}
