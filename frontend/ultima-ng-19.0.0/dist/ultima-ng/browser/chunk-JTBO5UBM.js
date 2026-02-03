import {
  PasswordModule
} from "./chunk-NBJHCGNS.js";
import {
  FileUploadModule
} from "./chunk-ZNXRKGHP.js";
import "./chunk-UZIOTGW7.js";
import {
  PanelModule
} from "./chunk-WJXIL2JJ.js";
import {
  Textarea,
  TextareaModule
} from "./chunk-RW4OSSQT.js";
import {
  InputGroupModule
} from "./chunk-GEBY3FYZ.js";
import {
  MessageModule
} from "./chunk-CSEZIGTY.js";
import {
  Dialog,
  DialogModule
} from "./chunk-LPU4RT7P.js";
import "./chunk-WWXP2HWK.js";
import "./chunk-CXW3XKZ2.js";
import {
  Toast,
  ToastModule
} from "./chunk-6SRYYUT2.js";
import "./chunk-WQ2EPPBK.js";
import {
  ChipModule
} from "./chunk-SN3HAAMO.js";
import {
  DividerModule
} from "./chunk-VDET62CU.js";
import {
  Calendar,
  CalendarModule
} from "./chunk-NLXNXYLN.js";
import {
  TableModule
} from "./chunk-REDVHUQC.js";
import "./chunk-YZRRSC3U.js";
import "./chunk-6K6X5UBT.js";
import "./chunk-7HJ4XJ7U.js";
import "./chunk-UQSIOFSP.js";
import "./chunk-OCW7T434.js";
import "./chunk-4JIPYACT.js";
import "./chunk-6GA37Q7Z.js";
import "./chunk-544F7IXR.js";
import "./chunk-YBM6FZLP.js";
import "./chunk-U4P2VV4G.js";
import "./chunk-CPYA4VSS.js";
import {
  CardModule
} from "./chunk-H46GQ57A.js";
import {
  InputNumber,
  InputNumberModule
} from "./chunk-JGOABXTK.js";
import {
  RadioButton,
  RadioButtonModule
} from "./chunk-HY2A3TN6.js";
import "./chunk-YEN5RMZS.js";
import "./chunk-XS7IVZ5T.js";
import "./chunk-CUABQE42.js";
import {
  Dropdown,
  DropdownModule
} from "./chunk-ZCIQCP6V.js";
import "./chunk-V6CKOH3G.js";
import "./chunk-DBPX6ILC.js";
import "./chunk-WIQZFAVH.js";
import "./chunk-CCBQFN2J.js";
import {
  ProgressSpinner,
  ProgressSpinnerModule
} from "./chunk-Y2J5OGKB.js";
import {
  Router
} from "./chunk-BTKK64MU.js";
import "./chunk-36C7KO53.js";
import {
  takeUntilDestroyed
} from "./chunk-WRLBQDQK.js";
import "./chunk-KHEKFKWA.js";
import {
  InputText,
  InputTextModule
} from "./chunk-FZELBHWZ.js";
import "./chunk-4IUQ6KTI.js";
import "./chunk-IVSL2HKS.js";
import "./chunk-E352KRZV.js";
import "./chunk-HHD4PK4J.js";
import {
  ButtonDirective,
  ButtonModule
} from "./chunk-PJSNAOPI.js";
import {
  RippleModule
} from "./chunk-AP3OAIHW.js";
import {
  MessageService,
  PrimeTemplate
} from "./chunk-NQNBRQ7H.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-3HTR5OU7.js";
import {
  UserService
} from "./chunk-SQ5BRWVW.js";
import "./chunk-ZRELZ6R7.js";
import "./chunk-BMYIFZHZ.js";
import "./chunk-W3K3GK4Z.js";
import {
  CommonModule,
  DatePipe,
  DecimalPipe
} from "./chunk-SQQPVFHK.js";
import {
  DestroyRef,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/service/credit-activite.model.ts
var CreditActiviteData = class {
  /**
   * Liste des types de crédit
   */
  static TYPES_CREDIT = [
    { tip_CREDITO: 1, des_TIP_CREDITO: "CREDIT RURAL SOLIDAIRE" },
    { tip_CREDITO: 2, des_TIP_CREDITO: "CREDIT AGRICOLE SOLIDAIRE ORDINAIRE" },
    { tip_CREDITO: 3, des_TIP_CREDITO: "CREDIT COMMERCIALE SOLIDAIRE" },
    { tip_CREDITO: 4, des_TIP_CREDITO: "ASSOCIATION DE CAUTION MUTUELLE" },
    { tip_CREDITO: 5, des_TIP_CREDITO: "CREDIT STOCKAGE ET EMBOUCHE" },
    { tip_CREDITO: 6, des_TIP_CREDITO: "CREDIT MOYEN TERME" },
    { tip_CREDITO: 7, des_TIP_CREDITO: "CREDIT FONCTIONNAIRES EPARGNANTS" },
    { tip_CREDITO: 8, des_TIP_CREDITO: "CREDIT DEPANNAGE FONCTIONNAIRES ET RETRAITES" },
    { tip_CREDITO: 9, des_TIP_CREDITO: "CREDIT MOURABAHA" },
    { tip_CREDITO: 10, des_TIP_CREDITO: "CREDIT AGRICOLE SOLIDAIRE RENTE" },
    { tip_CREDITO: 11, des_TIP_CREDITO: "CREDIT COMMERCIAL PECHE" },
    { tip_CREDITO: 12, des_TIP_CREDITO: "CREDIT OIM" },
    { tip_CREDITO: 13, des_TIP_CREDITO: "CREDIT ELUS" },
    { tip_CREDITO: 14, des_TIP_CREDITO: "CREDIT ANAMIF" },
    { tip_CREDITO: 15, des_TIP_CREDITO: "CREDITS CT PERSONNEL CDS" },
    { tip_CREDITO: 16, des_TIP_CREDITO: "CREDITS CT PERSONNEL PRETS SOCIAUX" },
    { tip_CREDITO: 17, des_TIP_CREDITO: "CREDITS CT PERSONNEL PRETS VEHICULE" },
    { tip_CREDITO: 18, des_TIP_CREDITO: "CREDITS MT PERSONNEL CDS" },
    { tip_CREDITO: 19, des_TIP_CREDITO: "CREDITS MT PERSONNEL PRETS SOCIAUX" },
    { tip_CREDITO: 20, des_TIP_CREDITO: "CREDITS MT PERSONNEL PRETS VEHICULE" },
    { tip_CREDITO: 21, des_TIP_CREDITO: "CREDITS LT PERSONNE CDS" },
    { tip_CREDITO: 22, des_TIP_CREDITO: "CREDITS LT PERSONNEL PRETS SOCIAUX" },
    { tip_CREDITO: 23, des_TIP_CREDITO: "CREDITS LT PERSONNEL PRETS VEHICULE" },
    { tip_CREDITO: 24, des_TIP_CREDITO: "CREDIT WARRANTAGE" },
    { tip_CREDITO: 25, des_TIP_CREDITO: "CREDIT TONTINE" },
    { tip_CREDITO: 26, des_TIP_CREDITO: "CREDIT MOTEUR HORS BORD" },
    { tip_CREDITO: 27, des_TIP_CREDITO: "CREDIT PROJET VILLAGE DURABLE GUINEE" },
    { tip_CREDITO: 28, des_TIP_CREDITO: "CREDIT AVANCE SALAIRE FONCTIONAIRES VIRES" },
    { tip_CREDITO: 29, des_TIP_CREDITO: "CREDIT PR\xCATS SCOLAIRES" },
    { tip_CREDITO: 30, des_TIP_CREDITO: "CREDIT PRETS EQUIPEMENTS" },
    { tip_CREDITO: 31, des_TIP_CREDITO: "CREDIT PR\xCATS INVESTISSEMENTS FONCTIONNAIRE" },
    { tip_CREDITO: 32, des_TIP_CREDITO: "CREDIT BOEUF PDABAD" },
    { tip_CREDITO: 33, des_TIP_CREDITO: "MICROCREDIT KIOSQUE" },
    { tip_CREDITO: 34, des_TIP_CREDITO: "CREDIT EXPLOITATION AGRICOLE" },
    { tip_CREDITO: 35, des_TIP_CREDITO: "CREDIT INTRANTS ET TRANSFORMATION PRODUITS AGRICOLES" },
    { tip_CREDITO: 36, des_TIP_CREDITO: "CREDIT EQUIPEMENT AGRICOLE" },
    { tip_CREDITO: 37, des_TIP_CREDITO: "CREDIT AGRICOLE PRODUCTION ANANAS" },
    { tip_CREDITO: 38, des_TIP_CREDITO: "CREDIT EXTENSION AGRICOLE" },
    { tip_CREDITO: 39, des_TIP_CREDITO: "CREDIT MOTO BAJAJ" },
    { tip_CREDITO: 40, des_TIP_CREDITO: "CREDIT PERFORM WORLD" },
    { tip_CREDITO: 41, des_TIP_CREDITO: "CREDIT EQUIPEMENT PERFORM WORLD" },
    { tip_CREDITO: 42, des_TIP_CREDITO: "CREDIT PRODUCTION AGRICOLE" },
    { tip_CREDITO: 43, des_TIP_CREDITO: "CREDIT TRANSFORMATION COMMERCIALISATION PRODUITS" },
    { tip_CREDITO: 44, des_TIP_CREDITO: "CREDIT EQUIPEMENT AGRICOLE ET DE TRANSFORMATION PRODUITS" },
    { tip_CREDITO: 45, des_TIP_CREDITO: "PASSEPORT BRIQUETERIE" },
    { tip_CREDITO: 46, des_TIP_CREDITO: "PASSEPORT PDV CIMENT" },
    { tip_CREDITO: 47, des_TIP_CREDITO: "PASSEPORT SALARIE" },
    { tip_CREDITO: 100, des_TIP_CREDITO: "CREDITS REGULARISE OPS" }
  ];
  /**
   * Liste des activités principales
   */
  static ACTIVITES = [
    { code: 101, libelle: "AGRICULTURE ELEVAGE ET PECHE" },
    { code: 102, libelle: "COMMERCE" },
    { code: 103, libelle: "HOTELERIE ET RESTAURATION" },
    { code: 104, libelle: "ARTISANAT" },
    { code: 105, libelle: "SERVICE ET FORMATION" },
    { code: 106, libelle: "TRANSPORT ET AUTRES" },
    { code: 107, libelle: "IMMOBILIER ET LOGEMENT" },
    { code: 108, libelle: "BATIMENTS ET TRAVAUX PUBLICS" },
    { code: 109, libelle: "MINES ET GEOLOGIE" },
    { code: 110, libelle: "FONCTIONNAIRES ET SALARIES" }
    // 199 - A NE PAS UTILISER est exclu
  ];
  /**
   * Liste des sous-activités
   */
  static SOUS_ACTIVITES = [
    // Agriculture, Elevage et Pêche (101)
    { codeActivite: 101, code: 201, libelle: "PRODUCTION VEGETALE" },
    { codeActivite: 101, code: 202, libelle: "PRODUCTION ANIMALE" },
    { codeActivite: 101, code: 203, libelle: "TRANSFORMATION AGRICOLE" },
    { codeActivite: 101, code: 204, libelle: "COMMERCIALISATION AGRICOLE" },
    // Commerce (102)
    { codeActivite: 102, code: 201, libelle: "COMMERCE DE GROS" },
    { codeActivite: 102, code: 202, libelle: "COMMERCE DE D\xC9TAIL" },
    // Hôtellerie et Restauration (103)
    { codeActivite: 103, code: 201, libelle: "HOTEL" },
    { codeActivite: 103, code: 202, libelle: "MOTEL AUBERGE" },
    { codeActivite: 103, code: 203, libelle: "RESTAURANT" },
    { codeActivite: 103, code: 204, libelle: "CAF\xC9TARIAT" },
    // Artisanat (104)
    { codeActivite: 104, code: 201, libelle: "MENUISERIE" },
    { codeActivite: 104, code: 202, libelle: "SOUDURE" },
    { codeActivite: 104, code: 203, libelle: "COIFFURE" },
    { codeActivite: 104, code: 204, libelle: "MECANIQUE" },
    { codeActivite: 104, code: 205, libelle: "MA\xC7ONNERIE" },
    { codeActivite: 104, code: 206, libelle: "CORDONNERIE" },
    // Service et Formation (105)
    { codeActivite: 105, code: 201, libelle: "FORMATION" },
    { codeActivite: 105, code: 202, libelle: "CABINET DE SOINS - CLINIQUE PRIV\xC9" },
    { codeActivite: 105, code: 203, libelle: "CABINET D'EXPERTISE" },
    // Transport et Autres (106)
    { codeActivite: 106, code: 201, libelle: "TRANSPORT DE PERSONNES" },
    { codeActivite: 106, code: 202, libelle: "TRANSPORT DE MARCHANDISES" },
    { codeActivite: 106, code: 203, libelle: "VENTE DE BILLETERIE - TOURISME" },
    // Immobilier et Logement (107)
    { codeActivite: 107, code: 201, libelle: "APPARTEMENT ET MAISON LOCATIVE" },
    // Bâtiments et Travaux Publics (108)
    { codeActivite: 108, code: 201, libelle: "CHANTIERS ETATIQUES" },
    { codeActivite: 108, code: 202, libelle: "CHANTIERS PRIVES" },
    // Mines et Géologie (109)
    { codeActivite: 109, code: 201, libelle: "EXPLOITATION DE CARRI\xC8RE" },
    { codeActivite: 109, code: 202, libelle: "EXPLOITATION D'AUTRES MIN\xC9RAUX" },
    // Fonctionnaires et Salariés (110)
    { codeActivite: 110, code: 201, libelle: "SALARI\xC9 ENTREPRISE PRIV\xC9E" },
    { codeActivite: 110, code: 202, libelle: "SALARI\xC9 ENTREPRISE PUBLIQUE" },
    { codeActivite: 110, code: 203, libelle: "FONCTIONNAIRE D'\xC9TAT" }
  ];
  /**
   * Liste des sous-sous-activités (échantillon - liste complète très longue)
   */
  static SOUS_SOUS_ACTIVITES = [
    // Production Végétale (101-201)
    { codeActivite: 101, codeSousActivite: 201, code: 301, libelle: "AGRUME" },
    { codeActivite: 101, codeSousActivite: 201, code: 302, libelle: "ANACARDE" },
    { codeActivite: 101, codeSousActivite: 201, code: 303, libelle: "ANANAS" },
    { codeActivite: 101, codeSousActivite: 201, code: 304, libelle: "ARACHIDE" },
    { codeActivite: 101, codeSousActivite: 201, code: 305, libelle: "AVOCAT" },
    { codeActivite: 101, codeSousActivite: 201, code: 306, libelle: "BANANE" },
    { codeActivite: 101, codeSousActivite: 201, code: 307, libelle: "CACAO" },
    { codeActivite: 101, codeSousActivite: 201, code: 308, libelle: "CAF\xC9" },
    { codeActivite: 101, codeSousActivite: 201, code: 309, libelle: "C\xC9R\xC9ALE BLE" },
    { codeActivite: 101, codeSousActivite: 201, code: 310, libelle: "C\xC9R\xC9ALE FONIO" },
    { codeActivite: 101, codeSousActivite: 201, code: 311, libelle: "C\xC9R\xC9ALE MA\xCFS" },
    { codeActivite: 101, codeSousActivite: 201, code: 312, libelle: "C\xC9R\xC9ALE MIL" },
    { codeActivite: 101, codeSousActivite: 201, code: 313, libelle: "C\xC9R\xC9ALE RIZ" },
    { codeActivite: 101, codeSousActivite: 201, code: 314, libelle: "C\xC9R\xC9ALE SORGHO" },
    { codeActivite: 101, codeSousActivite: 201, code: 340, libelle: "AUTRES CULTURES" },
    // Production Animale (101-202)
    { codeActivite: 101, codeSousActivite: 202, code: 341, libelle: "APICULTURE PRODUCTION MIEL" },
    { codeActivite: 101, codeSousActivite: 202, code: 342, libelle: "AQUACULTURE" },
    { codeActivite: 101, codeSousActivite: 202, code: 343, libelle: "AVICULTURE" },
    { codeActivite: 101, codeSousActivite: 202, code: 344, libelle: "CHASSE" },
    { codeActivite: 101, codeSousActivite: 202, code: 345, libelle: "\xC9LEVAGE BOVIN" },
    { codeActivite: 101, codeSousActivite: 202, code: 346, libelle: "\xC9LEVAGE CAMELIN" },
    { codeActivite: 101, codeSousActivite: 202, code: 347, libelle: "\xC9LEVAGE CANIN" },
    { codeActivite: 101, codeSousActivite: 202, code: 348, libelle: "\xC9LEVAGE CAPRIN" },
    { codeActivite: 101, codeSousActivite: 202, code: 349, libelle: "\xC9LEVAGE D'AULACODES" },
    { codeActivite: 101, codeSousActivite: 202, code: 350, libelle: "\xC9LEVAGE OVIN" },
    { codeActivite: 101, codeSousActivite: 202, code: 351, libelle: "\xC9LEVAGE PORCIN" },
    { codeActivite: 101, codeSousActivite: 202, code: 352, libelle: "P\xCACHE" },
    { codeActivite: 101, codeSousActivite: 202, code: 353, libelle: "PISCICULTURE" },
    // Commerce de Gros (102-201)
    { codeActivite: 102, codeSousActivite: 201, code: 301, libelle: "COMMERCE G\xC9N\xC9RAL" },
    { codeActivite: 102, codeSousActivite: 201, code: 302, libelle: "FOURNITURES DE BUREAU ET SCOLAIRE" },
    { codeActivite: 102, codeSousActivite: 201, code: 303, libelle: "MAT\xC9RIELS DE CONSTRUCTION" },
    { codeActivite: 102, codeSousActivite: 201, code: 304, libelle: "MAT\xC9RIELS ET MOBILIER DE BUREAU" },
    { codeActivite: 102, codeSousActivite: 201, code: 305, libelle: "PRODUITS ALIMENTAIRES" },
    // Commerce de Détail (102-202)
    { codeActivite: 102, codeSousActivite: 202, code: 301, libelle: "COMMERCE G\xC9N\xC9RAL" },
    { codeActivite: 102, codeSousActivite: 202, code: 302, libelle: "FOURNITURES DE BUREAU ET SCOLAIRE" },
    { codeActivite: 102, codeSousActivite: 202, code: 307, libelle: "PHARMACIE" },
    // Hôtellerie (103)
    { codeActivite: 103, codeSousActivite: 201, code: 301, libelle: "HOTEL" },
    { codeActivite: 103, codeSousActivite: 202, code: 302, libelle: "MOTEL AUBERGE" },
    { codeActivite: 103, codeSousActivite: 203, code: 303, libelle: "RESTAURANT" },
    { codeActivite: 103, codeSousActivite: 204, code: 304, libelle: "CAF\xC9TARIAT" },
    // Salariés (110)
    { codeActivite: 110, codeSousActivite: 201, code: 301, libelle: "BAPTEME" },
    { codeActivite: 110, codeSousActivite: 201, code: 302, libelle: "MARIAGE" },
    { codeActivite: 110, codeSousActivite: 201, code: 303, libelle: "HOSPITALISATION" },
    { codeActivite: 110, codeSousActivite: 201, code: 304, libelle: "SOINS DE SANTE" },
    { codeActivite: 110, codeSousActivite: 201, code: 305, libelle: "DECES" },
    { codeActivite: 110, codeSousActivite: 201, code: 306, libelle: "PELERINAGE" },
    { codeActivite: 110, codeSousActivite: 201, code: 307, libelle: "SACRIFICE" }
    // Note: La liste complète est très longue.
    // Vous pouvez ajouter le reste selon vos besoins
  ];
  /**
   * Obtenir les sous-activités filtrées par code d'activité
   */
  static getSousActivitesByActivite(codeActivite) {
    return this.SOUS_ACTIVITES.filter((sa) => sa.codeActivite === codeActivite);
  }
  /**
   * Obtenir les sous-sous-activités filtrées
   */
  static getSousSousActivites(codeActivite, codeSousActivite) {
    return this.SOUS_SOUS_ACTIVITES.filter((ssa) => ssa.codeActivite === codeActivite && ssa.codeSousActivite === codeSousActivite);
  }
  /**
   * Obtenir une activité par son code
   */
  static getActiviteByCode(code) {
    return this.ACTIVITES.find((a) => a.code === code);
  }
  /**
   * Obtenir une sous-activité par ses codes
   */
  static getSousActiviteByCode(codeActivite, code) {
    return this.SOUS_ACTIVITES.find((sa) => sa.codeActivite === codeActivite && sa.code === code);
  }
  /**
   * Obtenir un type de crédit par son ID
   */
  static getTypeCreditById(tipCredito) {
    return this.TYPES_CREDIT.find((tc) => tc.tip_CREDITO === tipCredito);
  }
};

// src/app/pages/auth/credit/demande-ind/demande-ind.component.ts
var _c0 = () => [];
var _c1 = () => ({ "width": "350px", "max-width": "100%" });
var _c2 = () => ({ width: "500px" });
var _c3 = () => ({ width: "50px", height: "50px" });
var _forTrack0 = ($index, $item) => $item.value;
function DemandeIndComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "p-progressSpinner");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275styleMap(\u0275\u0275pureFunction0(2, _c3));
  }
}
function DemandeIndComponent_Case_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " DEMANDE DE CREDIT POUR PME/PMI ");
  }
}
function DemandeIndComponent_Case_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " DEMANDE DE CREDIT POUR PROFESSIONNELS ");
  }
}
function DemandeIndComponent_Case_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " DEMANDE DE CREDIT POUR PARTICULIERS ");
  }
}
function DemandeIndComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td", 91);
    \u0275\u0275text(2, "Nom de l'entreprise *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 29)(4, "input", 92);
    \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Conditional_51_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formData.nomPersonneMorale, $event) || (ctx_r3.formData.nomPersonneMorale = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "td", 91);
    \u0275\u0275text(6, "Sigle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 29)(8, "input", 93);
    \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Conditional_51_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formData.sigle, $event) || (ctx_r3.formData.sigle = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formData.nomPersonneMorale);
    \u0275\u0275property("disabled", ctx_r3.state().submitting);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formData.sigle);
    \u0275\u0275property("disabled", ctx_r3.state().submitting);
  }
}
function DemandeIndComponent_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 94);
    \u0275\u0275text(1, "Dirigeant (titre)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "input", 95);
    \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Conditional_56_Template_input_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formData.titreDirecteur, $event) || (ctx_r3.formData.titreDirecteur = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formData.titreDirecteur);
    \u0275\u0275property("disabled", ctx_r3.state().submitting);
  }
}
function DemandeIndComponent_For_247_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 69)(1, "p-radioButton", 96);
    \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_For_247_Template_p_radioButton_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.formData.statutCredit, $event) || (ctx_r3.formData.statutCredit = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "label", 97);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r7 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.formData.statutCredit);
    \u0275\u0275property("value", option_r7.value)("inputId", option_r7.value)("disabled", ctx_r3.state().submitting);
    \u0275\u0275advance();
    \u0275\u0275property("for", option_r7.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r7.label);
  }
}
function DemandeIndComponent_For_276_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 7);
    \u0275\u0275text(1, " Garantie financi\xE8re ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("rowspan", ctx_r3.getGarantiesByType("Garantie Financiere").length);
  }
}
function DemandeIndComponent_For_276_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275template(1, DemandeIndComponent_For_276_Conditional_1_Template, 2, 1, "td", 7);
    \u0275\u0275elementStart(2, "td");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 98);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 98);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 99)(11, "button", 100);
    \u0275\u0275listener("click", function DemandeIndComponent_For_276_Template_button_click_11_listener() {
      const garantie_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.deleteGarantieByRef(garantie_r9));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const garantie_r9 = ctx.$implicit;
    const \u0275$index_515_r10 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(\u0275$index_515_r10 === 0 ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r9.descriptionGarantie);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(6, 5, garantie_r9.valeurGarantie, "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 8, garantie_r9.valeurEmprunte, "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r3.state().submitting);
  }
}
function DemandeIndComponent_ForEmpty_277_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 7);
    \u0275\u0275text(2, "Garantie financi\xE8re");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 101);
    \u0275\u0275text(4, "-");
    \u0275\u0275elementEnd()();
  }
}
function DemandeIndComponent_For_279_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 7);
    \u0275\u0275text(1, " Garantie mat\xE9rielle ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("rowspan", ctx_r3.getGarantiesByType("Garantie Materielle").length);
  }
}
function DemandeIndComponent_For_279_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275template(1, DemandeIndComponent_For_279_Conditional_1_Template, 2, 1, "td", 7);
    \u0275\u0275elementStart(2, "td");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 98);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 98);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 99)(11, "button", 100);
    \u0275\u0275listener("click", function DemandeIndComponent_For_279_Template_button_click_11_listener() {
      const garantie_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.deleteGarantieByRef(garantie_r12));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const garantie_r12 = ctx.$implicit;
    const \u0275$index_546_r13 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(\u0275$index_546_r13 === 0 ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r12.descriptionGarantie);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(6, 5, garantie_r12.valeurGarantie, "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 8, garantie_r12.valeurEmprunte, "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r3.state().submitting);
  }
}
function DemandeIndComponent_ForEmpty_280_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 7);
    \u0275\u0275text(2, "Garantie mat\xE9rielle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 101);
    \u0275\u0275text(4, "-");
    \u0275\u0275elementEnd()();
  }
}
function DemandeIndComponent_For_282_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 7);
    \u0275\u0275text(1, " Autres garantie ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("rowspan", ctx_r3.getGarantiesByType("Caution Solidaire", "Autre Garantie").length);
  }
}
function DemandeIndComponent_For_282_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275template(1, DemandeIndComponent_For_282_Conditional_1_Template, 2, 1, "td", 7);
    \u0275\u0275elementStart(2, "td");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "td", 98);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 98);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 99)(11, "button", 100);
    \u0275\u0275listener("click", function DemandeIndComponent_For_282_Template_button_click_11_listener() {
      const garantie_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.deleteGarantieByRef(garantie_r15));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const garantie_r15 = ctx.$implicit;
    const \u0275$index_577_r16 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(\u0275$index_577_r16 === 0 ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(garantie_r15.descriptionGarantie);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(6, 5, garantie_r15.valeurGarantie, "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 8, garantie_r15.valeurEmprunte, "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r3.state().submitting);
  }
}
function DemandeIndComponent_ForEmpty_283_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 7);
    \u0275\u0275text(2, "Autres garantie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 101);
    \u0275\u0275text(4, "-");
    \u0275\u0275elementEnd()();
  }
}
function DemandeIndComponent_ng_template_322_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 102);
    \u0275\u0275listener("click", function DemandeIndComponent_ng_template_322_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.cancelGarantie());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "button", 103);
    \u0275\u0275listener("click", function DemandeIndComponent_ng_template_322_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.saveGarantie());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r3.state().currentGarantie.typeGarantie || !ctx_r3.state().currentGarantie.descriptionGarantie || ctx_r3.state().currentGarantie.valeurGarantie <= 0);
  }
}
var DemandeIndComponent = class _DemandeIndComponent {
  // Propriétés existantes
  today = /* @__PURE__ */ new Date();
  currentUser = null;
  selectedAgence = null;
  // Propriétés pour les activités
  typesCredit = CreditActiviteData.TYPES_CREDIT;
  activites = CreditActiviteData.ACTIVITES;
  sousActivites = [];
  sousSousActivites = [];
  // Sélections actuelles pour les dropdowns en cascade
  selectedActivite = null;
  selectedSousActivite = null;
  selectedSousSousActivite = null;
  selectedTypeCredit = null;
  // FormData initialisé avec les valeurs par défaut
  formData = {
    // Informations de base
    nom: "",
    prenom: "",
    sernom: "",
    telephone: "",
    numeroMembre: "",
    // Localisation administrative - OBJETS pour les dropdowns
    delegation: void 0,
    agence: void 0,
    pos: void 0,
    prefecture: "",
    sousPrefecture: "",
    // Nature client
    natureClient: "Demande credit Pour Particulier",
    nomPersonneMorale: "",
    sigle: "",
    titreDirecteur: "",
    // Informations personnelles
    typePiece: "Carte nationale d'identite",
    numId: "",
    dateNaissance: void 0,
    lieuxNaissance: "",
    genre: "Masculin",
    situationMatrimoniale: "Celebataire",
    nombrePersonneEnCharge: 0,
    nombrePersonneScolarise: 0,
    nomPere: "",
    nomMere: "",
    nomConjoint: "",
    addresseDomicileContact: "",
    typePropriete: "",
    nombreAnneeHabitation: 0,
    // Activité - codes numériques pour les dropdowns
    categorie: "",
    typeActivite: "",
    sousActivite: "",
    sousSousActivite: "",
    selectedTypeActivite: void 0,
    selectedSousActivite: void 0,
    selectedSousSousActivite: void 0,
    descriptionActivite: "",
    nombreAnneeActivite: 0,
    adresseLieuActivite: "",
    autreActivite: "",
    lieuActivite: "",
    natureActivite: "",
    currentActivite: "",
    prefectureActivite: "",
    sousPrefectureActivite: "",
    // Modalités de crédit
    montantDemande: 0,
    dureeDemande: 12,
    periodiciteRemboursement: "Mensuelle",
    tauxInteret: 3,
    periodeDiffere: 0,
    nombreEcheance: 12,
    echeance: 0,
    objectCredit: "Fond de roulement",
    detailObjectCredit: "",
    statutCredit: "Nouveau",
    rangCredit: 1,
    tipCredito: void 0,
    // Système
    statutDemande: "EN_ATTENTE",
    validationState: "SELECTION",
    // Champs supplémentaires
    email: "",
    dateAdhesion: null,
    numeroDemande: "",
    numeroCredit: ""
  };
  // État du composant
  state = signal({
    loading: false,
    submitting: false,
    message: void 0,
    error: void 0,
    allDelegations: [],
    allAgences: [],
    allPointsVente: [],
    filteredAgences: [],
    filteredPointsVente: [],
    garanties: [],
    showGarantieDialog: false,
    currentGarantie: this.createEmptyGarantie(),
    editingGarantieIndex: void 0
  });
  // Options pour nature client
  natureClientOptions = [
    { label: "Demande cr\xE9dit Pour Particulier", value: "Demande credit Pour Particulier" },
    { label: "Demande de Cr\xE9dit Pour PME/PMI", value: "Demande de Credit Pour PME/PMI" },
    { label: "Demande de cr\xE9dit Pour Professionnels", value: "Demande de credit Pour Professionnels" }
  ];
  // Options pour les dropdowns d'activités - value doit être number
  activiteOptions = [];
  sousActiviteOptions = [];
  sousSousActiviteOptions = [];
  typeCreditOptions = [];
  typePieceOptions = [
    { label: "Carte nationale d'identit\xE9", value: "Carte nationale d'identite" },
    { label: "Carte d'identit\xE9 Biom\xE9trique", value: "Carte d'identite Biometrique" },
    { label: "Possession d'\xE9tat", value: "Possession d'\xE9tat" },
    { label: "Carte d'identit\xE9 personnelle", value: "Carte d'identite personnelle" },
    { label: "Passeport", value: "Passeport" }
  ];
  genreOptions = [
    { label: "Masculin", value: "Masculin" },
    { label: "F\xE9minin", value: "Feminin" }
  ];
  situationMatrimonialeOptions = [
    { label: "C\xE9libataire", value: "Celebataire" },
    { label: "Mari\xE9(e)", value: "Marie" },
    { label: "Fianc\xE9(e)", value: "Fiance" },
    { label: "Divorc\xE9(e)", value: "Divorce" },
    { label: "Veuf(ve)", value: "Veuf" }
  ];
  typeProprieteOptions = [
    { label: "Propri\xE9taire", value: "Proprietaire" },
    { label: "Locataire", value: "Locataire" },
    { label: "H\xE9berg\xE9", value: "Heberge" }
  ];
  periodiciteOptions = [
    { label: "Mensuelle", value: "Mensuelle" },
    { label: "Bimestrielle", value: "Bimestrielle" },
    { label: "Trimestrielle", value: "Trimestrielle" },
    { label: "Quatrimestrielle", value: "Quatrimestrielle" },
    { label: "Semestrielle", value: "Semestrielle" },
    { label: "Annuelle", value: "Annuelle" }
  ];
  objectCreditOptions = [
    { label: "Fond de roulement", value: "Fond de roulement" },
    { label: "Investissement", value: "Investissement" },
    { label: "Invest+Fond de Roulement", value: "Invest+Fond de Roulement" },
    { label: "Bon de Commande", value: "Bon de Commande" }
  ];
  statutCreditOptions = [
    { label: "Nouveau", value: "Nouveau" },
    { label: "Renouvellement", value: "Renouvellement" }
  ];
  typeGarantieOptions = [
    { label: "Caution Solidaire", value: "Caution Solidaire" },
    { label: "Garantie Financi\xE8re", value: "Garantie Financiere" },
    { label: "Garantie Mat\xE9rielle", value: "Garantie Materielle" },
    { label: "Autre Garantie", value: "Autre Garantie" }
  ];
  // Services injectés
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  creditService = inject(UserService);
  messageService = inject(MessageService);
  ngOnInit() {
    this.loadInitialData();
    this.initializeOptions();
  }
  // ======================== GESTION NATURE CLIENT ========================
  onNatureClientChange(event) {
    const natureClient = event.value;
    if (natureClient !== "Demande de Credit Pour PME/PMI") {
      this.formData.nomPersonneMorale = "";
      this.formData.sigle = "";
      this.formData.titreDirecteur = "";
    }
    this.formData.natureClient = natureClient;
  }
  isPME() {
    return this.formData.natureClient === "Demande de Credit Pour PME/PMI";
  }
  // ======================== INITIALISATION ========================
  initializeOptions() {
    this.typeCreditOptions = this.typesCredit.map((tc) => ({
      label: tc.des_TIP_CREDITO,
      value: tc.tip_CREDITO,
      data: tc
    }));
    this.activiteOptions = this.activites.map((a) => ({
      label: a.libelle,
      value: a.code,
      data: a
    }));
    console.log("Options initialis\xE9es:", {
      activites: this.activiteOptions,
      typesCredit: this.typeCreditOptions.length
    });
  }
  loadInitialData() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: true }));
    this.creditService.startNewDemandeInd$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.data) {
          const delegations = response.data.delegations || [];
          const agences = response.data.agences || [];
          const pointVentes = response.data.pointVentes || [];
          console.log("Donn\xE9es charg\xE9es:", { delegations: delegations.length, agences: agences.length, pointVentes: pointVentes.length });
          this.state.update((state) => __spreadProps(__spreadValues({}, state), {
            loading: false,
            allDelegations: delegations,
            allAgences: agences,
            allPointsVente: pointVentes,
            typeCreditos: response.data.typeCreditos || []
          }));
        }
      },
      error: (error) => {
        console.error("Error loading initial data:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les donn\xE9es initiales",
          life: 3e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { loading: false }));
      }
    });
  }
  // ======================== CASCADE: DÉLÉGATION → AGENCE → POINT DE SERVICE ========================
  onDelegationChange(event) {
    const delegation = event.value;
    console.log("=== D\xE9l\xE9gation s\xE9lectionn\xE9e ===", delegation);
    this.formData.agence = void 0;
    this.formData.pos = void 0;
    this.selectedAgence = null;
    if (!delegation || !delegation.id) {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), { filteredAgences: [], filteredPointsVente: [] }));
      return;
    }
    const allAgences = this.state().allAgences || [];
    const filteredAgences = allAgences.filter((agence) => {
      const agenceDelegationId = agence.delegation_id || agence.delegationId || agence.delegation?.id || agence.idDelegation;
      return agenceDelegationId === delegation.id;
    });
    console.log("Agences filtr\xE9es:", filteredAgences.length);
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { filteredAgences, filteredPointsVente: [] }));
  }
  onAgenceChange(event) {
    const agence = event.value;
    console.log("=== Agence s\xE9lectionn\xE9e ===", agence);
    this.formData.pos = void 0;
    if (!agence || !agence.id) {
      this.selectedAgence = null;
      this.state.update((state) => __spreadProps(__spreadValues({}, state), { filteredPointsVente: [] }));
      return;
    }
    this.selectedAgence = agence;
    const allPointsVente = this.state().allPointsVente || [];
    const filteredPointsVente = allPointsVente.filter((pv) => {
      const pvAgenceId = pv.agence_id || pv.agenceId || pv.agence?.id || pv.idAgence;
      return pvAgenceId === agence.id;
    });
    console.log("Points de vente filtr\xE9s:", filteredPointsVente.length);
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { filteredPointsVente }));
  }
  // ======================== CASCADE: ACTIVITÉ → SOUS-ACTIVITÉ → FILIÈRE ========================
  /**
   * Gère le changement d'activité - charge les sous-activités correspondantes
   */
  onActiviteChange(event) {
    const codeActivite = event.value;
    console.log("=== Activit\xE9 s\xE9lectionn\xE9e ===", "code:", codeActivite, "type:", typeof codeActivite);
    this.formData.selectedSousActivite = void 0;
    this.formData.selectedSousSousActivite = void 0;
    this.formData.sousActivite = "";
    this.formData.sousSousActivite = "";
    this.selectedSousActivite = null;
    this.selectedSousSousActivite = null;
    this.sousActiviteOptions = [];
    this.sousSousActiviteOptions = [];
    this.sousActivites = [];
    this.sousSousActivites = [];
    if (!codeActivite) {
      this.selectedActivite = null;
      this.formData.selectedTypeActivite = void 0;
      this.formData.typeActivite = "";
      return;
    }
    this.formData.selectedTypeActivite = codeActivite;
    this.formData.typeActivite = codeActivite.toString();
    this.selectedActivite = CreditActiviteData.getActiviteByCode(codeActivite) || null;
    console.log("Activit\xE9 trouv\xE9e:", this.selectedActivite);
    if (this.selectedActivite) {
      this.sousActivites = CreditActiviteData.getSousActivitesByActivite(codeActivite);
      console.log("Sous-activit\xE9s trouv\xE9es:", this.sousActivites);
      this.sousActiviteOptions = this.sousActivites.map((sa) => ({
        label: sa.libelle,
        value: sa.code,
        data: sa
      }));
      console.log("Options sous-activit\xE9s:", this.sousActiviteOptions);
    }
  }
  /**
   * Gère le changement de sous-activité - charge les filières
   */
  onSousActiviteChange(event) {
    const codeSousActivite = event.value;
    console.log("=== Sous-activit\xE9 s\xE9lectionn\xE9e ===", "code:", codeSousActivite);
    this.formData.selectedSousSousActivite = void 0;
    this.formData.sousSousActivite = "";
    this.selectedSousSousActivite = null;
    this.sousSousActiviteOptions = [];
    this.sousSousActivites = [];
    if (!codeSousActivite || !this.selectedActivite) {
      this.selectedSousActivite = null;
      this.formData.selectedSousActivite = void 0;
      this.formData.sousActivite = "";
      return;
    }
    this.formData.selectedSousActivite = codeSousActivite;
    this.formData.sousActivite = codeSousActivite.toString();
    this.selectedSousActivite = this.sousActivites.find((sa) => sa.code === codeSousActivite) || null;
    console.log("Sous-activit\xE9 trouv\xE9e:", this.selectedSousActivite);
    if (this.selectedSousActivite && this.selectedActivite) {
      this.sousSousActivites = CreditActiviteData.getSousSousActivites(this.selectedActivite.code, codeSousActivite);
      console.log("Fili\xE8res trouv\xE9es:", this.sousSousActivites);
      this.sousSousActiviteOptions = this.sousSousActivites.map((ssa) => ({
        label: ssa.libelle,
        value: ssa.code,
        data: ssa
      }));
      console.log("Options fili\xE8res:", this.sousSousActiviteOptions);
    }
  }
  /**
   * Gère le changement de filière
   */
  onSousSousActiviteChange(event) {
    const codeSousSousActivite = event.value;
    console.log("=== Fili\xE8re s\xE9lectionn\xE9e ===", "code:", codeSousSousActivite);
    if (!codeSousSousActivite) {
      this.selectedSousSousActivite = null;
      this.formData.selectedSousSousActivite = void 0;
      this.formData.sousSousActivite = "";
      return;
    }
    this.formData.selectedSousSousActivite = codeSousSousActivite;
    this.formData.sousSousActivite = codeSousSousActivite.toString();
    this.selectedSousSousActivite = this.sousSousActivites.find((ssa) => ssa.code === codeSousSousActivite) || null;
  }
  // ======================== TYPE DE CRÉDIT ========================
  onTypeCreditChange(event) {
    const tipCredito = event.value;
    if (!tipCredito) {
      this.selectedTypeCredit = null;
      this.formData.tipCredito = void 0;
      return;
    }
    this.selectedTypeCredit = this.typesCredit.find((tc) => tc.tip_CREDITO === tipCredito) || null;
    this.formData.tipCredito = tipCredito;
  }
  // ======================== GESTION DES GARANTIES ========================
  createEmptyGarantie() {
    return {
      typeGarantie: "Caution Solidaire",
      descriptionGarantie: "",
      valeurGarantie: 0
    };
  }
  showAddGarantieDialog() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      showGarantieDialog: true,
      currentGarantie: this.createEmptyGarantie(),
      editingGarantieIndex: void 0
    }));
  }
  editGarantie(garantie, index) {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      showGarantieDialog: true,
      currentGarantie: __spreadValues({}, garantie),
      editingGarantieIndex: index
    }));
  }
  saveGarantie() {
    const currentState = this.state();
    const garantie = currentState.currentGarantie;
    if (!garantie.typeGarantie || !garantie.descriptionGarantie || garantie.valeurGarantie <= 0) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez remplir tous les champs de la garantie",
        life: 3e3
      });
      return;
    }
    garantie.valeurEmprunte = garantie.valeurGarantie * 0.75;
    const garanties = [...currentState.garanties];
    if (currentState.editingGarantieIndex !== void 0) {
      garanties[currentState.editingGarantieIndex] = garantie;
    } else {
      garanties.push(garantie);
    }
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      garanties,
      showGarantieDialog: false,
      currentGarantie: this.createEmptyGarantie(),
      editingGarantieIndex: void 0
    }));
  }
  deleteGarantie(index) {
    const garanties = this.state().garanties.filter((_, i) => i !== index);
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { garanties }));
  }
  cancelGarantie() {
    this.state.update((state) => __spreadProps(__spreadValues({}, state), {
      showGarantieDialog: false,
      currentGarantie: this.createEmptyGarantie(),
      editingGarantieIndex: void 0
    }));
  }
  calculateTotalGaranties() {
    return this.state().garanties.reduce((sum, g) => sum + (g.valeurGarantie || 0), 0);
  }
  calculateTotalEmpruntable() {
    return this.state().garanties.reduce((sum, g) => sum + (g.valeurEmprunte || 0), 0);
  }
  getGarantiesByType(...types) {
    return this.state().garanties.filter((g) => types.includes(g.typeGarantie));
  }
  deleteGarantieByRef(garantie) {
    const index = this.state().garanties.indexOf(garantie);
    if (index > -1) {
      this.state.update((state) => __spreadProps(__spreadValues({}, state), {
        garanties: state.garanties.filter((_, i) => i !== index)
      }));
      this.messageService.add({ severity: "success", summary: "Succ\xE8s", detail: "Garantie supprim\xE9e", life: 2e3 });
    }
  }
  // ======================== SOUMISSION DU FORMULAIRE ========================
  createDemande(form) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((key) => form.controls[key].markAsTouched());
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez remplir correctement tous les champs obligatoires",
        life: 5e3
      });
      return;
    }
    if (this.isPME() && (!this.formData.nomPersonneMorale || this.formData.nomPersonneMorale.trim() === "")) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Le nom de l'entreprise est obligatoire pour une demande PME/PMI",
        life: 5e3
      });
      return;
    }
    if (this.state().garanties.length === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez ajouter au moins une garantie",
        life: 5e3
      });
      return;
    }
    this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: true }));
    const delegationValue = this.formData.delegation;
    const agenceValue = this.formData.agence;
    const posValue = this.formData.pos;
    const demandeData = __spreadProps(__spreadValues(__spreadValues({}, this.formData), form.value), {
      delegation: delegationValue?.id || delegationValue,
      agence: agenceValue?.id || agenceValue,
      pos: posValue?.id || posValue,
      natureClient: this.formData.natureClient || "Demande credit Pour Particulier",
      nomPersonneMorale: this.isPME() ? this.formData.nomPersonneMorale : "",
      sigle: this.isPME() ? this.formData.sigle : "",
      sernom: this.formData.sernom || "",
      categorie: this.formData.categorie || "",
      nomPere: this.formData.nomPere || "",
      nomMere: this.formData.nomMere || "",
      nomConjoint: this.formData.nomConjoint || "",
      natureActivite: this.formData.natureActivite || "",
      prefecture: this.formData.prefecture || "",
      sousPrefecture: this.formData.sousPrefecture || "",
      email: this.formData.email || "",
      typeActivite: this.formData.typeActivite || "",
      sousActivite: this.formData.sousActivite || "",
      sousSousActivite: this.formData.sousSousActivite || "",
      tipCredito: this.formData.tipCredito,
      descriptionActivite: this.getDescriptionActiviteComplete() || form.value.descriptionActivite,
      garanties: this.state().garanties.map((g) => __spreadProps(__spreadValues({}, g), {
        typeGarantie: this.convertTypeGarantie(g.typeGarantie)
      })),
      statutDemande: "EN_ATTENTE",
      validationState: "SELECTION",
      currentActivite: this.getActiviteLibelle(),
      codUsuarios: ""
    });
    console.log("Donn\xE9es de la demande:", demandeData);
    this.creditService.addDemandeIndWithGaranties$(demandeData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log("R\xE9ponse:", response);
        this.messageService.add({
          severity: "success",
          summary: "Succ\xE8s",
          detail: `Demande cr\xE9\xE9e avec succ\xE8s. ID: ${response.data?.demandeId || "N/A"}`,
          life: 5e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false, garanties: [], filteredAgences: [], filteredPointsVente: [] }));
        form.resetForm();
        this.resetForm();
        setTimeout(() => this.router.navigate(["/"]), 2e3);
      },
      error: (error) => {
        console.error("Erreur:", error);
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: error.message || error || "\xC9chec de la soumission",
          life: 7e3
        });
        this.state.update((state) => __spreadProps(__spreadValues({}, state), { submitting: false }));
      }
    });
  }
  // ======================== MÉTHODES UTILITAIRES ========================
  convertTypeGarantie(type) {
    const conversions = {
      "D\xE9p\xF4t \xE0 terme": "Garantie Financiere",
      "Depot a terme": "Garantie Financiere",
      "S\xFBret\xE9s R\xE9elles": "Garantie Materielle",
      "Surete Reelles": "Garantie Materielle"
    };
    return conversions[type] || type;
  }
  getDescriptionActiviteComplete() {
    let description = "";
    if (this.selectedActivite)
      description = this.selectedActivite.libelle;
    if (this.selectedSousActivite)
      description += " - " + this.selectedSousActivite.libelle;
    if (this.selectedSousSousActivite)
      description += " - " + this.selectedSousSousActivite.libelle;
    return description;
  }
  getActiviteLibelle() {
    return this.selectedActivite ? this.selectedActivite.libelle : "";
  }
  resetActiviteSelections() {
    this.selectedActivite = null;
    this.selectedSousActivite = null;
    this.selectedSousSousActivite = null;
    this.sousActivites = [];
    this.sousSousActivites = [];
    this.sousActiviteOptions = [];
    this.sousSousActiviteOptions = [];
    this.formData.typeActivite = "";
    this.formData.sousActivite = "";
    this.formData.sousSousActivite = "";
    this.formData.selectedTypeActivite = void 0;
    this.formData.selectedSousActivite = void 0;
    this.formData.selectedSousSousActivite = void 0;
  }
  resetForm() {
    this.formData = this.getInitialFormData();
    this.resetActiviteSelections();
    this.selectedAgence = null;
  }
  getInitialFormData() {
    return {
      nom: "",
      prenom: "",
      sernom: "",
      telephone: "",
      numeroMembre: "",
      typePiece: "Carte nationale d'identite",
      numId: "",
      dateNaissance: void 0,
      lieuxNaissance: "",
      genre: "Masculin",
      situationMatrimoniale: "Celebataire",
      nombrePersonneEnCharge: 0,
      nombrePersonneScolarise: 0,
      nomPere: "",
      nomMere: "",
      nomConjoint: "",
      addresseDomicileContact: "",
      typePropriete: "",
      nombreAnneeHabitation: 0,
      natureClient: "Demande credit Pour Particulier",
      nomPersonneMorale: "",
      sigle: "",
      titreDirecteur: "",
      categorie: "",
      delegation: void 0,
      agence: void 0,
      pos: void 0,
      prefecture: "",
      sousPrefecture: "",
      typeActivite: "",
      sousActivite: "",
      sousSousActivite: "",
      selectedTypeActivite: void 0,
      selectedSousActivite: void 0,
      selectedSousSousActivite: void 0,
      descriptionActivite: "",
      nombreAnneeActivite: 0,
      adresseLieuActivite: "",
      autreActivite: "",
      lieuActivite: "",
      natureActivite: "",
      currentActivite: "",
      montantDemande: 0,
      dureeDemande: 12,
      periodiciteRemboursement: "Mensuelle",
      tauxInteret: 3,
      periodeDiffere: 0,
      nombreEcheance: 12,
      echeance: 0,
      objectCredit: "Fond de roulement",
      detailObjectCredit: "",
      statutCredit: "Nouveau",
      rangCredit: 1,
      tipCredito: void 0,
      statutDemande: "EN_ATTENTE",
      validationState: "SELECTION",
      email: "",
      dateAdhesion: null
    };
  }
  static \u0275fac = function DemandeIndComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DemandeIndComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DemandeIndComponent, selectors: [["app-demande-ind"]], features: [\u0275\u0275ProvidersFeature([MessageService])], decls: 323, vars: 176, consts: [["demandeForm", "ngForm"], [1, "form-container"], [1, "loading-overlay"], [3, "ngSubmit"], [1, "form-header"], [1, "header-title"], [1, "form-table", "header-table"], [1, "label-cell"], [2, "width", "180px"], ["name", "delegation", "optionLabel", "libele", "dataKey", "id", "styleClass", "w-full", "required", "", "placeholder", "S\xE9lectionner", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "disabled"], ["name", "agence", "optionLabel", "libele", "dataKey", "id", "styleClass", "w-full", "required", "", "placeholder", "S\xE9lectionner", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "disabled"], ["name", "pos", "optionLabel", "libele", "dataKey", "id", "styleClass", "w-full", "required", "", "placeholder", "S\xE9lectionner", 3, "ngModelChange", "ngModel", "options", "filter", "disabled"], [1, "date-display"], ["pInputText", "", "name", "numeroMembreHeader", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "numeroDemande", "placeholder", "Auto-g\xE9n\xE9r\xE9", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], [1, "form-section"], [1, "section-header"], [1, "form-table"], [1, "label-cell", 2, "width", "180px"], ["colspan", "5"], ["name", "natureClient", "optionLabel", "label", "optionValue", "value", "required", "", "placeholder", "S\xE9lectionner la nature", 3, "ngModelChange", "onChange", "ngModel", "options", "disabled", "appendTo"], [1, "label-cell", 2, "width", "200px"], [1, "flex", "gap-2"], ["pInputText", "", "name", "prenom", "placeholder", "Pr\xE9nom(s)", "required", "", 1, "flex-1", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "nom", "placeholder", "Nom", "required", "", 1, "flex-1", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "sernom", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["name", "dateAdhesion", "dateFormat", "dd/mm/yy", "styleClass", "w-full", 3, "ngModelChange", "ngModel", "showIcon", "disabled"], ["name", "genre", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "options", "disabled"], ["pInputText", "", "name", "categorie", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["colspan", "2"], ["name", "typePiece", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "options", "disabled", "appendTo"], ["pInputText", "", "name", "numId", "placeholder", "Num\xE9ro de la pi\xE8ce", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["name", "dateNaissance", "dateFormat", "dd/mm/yy", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "showIcon", "disabled"], ["colspan", "2", 1, "label-cell"], ["pInputText", "", "name", "lieuxNaissance", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "addresseDomicileContact", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["name", "nombreAnneeHabitation", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "min", "disabled"], ["pInputText", "", "name", "typePropriete", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "telephone", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "email", "type", "email", "placeholder", "exemple@email.com", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["name", "situationMatrimoniale", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "options", "disabled"], ["name", "nombrePersonneScolarise", "styleClass", "w-full", 3, "ngModelChange", "ngModel", "min", "disabled"], ["name", "nombrePersonneEnCharge", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "min", "disabled"], ["pInputText", "", "name", "nomPere", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "nomMere", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "nomConjoint", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], [1, "label-cell", "highlight-yellow"], ["pInputText", "", "name", "natureActivite", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["name", "typeActivite", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "required", "", "placeholder", "S\xE9lectionner une activit\xE9", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "disabled"], ["name", "sousActivite", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "required", "", "placeholder", "S\xE9lectionner", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "disabled"], ["name", "sousSousActivite", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "placeholder", "S\xE9lectionner", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "disabled"], ["name", "nombreAnneeActivite", "styleClass", "w-15rem", "suffix", " an(s)", "required", "", 3, "ngModelChange", "ngModel", "min", "disabled"], ["pInputText", "", "name", "autreActivite", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "adresseLieuActivite", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "prefectureActivite", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "sousPrefectureActivite", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "lieuActivite", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], [2, "width", "200px"], ["name", "objectCredit", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "options", "disabled"], ["name", "montantDemande", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "min", "disabled"], [1, "label-cell", 2, "width", "60px"], ["name", "dureeDemande", "suffix", " mois", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "min", "disabled"], ["name", "nombreEcheance", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "min", "disabled"], ["name", "tauxInteret", "suffix", " %", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "min", "max", "minFractionDigits", "disabled"], ["name", "periodiciteRemboursement", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "required", "", 3, "ngModelChange", "ngModel", "options", "disabled"], ["name", "echeance", "mode", "currency", "currency", "GNF", "locale", "fr-FR", "styleClass", "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["colspan", "3", 1, "label-cell"], ["pInputText", "", "name", "detailObjectCredit", "required", "", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], [1, "flex", "gap-3"], [1, "field-radiobutton"], ["name", "rangCredit", "styleClass", "w-full", 3, "ngModelChange", "ngModel", "min", "disabled"], ["name", "tipCredito", "optionLabel", "label", "optionValue", "value", "styleClass", "w-full", "required", "", 3, "ngModelChange", "onChange", "ngModel", "options", "filter", "disabled"], ["type", "button", "pButton", "", "icon", "pi pi-plus", "label", "Ajouter", 1, "p-button-sm", "p-button-success", "ml-3", 3, "click", "disabled"], [1, "form-table", "garantie-table"], [2, "width", "80px"], [1, "total-row"], [1, "text-center", "font-bold"], [1, "text-right", "font-bold"], [1, "action-buttons"], ["type", "button", "pButton", "", "icon", "pi pi-arrow-left", "label", "Retour", 1, "p-button-secondary", 3, "click", "disabled"], ["type", "button", "pButton", "", "icon", "pi pi-times", "label", "Annuler", 1, "p-button-danger", 3, "click", "disabled"], ["type", "submit", "pButton", "", "icon", "pi pi-save", "label", "Soumettre la demande", 3, "loading", "disabled"], [3, "visibleChange", "visible", "header", "modal", "draggable", "resizable"], [1, "grid"], [1, "col-12"], [1, "block", "mb-2"], ["optionLabel", "label", "optionValue", "value", "placeholder", "S\xE9lectionner", "styleClass", "w-full", "appendTo", "body", 3, "ngModelChange", "ngModel", "options"], ["pTextarea", "", "rows", "3", "placeholder", "D\xE9crivez pr\xE9cis\xE9ment la garantie", 1, "w-full", 3, "ngModelChange", "ngModel"], ["mode", "currency", "currency", "GNF", "locale", "fr-FR", "styleClass", "w-full", 3, "ngModelChange", "ngModel", "min"], [1, "valeur-retenue"], ["pTemplate", "footer"], [1, "label-cell", "highlight-blue"], ["pInputText", "", "name", "nomPersonneMorale", "required", "", "placeholder", "Raison sociale", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], ["pInputText", "", "name", "sigle", "placeholder", "Ex: SARL, SA, PME...", 1, "w-full", 3, "ngModelChange", "ngModel", "disabled"], [1, "header-note"], ["pInputText", "", "name", "titreDirecteur", "placeholder", "PDG, DG, G\xE9rant...", 1, "header-input", 3, "ngModelChange", "ngModel", "disabled"], ["name", "statutCredit", 3, "ngModelChange", "ngModel", "value", "inputId", "disabled"], [1, "ml-1", 3, "for"], [1, "text-right"], [1, "text-center"], ["type", "button", "pButton", "", "icon", "pi pi-trash", 1, "p-button-text", "p-button-danger", "p-button-sm", 3, "click", "disabled"], ["colspan", "4", 1, "text-center", "text-muted"], ["type", "button", "pButton", "", "icon", "pi pi-times", "label", "Annuler", 1, "p-button-text", 3, "click"], ["type", "button", "pButton", "", "icon", "pi pi-check", "label", "Valider", 3, "click", "disabled"]], template: function DemandeIndComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1);
      \u0275\u0275element(1, "p-toast");
      \u0275\u0275template(2, DemandeIndComponent_Conditional_2_Template, 2, 3, "div", 2);
      \u0275\u0275elementStart(3, "form", 3, 0);
      \u0275\u0275listener("ngSubmit", function DemandeIndComponent_Template_form_ngSubmit_3_listener() {
        \u0275\u0275restoreView(_r1);
        const demandeForm_r2 = \u0275\u0275reference(4);
        return \u0275\u0275resetView(ctx.createDemande(demandeForm_r2));
      });
      \u0275\u0275elementStart(5, "div", 4)(6, "h1", 5);
      \u0275\u0275template(7, DemandeIndComponent_Case_7_Template, 1, 0)(8, DemandeIndComponent_Case_8_Template, 1, 0)(9, DemandeIndComponent_Case_9_Template, 1, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "table", 6)(11, "tbody")(12, "tr")(13, "td", 7);
      \u0275\u0275text(14, "D\xE9l\xE9gation *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "td", 8)(16, "p-dropdown", 9);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_16_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.delegation, $event) || (ctx.formData.delegation = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onChange", function DemandeIndComponent_Template_p_dropdown_onChange_16_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onDelegationChange($event));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "td", 7);
      \u0275\u0275text(18, "Agence *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "td", 8)(20, "p-dropdown", 10);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_20_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.agence, $event) || (ctx.formData.agence = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onChange", function DemandeIndComponent_Template_p_dropdown_onChange_20_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onAgenceChange($event));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "td", 7);
      \u0275\u0275text(22, "Point de Service *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "td", 8)(24, "p-dropdown", 11);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_24_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.pos, $event) || (ctx.formData.pos = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(25, "tr")(26, "td", 7);
      \u0275\u0275text(27, "Date de la demande");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "td")(29, "span", 12);
      \u0275\u0275text(30);
      \u0275\u0275pipe(31, "date");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "td", 7);
      \u0275\u0275text(33, "N\xB0 Membre *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "td")(35, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_35_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.numeroMembre, $event) || (ctx.formData.numeroMembre = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(36, "td", 7);
      \u0275\u0275text(37, "N\xB0 de la demande");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "td")(39, "input", 14);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_39_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.numeroDemande, $event) || (ctx.formData.numeroDemande = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(40, "div", 15)(41, "div", 16)(42, "span");
      \u0275\u0275text(43, "Type de Demande");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "table", 17)(45, "tbody")(46, "tr")(47, "td", 18);
      \u0275\u0275text(48, "Nature de la demande *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "td", 19)(50, "p-dropdown", 20);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_50_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.natureClient, $event) || (ctx.formData.natureClient = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onChange", function DemandeIndComponent_Template_p_dropdown_onChange_50_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onNatureClientChange($event));
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(51, DemandeIndComponent_Conditional_51_Template, 9, 4, "tr");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(52, "div", 15)(53, "div", 16)(54, "span");
      \u0275\u0275text(55, "1. Identification de l'emprunteur");
      \u0275\u0275elementEnd();
      \u0275\u0275template(56, DemandeIndComponent_Conditional_56_Template, 3, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "table", 17)(58, "tbody")(59, "tr")(60, "td", 21);
      \u0275\u0275text(61, "Pr\xE9nom (s) et Nom *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "td", 19)(63, "div", 22)(64, "input", 23);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_64_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.prenom, $event) || (ctx.formData.prenom = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(65, "input", 24);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_65_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nom, $event) || (ctx.formData.nom = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(66, "tr")(67, "td", 7);
      \u0275\u0275text(68, "Autres nom (surnom)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "td", 19)(70, "input", 25);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_70_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.sernom, $event) || (ctx.formData.sernom = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(71, "tr")(72, "td", 7);
      \u0275\u0275text(73, "Date d'adh\xE9sion");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "td")(75, "p-calendar", 26);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_calendar_ngModelChange_75_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.dateAdhesion, $event) || (ctx.formData.dateAdhesion = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(76, "td", 7);
      \u0275\u0275text(77, "Sexe *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(78, "td")(79, "p-dropdown", 27);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_79_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.genre, $event) || (ctx.formData.genre = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(80, "td", 7);
      \u0275\u0275text(81, "Cat\xE9gories");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "td")(83, "input", 28);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_83_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.categorie, $event) || (ctx.formData.categorie = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(84, "tr")(85, "td", 7);
      \u0275\u0275text(86, "Nature de la pi\xE8ce d'identit\xE9 *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "td", 29)(88, "p-dropdown", 30);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_88_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.typePiece, $event) || (ctx.formData.typePiece = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(89, "td", 7);
      \u0275\u0275text(90, "Num\xE9ro de la pi\xE8ce *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "td", 29)(92, "input", 31);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_92_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.numId, $event) || (ctx.formData.numId = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(93, "tr")(94, "td", 7);
      \u0275\u0275text(95, "Date de naissance *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(96, "td")(97, "p-calendar", 32);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_calendar_ngModelChange_97_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.dateNaissance, $event) || (ctx.formData.dateNaissance = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(98, "td", 33);
      \u0275\u0275text(99, "Lieu de naissance *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(100, "td", 29)(101, "input", 34);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_101_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.lieuxNaissance, $event) || (ctx.formData.lieuxNaissance = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(102, "tr")(103, "td", 7);
      \u0275\u0275text(104, "Adresse personnelle *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(105, "td", 19)(106, "input", 35);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_106_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.addresseDomicileContact, $event) || (ctx.formData.addresseDomicileContact = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(107, "tr")(108, "td", 7);
      \u0275\u0275text(109, "Nombre d'ann\xE9es \xE0 cette adresse *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "td")(111, "p-inputNumber", 36);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_111_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nombreAnneeHabitation, $event) || (ctx.formData.nombreAnneeHabitation = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(112, "td", 33);
      \u0275\u0275text(113, "Rep\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(114, "td", 29)(115, "input", 37);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_115_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.typePropriete, $event) || (ctx.formData.typePropriete = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(116, "tr")(117, "td", 7);
      \u0275\u0275text(118, "T\xE9l\xE9phone *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(119, "td")(120, "input", 38);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_120_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.telephone, $event) || (ctx.formData.telephone = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(121, "td", 33);
      \u0275\u0275text(122, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(123, "td", 29)(124, "input", 39);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_124_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.email, $event) || (ctx.formData.email = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(125, "tr")(126, "td", 7);
      \u0275\u0275text(127, "Situation de famille *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(128, "td")(129, "p-dropdown", 40);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_129_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.situationMatrimoniale, $event) || (ctx.formData.situationMatrimoniale = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(130, "td", 7);
      \u0275\u0275text(131, "Enfants \xE0 charge");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(132, "td")(133, "p-inputNumber", 41);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_133_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nombrePersonneScolarise, $event) || (ctx.formData.nombrePersonneScolarise = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(134, "td", 7);
      \u0275\u0275text(135, "Autres personnes \xE0 charge:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(136, "td")(137, "p-inputNumber", 42);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_137_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nombrePersonneEnCharge, $event) || (ctx.formData.nombrePersonneEnCharge = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(138, "tr")(139, "td", 7);
      \u0275\u0275text(140, "Nom du p\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(141, "td", 29)(142, "input", 43);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_142_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nomPere, $event) || (ctx.formData.nomPere = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(143, "td", 7);
      \u0275\u0275text(144, "Nom de la m\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(145, "td", 29)(146, "input", 44);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_146_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nomMere, $event) || (ctx.formData.nomMere = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(147, "tr")(148, "td", 7);
      \u0275\u0275text(149, "Nom du conjoint");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(150, "td", 19)(151, "input", 45);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_151_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nomConjoint, $event) || (ctx.formData.nomConjoint = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(152, "tr")(153, "td", 46);
      \u0275\u0275text(154, "Nature de l'activit\xE9 ou de l'entreprise");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(155, "td", 19)(156, "input", 47);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_156_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.natureActivite, $event) || (ctx.formData.natureActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(157, "tr")(158, "td", 7);
      \u0275\u0275text(159, "Type d'activit\xE9 *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(160, "td")(161, "p-dropdown", 48);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_161_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.selectedTypeActivite, $event) || (ctx.formData.selectedTypeActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onChange", function DemandeIndComponent_Template_p_dropdown_onChange_161_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onActiviteChange($event));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(162, "td", 7);
      \u0275\u0275text(163, "Sous-activit\xE9 *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(164, "td")(165, "p-dropdown", 49);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_165_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.selectedSousActivite, $event) || (ctx.formData.selectedSousActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onChange", function DemandeIndComponent_Template_p_dropdown_onChange_165_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSousActiviteChange($event));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(166, "td", 7);
      \u0275\u0275text(167, "Fili\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(168, "td")(169, "p-dropdown", 50);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_169_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.selectedSousSousActivite, $event) || (ctx.formData.selectedSousSousActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onChange", function DemandeIndComponent_Template_p_dropdown_onChange_169_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onSousSousActiviteChange($event));
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(170, "tr")(171, "td", 7);
      \u0275\u0275text(172, "Nombre d'ann\xE9es d'exp\xE9rience dans cette activit\xE9 *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(173, "td", 19)(174, "p-inputNumber", 51);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_174_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nombreAnneeActivite, $event) || (ctx.formData.nombreAnneeActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(175, "tr")(176, "td", 7);
      \u0275\u0275text(177, "Autres activit\xE9s g\xE9n\xE9ratrices de revenus");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(178, "td", 19)(179, "input", 52);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_179_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.autreActivite, $event) || (ctx.formData.autreActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(180, "tr")(181, "td", 7);
      \u0275\u0275text(182, "Adresse de l'entreprise *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(183, "td", 19)(184, "input", 53);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_184_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.adresseLieuActivite, $event) || (ctx.formData.adresseLieuActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(185, "tr")(186, "td", 7);
      \u0275\u0275text(187, "Pr\xE9fecture");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(188, "td")(189, "input", 54);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_189_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.prefectureActivite, $event) || (ctx.formData.prefectureActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(190, "td", 7);
      \u0275\u0275text(191, "Sous-pr\xE9fecture");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(192, "td")(193, "input", 55);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_193_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.sousPrefectureActivite, $event) || (ctx.formData.sousPrefectureActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(194, "td", 7);
      \u0275\u0275text(195, "Lieu de l'activit\xE9");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(196, "td")(197, "input", 56);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_197_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.lieuActivite, $event) || (ctx.formData.lieuActivite = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(198, "div", 15)(199, "div", 16)(200, "span");
      \u0275\u0275text(201, "2. Caract\xE9ristiques du pr\xEAt");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(202, "table", 17)(203, "tbody")(204, "tr")(205, "td", 18);
      \u0275\u0275text(206, "Objet du pr\xEAt *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(207, "td", 57)(208, "p-dropdown", 58);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_208_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.objectCredit, $event) || (ctx.formData.objectCredit = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(209, "td", 7);
      \u0275\u0275text(210, "Montant demand\xE9 *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(211, "td", 8)(212, "p-inputNumber", 59);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_212_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.montantDemande, $event) || (ctx.formData.montantDemande = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(213, "td", 60);
      \u0275\u0275text(214, "GNF");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(215, "td", 7);
      \u0275\u0275text(216, "Dur\xE9e du pr\xEAt *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(217, "td")(218, "p-inputNumber", 61);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_218_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.dureeDemande, $event) || (ctx.formData.dureeDemande = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(219, "tr")(220, "td", 7);
      \u0275\u0275text(221, "Nombre d'\xE9ch\xE9ances *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(222, "td")(223, "p-inputNumber", 62);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_223_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.nombreEcheance, $event) || (ctx.formData.nombreEcheance = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(224, "td", 7);
      \u0275\u0275text(225, "Taux *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(226, "td")(227, "p-inputNumber", 63);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_227_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.tauxInteret, $event) || (ctx.formData.tauxInteret = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(228, "td", 33);
      \u0275\u0275text(229, "P\xE9riodicit\xE9 *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(230, "td")(231, "p-dropdown", 64);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_231_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.periodiciteRemboursement, $event) || (ctx.formData.periodiciteRemboursement = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(232, "tr")(233, "td", 7);
      \u0275\u0275text(234, "Montant \xE0 rembourser par \xE9ch\xE9ance");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(235, "td")(236, "p-inputNumber", 65);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_236_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.echeance, $event) || (ctx.formData.echeance = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(237, "td", 66);
      \u0275\u0275text(238, "Autres (\xE0 pr\xE9ciser) *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(239, "td", 29)(240, "input", 67);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_input_ngModelChange_240_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.detailObjectCredit, $event) || (ctx.formData.detailObjectCredit = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(241, "tr")(242, "td", 7);
      \u0275\u0275text(243, "Statut du cr\xE9dit *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(244, "td")(245, "div", 68);
      \u0275\u0275repeaterCreate(246, DemandeIndComponent_For_247_Template, 4, 6, "div", 69, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(248, "td", 7);
      \u0275\u0275text(249, "Rang");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(250, "td")(251, "p-inputNumber", 70);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_251_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.rangCredit, $event) || (ctx.formData.rangCredit = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(252, "td", 33);
      \u0275\u0275text(253, "Type de cr\xE9dit *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(254, "td")(255, "p-dropdown", 71);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_255_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.formData.tipCredito, $event) || (ctx.formData.tipCredito = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("onChange", function DemandeIndComponent_Template_p_dropdown_onChange_255_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onTypeCreditChange($event));
      });
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(256, "div", 15)(257, "div", 16)(258, "span");
      \u0275\u0275text(259, "3. Garanties");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(260, "button", 72);
      \u0275\u0275listener("click", function DemandeIndComponent_Template_button_click_260_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.showAddGarantieDialog());
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(261, "table", 73)(262, "thead")(263, "tr")(264, "th", 8);
      \u0275\u0275text(265, "Types de garantie");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(266, "th");
      \u0275\u0275text(267, "Description de la garantie");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(268, "th", 8);
      \u0275\u0275text(269, "Valeur de la garantie");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(270, "th", 8);
      \u0275\u0275text(271, "Valeur retenue");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(272, "th", 74);
      \u0275\u0275text(273, "Actions");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(274, "tbody");
      \u0275\u0275repeaterCreate(275, DemandeIndComponent_For_276_Template, 12, 11, "tr", null, \u0275\u0275repeaterTrackByIndex, false, DemandeIndComponent_ForEmpty_277_Template, 5, 0, "tr");
      \u0275\u0275repeaterCreate(278, DemandeIndComponent_For_279_Template, 12, 11, "tr", null, \u0275\u0275repeaterTrackByIndex, false, DemandeIndComponent_ForEmpty_280_Template, 5, 0, "tr");
      \u0275\u0275repeaterCreate(281, DemandeIndComponent_For_282_Template, 12, 11, "tr", null, \u0275\u0275repeaterTrackByIndex, false, DemandeIndComponent_ForEmpty_283_Template, 5, 0, "tr");
      \u0275\u0275elementStart(284, "tr", 75);
      \u0275\u0275element(285, "td");
      \u0275\u0275elementStart(286, "td", 76);
      \u0275\u0275text(287, "TOTAL");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(288, "td", 77);
      \u0275\u0275text(289);
      \u0275\u0275pipe(290, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(291, "td", 77);
      \u0275\u0275text(292);
      \u0275\u0275pipe(293, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275element(294, "td");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(295, "div", 78)(296, "button", 79);
      \u0275\u0275listener("click", function DemandeIndComponent_Template_button_click_296_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.router.navigate(["/demandes"]));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(297, "div", 22)(298, "button", 80);
      \u0275\u0275listener("click", function DemandeIndComponent_Template_button_click_298_listener() {
        \u0275\u0275restoreView(_r1);
        const demandeForm_r2 = \u0275\u0275reference(4);
        return \u0275\u0275resetView(demandeForm_r2.resetForm());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(299, "button", 81);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(300, "p-dialog", 82);
      \u0275\u0275twoWayListener("visibleChange", function DemandeIndComponent_Template_p_dialog_visibleChange_300_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.state().showGarantieDialog, $event) || (ctx.state().showGarantieDialog = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementStart(301, "div", 83)(302, "div", 84)(303, "label", 85);
      \u0275\u0275text(304, "Type de garantie *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(305, "p-dropdown", 86);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_dropdown_ngModelChange_305_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.state().currentGarantie.typeGarantie, $event) || (ctx.state().currentGarantie.typeGarantie = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(306, "div", 84)(307, "label", 85);
      \u0275\u0275text(308, "Description de la garantie *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(309, "textarea", 87);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_textarea_ngModelChange_309_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.state().currentGarantie.descriptionGarantie, $event) || (ctx.state().currentGarantie.descriptionGarantie = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275text(310, "                ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(311, "div", 84)(312, "label", 85);
      \u0275\u0275text(313, "Valeur de la garantie (GNF) *");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(314, "p-inputNumber", 88);
      \u0275\u0275twoWayListener("ngModelChange", function DemandeIndComponent_Template_p_inputNumber_ngModelChange_314_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.state().currentGarantie.valeurGarantie, $event) || (ctx.state().currentGarantie.valeurGarantie = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(315, "div", 84)(316, "div", 89)(317, "span");
      \u0275\u0275text(318, "Valeur retenue (75%):");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(319, "strong");
      \u0275\u0275text(320);
      \u0275\u0275pipe(321, "number");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(322, DemandeIndComponent_ng_template_322_Template, 2, 1, "ng-template", 90);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_10_0;
      let tmp_14_0;
      const demandeForm_r2 = \u0275\u0275reference(4);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.state().submitting || ctx.state().loading ? 2 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275conditional((tmp_2_0 = ctx.formData.natureClient) === "Demande de Credit Pour PME/PMI" ? 7 : tmp_2_0 === "Demande de credit Pour Professionnels" ? 8 : 9);
      \u0275\u0275advance(9);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.delegation);
      \u0275\u0275property("options", ctx.state().allDelegations || \u0275\u0275pureFunction0(171, _c0))("filter", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.agence);
      \u0275\u0275property("options", ctx.state().filteredAgences || \u0275\u0275pureFunction0(172, _c0))("filter", true)("disabled", ctx.state().submitting || !((tmp_10_0 = ctx.state().filteredAgences) == null ? null : tmp_10_0.length));
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.pos);
      \u0275\u0275property("options", ctx.state().filteredPointsVente || \u0275\u0275pureFunction0(173, _c0))("filter", true)("disabled", ctx.state().submitting || !((tmp_14_0 = ctx.state().filteredPointsVente) == null ? null : tmp_14_0.length));
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(31, 159, ctx.today, "dd/MM/yyyy"));
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.numeroMembre);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.numeroDemande);
      \u0275\u0275property("disabled", true);
      \u0275\u0275advance(11);
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(174, _c1));
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.natureClient);
      \u0275\u0275property("options", ctx.natureClientOptions)("disabled", ctx.state().submitting)("appendTo", "body");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formData.natureClient === "Demande de Credit Pour PME/PMI" ? 51 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.formData.natureClient === "Demande de Credit Pour PME/PMI" ? 56 : -1);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.prenom);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nom);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.sernom);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.dateAdhesion);
      \u0275\u0275property("showIcon", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.genre);
      \u0275\u0275property("options", ctx.genreOptions)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.categorie);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.typePiece);
      \u0275\u0275property("options", ctx.typePieceOptions)("disabled", ctx.state().submitting)("appendTo", "body");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.numId);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.dateNaissance);
      \u0275\u0275property("showIcon", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.lieuxNaissance);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.addresseDomicileContact);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nombreAnneeHabitation);
      \u0275\u0275property("min", 0)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.typePropriete);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.telephone);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.email);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.situationMatrimoniale);
      \u0275\u0275property("options", ctx.situationMatrimonialeOptions)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nombrePersonneScolarise);
      \u0275\u0275property("min", 0)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nombrePersonneEnCharge);
      \u0275\u0275property("min", 0)("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nomPere);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nomMere);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nomConjoint);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.natureActivite);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.selectedTypeActivite);
      \u0275\u0275property("options", ctx.activiteOptions)("filter", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.selectedSousActivite);
      \u0275\u0275property("options", ctx.sousActiviteOptions)("filter", true)("disabled", ctx.state().submitting || ctx.sousActiviteOptions.length === 0);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.selectedSousSousActivite);
      \u0275\u0275property("options", ctx.sousSousActiviteOptions)("filter", true)("disabled", ctx.state().submitting || ctx.sousSousActiviteOptions.length === 0);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nombreAnneeActivite);
      \u0275\u0275property("min", 0)("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.autreActivite);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.adresseLieuActivite);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.prefectureActivite);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.sousPrefectureActivite);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.lieuActivite);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(11);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.objectCredit);
      \u0275\u0275property("options", ctx.objectCreditOptions)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.montantDemande);
      \u0275\u0275property("min", 1)("disabled", ctx.state().submitting);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.dureeDemande);
      \u0275\u0275property("min", 1)("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.nombreEcheance);
      \u0275\u0275property("min", 1)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.tauxInteret);
      \u0275\u0275property("min", 0)("max", 100)("minFractionDigits", 2)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.periodiciteRemboursement);
      \u0275\u0275property("options", ctx.periodiciteOptions)("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.echeance);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.detailObjectCredit);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.statutCreditOptions);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.rangCredit);
      \u0275\u0275property("min", 1)("disabled", ctx.state().submitting);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.formData.tipCredito);
      \u0275\u0275property("options", ctx.typeCreditOptions)("filter", true)("disabled", ctx.state().submitting);
      \u0275\u0275advance(5);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(15);
      \u0275\u0275repeater(ctx.getGarantiesByType("Garantie Financiere"));
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.getGarantiesByType("Garantie Materielle"));
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.getGarantiesByType("Caution Solidaire", "Autre Garantie"));
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(290, 162, ctx.calculateTotalGaranties(), "1.0-0"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(293, 165, ctx.calculateTotalEmpruntable(), "1.0-0"));
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.state().submitting);
      \u0275\u0275advance();
      \u0275\u0275property("loading", ctx.state().submitting)("disabled", demandeForm_r2.invalid || ctx.state().submitting || ctx.state().garanties.length === 0);
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(175, _c2));
      \u0275\u0275twoWayProperty("visible", ctx.state().showGarantieDialog);
      \u0275\u0275property("header", ctx.state().editingGarantieIndex !== void 0 ? "Modifier la garantie" : "Ajouter une garantie")("modal", true)("draggable", false)("resizable", false);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.state().currentGarantie.typeGarantie);
      \u0275\u0275property("options", ctx.typeGarantieOptions);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.state().currentGarantie.descriptionGarantie);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.state().currentGarantie.valeurGarantie);
      \u0275\u0275property("min", 1);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(321, 168, ctx.state().currentGarantie.valeurGarantie * 0.75, "1.0-0"), " GNF");
    }
  }, dependencies: [
    CommonModule,
    DecimalPipe,
    DatePipe,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    NgForm,
    InputTextModule,
    InputText,
    TextareaModule,
    Textarea,
    FileUploadModule,
    PrimeTemplate,
    ButtonModule,
    ButtonDirective,
    InputGroupModule,
    RippleModule,
    MessageModule,
    ProgressSpinnerModule,
    ProgressSpinner,
    PasswordModule,
    DropdownModule,
    Dropdown,
    InputNumberModule,
    InputNumber,
    ToastModule,
    Toast,
    CalendarModule,
    Calendar,
    RadioButtonModule,
    RadioButton,
    TableModule,
    DialogModule,
    Dialog,
    DividerModule,
    CardModule,
    PanelModule,
    ChipModule
  ], styles: ['@charset "UTF-8";\n\n\n\n.form-container[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 1rem;\n  background-color: #fff;\n  position: relative;\n}\n.loading-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(255, 255, 255, 0.8);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 9999;\n}\n.form-header[_ngcontent-%COMP%] {\n  border: 2px solid #000;\n  margin-bottom: 0;\n}\n.form-header[_ngcontent-%COMP%]   .header-title[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 1.25rem;\n  font-weight: bold;\n  padding: 0.75rem 1rem;\n  margin: 0;\n  background-color: #e9ecef;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n.header-table[_ngcontent-%COMP%] {\n  border-top: none !important;\n}\n.header-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  border-top: none !important;\n}\n.header-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  border-top: 1px solid #000 !important;\n}\n.header-table[_ngcontent-%COMP%]   .date-display[_ngcontent-%COMP%] {\n  font-weight: 500;\n  padding: 0.25rem 0.5rem;\n  display: inline-block;\n}\n.form-section[_ngcontent-%COMP%] {\n  border: 2px solid #000;\n  margin-bottom: 1rem;\n  margin-top: -2px;\n}\n.form-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%] {\n  background-color: #f5f5f5;\n  padding: 0.5rem 1rem;\n  font-weight: bold;\n  font-size: 0.95rem;\n  border-bottom: 2px solid #000;\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.form-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-note[_ngcontent-%COMP%] {\n  font-weight: normal;\n  font-size: 0.875rem;\n  margin-left: auto;\n}\n.form-section[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-input[_ngcontent-%COMP%] {\n  width: 180px;\n  height: 28px;\n  border: 1px solid #000;\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n}\n.form-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.875rem;\n}\n.form-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n.form-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  border: 1px solid #000;\n  padding: 0.35rem 0.5rem;\n  vertical-align: middle;\n  min-height: 36px;\n}\n.form-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background-color: #f5f5f5;\n  font-weight: 600;\n  text-align: center;\n}\n.form-table[_ngcontent-%COMP%]   .label-cell[_ngcontent-%COMP%] {\n  background-color: #fff;\n  font-weight: 500;\n  white-space: nowrap;\n}\n.form-table[_ngcontent-%COMP%]   .label-cell.highlight-yellow[_ngcontent-%COMP%] {\n  background-color: #ffff00;\n}\n.form-table[_ngcontent-%COMP%]   .label-cell.highlight-blue[_ngcontent-%COMP%] {\n  background-color: #cce5ff;\n}\n.form-table[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%], \n.form-table[_ngcontent-%COMP%]   textarea.p-inputtextarea[_ngcontent-%COMP%] {\n  border: 1px solid #ced4da !important;\n  border-radius: 3px !important;\n  width: 100%;\n  padding: 0.35rem 0.5rem;\n  font-size: 0.875rem;\n  background-color: #fff !important;\n  min-height: 32px;\n}\n.form-table[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]:focus, \n.form-table[_ngcontent-%COMP%]   textarea.p-inputtextarea[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.25) !important;\n  border-color: #2196f3 !important;\n  outline: none;\n}\n.form-table[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]::placeholder, \n.form-table[_ngcontent-%COMP%]   textarea.p-inputtextarea[_ngcontent-%COMP%]::placeholder {\n  color: #999;\n  font-style: italic;\n}\n.form-table[_ngcontent-%COMP%]   input.p-inputtext[_ngcontent-%COMP%]:disabled, \n.form-table[_ngcontent-%COMP%]   textarea.p-inputtextarea[_ngcontent-%COMP%]:disabled {\n  background-color: #e9ecef !important;\n  cursor: not-allowed;\n}\n.form-table[_ngcontent-%COMP%]     .p-dropdown, \n.form-table[_ngcontent-%COMP%]     .p-calendar, \n.form-table[_ngcontent-%COMP%]     .p-inputnumber {\n  width: 100%;\n  border: 1px solid #ced4da !important;\n  border-radius: 3px !important;\n  background-color: #fff !important;\n}\n.form-table[_ngcontent-%COMP%]     .p-dropdown .p-dropdown-label, \n.form-table[_ngcontent-%COMP%]     .p-dropdown .p-inputtext, \n.form-table[_ngcontent-%COMP%]     .p-calendar .p-dropdown-label, \n.form-table[_ngcontent-%COMP%]     .p-calendar .p-inputtext, \n.form-table[_ngcontent-%COMP%]     .p-inputnumber .p-dropdown-label, \n.form-table[_ngcontent-%COMP%]     .p-inputnumber .p-inputtext {\n  padding: 0.35rem 0.5rem;\n  font-size: 0.875rem;\n  border: none !important;\n  border-radius: 0 !important;\n  background-color: transparent !important;\n  min-height: 30px;\n}\n.form-table[_ngcontent-%COMP%]     .p-dropdown .p-dropdown-trigger, \n.form-table[_ngcontent-%COMP%]     .p-dropdown .p-datepicker-trigger, \n.form-table[_ngcontent-%COMP%]     .p-calendar .p-dropdown-trigger, \n.form-table[_ngcontent-%COMP%]     .p-calendar .p-datepicker-trigger, \n.form-table[_ngcontent-%COMP%]     .p-inputnumber .p-dropdown-trigger, \n.form-table[_ngcontent-%COMP%]     .p-inputnumber .p-datepicker-trigger {\n  width: 2.5rem;\n  border: none !important;\n  background: transparent;\n}\n.form-table[_ngcontent-%COMP%]     .p-dropdown.p-inputwrapper-focus, \n.form-table[_ngcontent-%COMP%]     .p-dropdown:focus-within, \n.form-table[_ngcontent-%COMP%]     .p-calendar.p-inputwrapper-focus, \n.form-table[_ngcontent-%COMP%]     .p-calendar:focus-within, \n.form-table[_ngcontent-%COMP%]     .p-inputnumber.p-inputwrapper-focus, \n.form-table[_ngcontent-%COMP%]     .p-inputnumber:focus-within {\n  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.25) !important;\n  border-color: #2196f3 !important;\n}\n.form-table[_ngcontent-%COMP%]     .p-dropdown.p-disabled, \n.form-table[_ngcontent-%COMP%]     .p-calendar.p-disabled, \n.form-table[_ngcontent-%COMP%]     .p-inputnumber.p-disabled {\n  background-color: #e9ecef !important;\n  opacity: 0.7;\n}\n.form-table[_ngcontent-%COMP%]     .p-inputnumber .p-inputnumber-input {\n  border: none !important;\n  border-radius: 0 !important;\n  background-color: transparent !important;\n  min-height: 30px;\n}\n.form-table[_ngcontent-%COMP%]     .p-radiobutton {\n  width: 18px;\n  height: 18px;\n}\n.form-table[_ngcontent-%COMP%]     .p-dropdown-panel {\n  z-index: 10000;\n}\n.garantie-table[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background-color: #fff;\n  border: 2px solid #000;\n  font-weight: 600;\n  padding: 0.5rem;\n}\n.garantie-table[_ngcontent-%COMP%]   .total-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  border-top: 2px solid #000;\n  background-color: #f5f5f5;\n}\n.garantie-table[_ngcontent-%COMP%]   .text-muted[_ngcontent-%COMP%] {\n  color: #6c757d;\n  font-style: italic;\n}\n.flex[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.flex.gap-2[_ngcontent-%COMP%] {\n  gap: 0.5rem;\n}\n.flex.gap-3[_ngcontent-%COMP%] {\n  gap: 0.75rem;\n}\n.flex-1[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 150px;\n}\n.w-full[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.w-15rem[_ngcontent-%COMP%] {\n  width: 15rem;\n  min-width: 15rem;\n  flex-shrink: 0;\n}\n.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.font-bold[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.ml-1[_ngcontent-%COMP%] {\n  margin-left: 0.25rem;\n}\n.ml-3[_ngcontent-%COMP%] {\n  margin-left: 0.75rem;\n}\n.mb-2[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.block[_ngcontent-%COMP%] {\n  display: block;\n}\n.field-radiobutton[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.field-radiobutton[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  margin-left: 0.25rem;\n  font-size: 0.875rem;\n  cursor: pointer;\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem;\n  background-color: #f8f9fa;\n  border: 2px solid #000;\n  margin-top: -2px;\n}\n.action-buttons[_ngcontent-%COMP%]     .p-button {\n  font-size: 0.9rem;\n  padding: 0.5rem 1rem;\n}\n.valeur-retenue[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  background-color: #d4edda;\n  border-radius: 4px;\n  border: 1px solid #c3e6cb;\n}\n.grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  margin: -0.5rem;\n}\n.grid[_ngcontent-%COMP%]   .col-12[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.5rem;\n}\n@media screen and (max-width: 992px) {\n  .form-table[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n  .form-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], \n   .form-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n    padding: 0.25rem 0.35rem;\n  }\n  .form-table[_ngcontent-%COMP%]   .label-cell[_ngcontent-%COMP%] {\n    white-space: normal;\n  }\n  .section-header[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n  }\n}\n@media screen and (max-width: 768px) {\n  .form-container[_ngcontent-%COMP%] {\n    padding: 0.5rem;\n  }\n  .form-header[_ngcontent-%COMP%]   .header-title[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .action-buttons[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .action-buttons[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n}\n@media print {\n  .action-buttons[_ngcontent-%COMP%], \n   .p-button[_ngcontent-%COMP%], \n   .loading-overlay[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n  .form-section[_ngcontent-%COMP%] {\n    page-break-inside: avoid;\n  }\n  .form-container[_ngcontent-%COMP%] {\n    max-width: 100%;\n    padding: 0;\n  }\n}\n/*# sourceMappingURL=demande-ind.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DemandeIndComponent, { className: "DemandeIndComponent", filePath: "src/app/pages/auth/credit/demande-ind/demande-ind.component.ts", lineNumber: 66 });
})();
export {
  DemandeIndComponent
};
//# sourceMappingURL=chunk-JTBO5UBM.js.map
