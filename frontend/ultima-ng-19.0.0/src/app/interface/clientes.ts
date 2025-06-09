import { ClientesPKId } from './clientes-pk-id.model';

export interface ClientesDto {
    clientesPKId?: ClientesPKId;
    CAT_CLIENTE?: string;
    NOM_CLIENTE?: string;
    IND_PERSONA?: string;
    FEC_INGRESO?: Date;
    TEL_PRINCIPAL?: string;
    TEL_SECUNDARIO?: string;
    TEL_OTRO?: string;
    IND_RELACION?: string;
    codAgencia?: string;
    PROV_SERV_DESTINO?: string;
    codClienteMig?: string;
}
