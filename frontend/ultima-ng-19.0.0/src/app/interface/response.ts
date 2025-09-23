import { Actividad } from './actividad.model';
import { Agence } from './agence';
import { AnalyseComplete } from './analyseComplete';
import { Appreciation } from './appreciation';
import { Avis } from './avis';
import { BilanEntreprise } from './bilan.entreprise';
import { BilanPersonnel } from './bilan.personnel';
import { CategorieStockDto } from './CategorieStockDto';
import { ChargeInd } from './ChargeInd';
import { ClientesDto } from './clientes-dto.model';
import { CompteExploitation } from './compte.exploitation';
import { Credit } from './credit';
import { CreditDataResponse } from './credit.data.response';
import { CreditosClienteResponseDTO } from './CreditosClienteResponseDTO';
import { CreditResponse } from './creditResponse';
import { Delegation } from './delegation';
import { DemandeIndividuel } from './demande-individuel.interface';
import { DemandeCredit } from './demande.credit';
import { DossierCreditRequest } from './dossierCreditRequest';
import { Entreprise } from './entreprise';
import { FicheSignaletique } from './ficheSignaletique';
import { Garantiepersonnecaution } from './Garantiepersonnecaution';
import { Individuel } from './individuel';
import { InfoAdministrative } from './infoAdministrative';
import { InstanceCreditView } from './instance-credit-view';
import { Inversion } from './inversion.model';
import { MotifAnalyse } from './motif.analyse';
import { NewCredit } from './newCredit';
import { NoteAnalyse } from './note-analyse.model';
import { NoteGarantie } from './note-garantie.model';
import { NoteProfile } from './note-profile.model';
import { OriginFond } from './originFonds';
import { Personnecaution } from './personnecaution';
import { PersonnePhysique } from './personnePhysique';

import { PlanPagos } from './plan.pagos';
import { PointVente } from './point.vente';
import {
    AnalyseCreditDto,
    CapaciteRemboursementDto,
    CategorieDto,
    ClientDto,
    DashboardStatsDto,
    DossierCreditDto,
    ImportResultDto,
    LigneDecaissementDto,
    LigneEncaissementDto,
    PrevisionTresorerieDto,
    RatiosFinanciersDto,
    RemboursementDto,
    StatsMensuelsDto,
    TopClientDto
} from './prevision-tresorerie-dto';
import { ProcessCreditInd } from './process.credit.ind';
import { ProductInd } from './ProductInd';
import { Promoteur } from './promoteur';
import { ReconciliationResultDTO } from './ReconciliationResultDTO';
import { RequisitoRequest } from './requisitoRequest';
import { ResultNote } from './result.note';
import { ResumeCredit } from './resumeCredit.model';
import { IRole } from './role';
import { Selection } from './selection';
import { SG_USUARIOS } from './sg_usuarios';
import { SousActivite } from './sous-activite.model';
import { SousSousActivite } from './sous-sous-activite.model';
import { StockResponseDto } from './StockResponseDto';
import { TipoPlazo } from './tipo-plazo.model';
import { TypeCreditDto } from './typeCredit.model';
import { IUser } from './user';
export interface IResponse {
    time: Date | string;
    code: number;
    statut?: string;
    httpStatus?: string;
    message: string;
    path: string;
    exception?: string;
    data: {
        cautions: Personnecaution[];
        origineFonds: string;
        user?: IUser;
        users?: IUser[];
        role?: IRole;
        roles?: IRole[];
        credit?: Credit;
        credits?: Credit[];
        planpagos: PlanPagos[];
        clientes: ClientesDto;
        typeCreditos: TypeCreditDto[];
        typeCredito: TypeCreditDto;
        demandeIndividuel: DemandeIndividuel;
        demandeAttentes: DemandeIndividuel[];
        delegations: Delegation[];
        delegation: Delegation;
        agences: Agence[];
        agence: Agence;
        pointVentes: PointVente[];
        pointVente: PointVente;
        usuario: SG_USUARIOS;
        usuarios: SG_USUARIOS[];
        selection?: Selection;
        documents?: Selection[];
        individuels?: Individuel[];
        individuel?: Individuel;
        creditDto?: NewCredit;
        creditDtos?: NewCredit[];
        precessCreditInd?: ProcessCreditInd;
        instanceCreditInd?: InstanceCreditView;
        membre?: ClientesDto;
        charges?: ChargeInd[];
        products?: ProductInd[];
        garantieCaution?: Garantiepersonnecaution[];

        noteProfiles?: NoteProfile[];
        noteProfile?: NoteProfile;
        noteAnalyses?: NoteAnalyse[];
        noteAnalyse?: NoteAnalyse;
        noteGaranties?: NoteGarantie[];
        noteGarantie?: NoteGarantie;
        resultNote?: ResultNote;
        appreciation?: Appreciation;
        nombreDemandeInd?: number;

        originFonds?: OriginFond[];
        cumulCredit?: number;
        countCredit?: number;
        inversions?: Inversion[];
        actividas?: Actividad[];
        sousActividas?: SousActivite[];
        sousSousActividas?: SousSousActivite[];
        requisitos?: RequisitoRequest[];
        numCredito?: string;
        terms?: TipoPlazo[];
        creditResponse?: CreditResponse;

        demandeAnalyseCredits?: DemandeCredit[];
        promoteur?: Promoteur;
        entreprise?: Entreprise;
        bilan_entreprise?: BilanEntreprise;
        bilan_personnel?: BilanPersonnel;
        exploitation_actuelle?: CompteExploitation;
        exploitation_previsionnelle?: CompteExploitation;
        demande_credit?: DemandeCredit;

        resumeCredit?: ResumeCredit;

        histoCredits?: CreditosClienteResponseDTO;
        personnecautions: Personnecaution[];
        infoAdministrative?: InfoAdministrative;

        creditData?: CreditDataResponse;

        motifAnalyse?: MotifAnalyse;

        // AJOUT : Propriétés manquantes pour l'analyse complète
        analyseComplete?: AnalyseComplete;
        success?: boolean; // Pour les réponses de mise à jour

        stocks?: StockResponseDto[];
        stock?: StockResponseDto;
        listCategorieStock?: CategorieStockDto[];

        // NOUVELLES PROPRIÉTÉS POUR PRÉVISIONS TRÉSORERIE
        // Clients
        client?: ClientDto;
        clients?: any; // Page<ClientDto>

        // Dossiers
        dossier?: DossierCreditDto;
        dossiers?: any; // Page<DossierCreditDto> ou List<DossierCreditDto>

        // Prévisions de trésorerie
        prevision?: PrevisionTresorerieDto;
        previsions?: PrevisionTresorerieDto[];
        previsionsTresorerie?: PrevisionTresorerieDto[];

        // Lignes encaissement/décaissement
        encaissements?: LigneEncaissementDto[];
        encaissement?: LigneEncaissementDto;
        decaissements?: LigneDecaissementDto[];
        decaissement?: LigneDecaissementDto;

        // Analyse
        analyse?: AnalyseCreditDto;
        ratios?: RatiosFinanciersDto;
        capaciteRemboursement?: CapaciteRemboursementDto;

        // Remboursements
        remboursement?: RemboursementDto;
        remboursements?: RemboursementDto[];

        // Catégories
        categoriesEncaissement?: CategorieDto[];
        categoriesDecaissement?: CategorieDto[];

        // Import/Export
        importResult?: ImportResultDto;

        // Dashboard
        dashboardStats?: DashboardStatsDto;
        statsMensuels?: StatsMensuelsDto[];
        topClients?: TopClientDto[];

        demandeId?: number;
        count?: number;
        hasDemandeCredit?: boolean;
        hasDossierCredit?: boolean;
        dossierCredit?: DossierCreditRequest;
        avis?: Avis;
        avisList?: Avis[];
        reconciliationResultDTO?: ReconciliationResultDTO;
        data?: FicheSignaletique;
        personnePhysique?: PersonnePhysique;
    };
}
