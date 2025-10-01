export interface CompteInfo {
    codAgencia: string;
    numCuenta: string;
    codCategoria: string;
    categorieLibelle: string;
    codSistema: string;
    codProducto: string;
    codUsuario: string;
    fecUltMovimiento: Date;
    salDisponible: number;
    salPromedio: number;
    salCongelado?: number;
    salTransito?: number;
    salReserva?: number;
    indEstado?: string;
    statutCompte?: string;
    fecApertura?: Date;
    joursSansMouvement?: number;
}
