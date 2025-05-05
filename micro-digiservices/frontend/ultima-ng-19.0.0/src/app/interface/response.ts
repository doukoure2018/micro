import { Agence } from './agence';
import { ClientesDto } from './clientes-dto.model';
import { Credit } from './credit';
import { Delegation } from './delegation';
import { DemandeIndividuel } from './demande-individuel.interface';
import { PlanPagos } from './plan.pagos';
import { PointVente } from './point.vente';
import { IRole } from './role';
import { Selection } from './selection';
import { SG_USUARIOS } from './sg_usuarios';
import { TypeCreditDto } from './typeCredit.model';
import { IUser } from './user';

export interface IResponse {
    time: Date | string;
    code: number;
    statut: string;
    message: string;
    path: string;
    exception: string;
    data: {
        user?: IUser;
        users?: IUser[];
        role?: IRole;
        roles?: IRole[];
        credit?: Credit;
        credits?: Credit[];
        planpagos: PlanPagos[];
        clientes: ClientesDto;
        typeCreditos: TypeCreditDto[];
        demandeIndividuel: DemandeIndividuel;
        demandeAttentes: DemandeIndividuel[];
        delegations: Delegation[];
        agences: Agence[];
        pointVentes: PointVente[];
        pointVente: PointVente;
        usuarios: SG_USUARIOS[];
        selection?: Selection;
        documents?: Selection[];
    };
}
