import { ClientesPKId } from './clientes-pk-id.model';

export class ClientesDto {
    clientesPKId?: ClientesPKId;
    cat_CLIENTE?: string;
    nom_CLIENTE?: string;
    ind_PERSONA?: string;
    fec_INGRESO?: Date;
    tel_PRINCIPAL?: string;
    tel_SECUNDARIO?: string;
    tel_OTRO?: string;
    ind_RELACION?: string;
    codAgencia?: string;
    prov_SERV_DESTINO?: string;
}
