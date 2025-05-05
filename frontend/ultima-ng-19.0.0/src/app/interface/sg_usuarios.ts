import { UsariosPKId } from './usuarios.pkid';

export interface SG_USUARIOS {
    usariosPKId?: UsariosPKId;
    codPuesto?: string;
    nom_USUARIO?: string;
    indActivo?: string;
    fec_INGRESO?: Date;
    ind_PRINCIPIANTE?: string;
    palabra_PASO?: string;
    tip_USUARIO?: string;
    tip_FUNCION?: string;
    nivel_FUNCION?: string;
    tipo_ACCESO?: string;
    fec_VENC_USUARIO?: Date;
    fec_VENC_PALABRA_PASO?: Date;
    cod_USUARIO_BD?: string;
    palabra_PASO_BD?: string;
    cod_IDIOMA?: string;
}
