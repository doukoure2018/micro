import { CompteInfo } from './CompteInfo';

export interface FicheSignaletiqueWithSolde {
    // Informations de base
    codEmpresa: string;
    codCliente: string;
    catCliente: string;
    nomCliente: string;
    indPersona: string;
    fecIngreso: string;
    telPrincipal: string;
    telSecundario?: string;
    telOtro?: string;
    indRelacion: string;
    fecReactivacion?: string;
    codAgencia: string;
    codcteAsoCom?: string;
    codcteGrpSol?: string;
    provServDestino: string;

    // Informations personne physique
    codProfesion: string;
    codActividad: string;
    codSector: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    estCivil: string;
    indSexo: string;
    nomConyugue?: string;
    nacionalidad: string;
    lugarNacimiento: string;
    numHijos: number;
    tenenciaVivienda: string;
    antiguedadResidencia: number;
    codCteConyugue?: string;
    tenenciaPuesto: string;
    antiguedadPuesto: number;

    // Informations d'identification
    codTipoId: string;
    numId: string;
    fecVencim: string;

    // Informations associé
    indEstado: string;
    fechIngresoAsociado: string;
    fechInactivacion?: string;
    fechRenuncia?: string;
    codMotRenuncia?: string;
    codPlanilla?: string;
    tipAsociado: string;
    lugarTrabajo?: string;
    tipTrabajo?: string;
    salario?: number;
    cantDependientes?: number;
    dirTrabajo?: string;
    nomBeneficiario: string;
    relacBeneficiario: string;
    fechNacimiento: string;
    numSesion?: number;
    numArticulo?: number;
    tipoUnion?: string;
    tipoPlanilla?: string;
    puesto?: string;

    // Informations adresse
    codDireccion: string;
    codPais: string;
    codProvincia: string;
    codCanton: string;
    codDistrito: string;
    tipDireccion: string;
    apdoPostal?: string;
    codPostal?: string;
    detDireccion: string;

    // Meta information
    clientExists: boolean;

    // Informations de comptes et soldes
    comptes: CompteInfo[];
    totalComptes: number;
    comptesActifs: number;
    comptesInactifs: number;
    totalSoldeDisponible: number;
    totalSoldeMoyen: number;
    totalSoldeCongelado: number;
    totalSoldeTransit: number;
    totalSoldeReserve: number;

    // Libellés formatés
    statutClientLibelle: string;
    nombreComplet: string;
    estatCivilLibelle: string;
    typeHabitationLibelle: string;
    typeTravailLibelle: string;
    sexeLibelle: string;
}

export interface FicheSignaletiqueMetadata {
    comptesParCategorie: { [key: string]: number };
    totalComptes: number;
    soldeSummary: {
        totalReserve: number;
        totalCongelado: number;
        totalTransit: number;
        totalMoyen: number;
        totalDisponible: number;
    };
    nomComplet: string;
    comptesActifs: number;
    clientExists: boolean;
    typePersonne: string;
    nombreComptes: number;
    comptesInactifs: number;
    statut: string;
}
