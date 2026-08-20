package io.digiservices.bcrgservice.utils;

import io.digiservices.bcrgservice.dto.BeneficiaireEngagementDto;
import io.digiservices.bcrgservice.dto.CompteAssocieDto;
import io.digiservices.bcrgservice.dto.CompteAssocieMoraleDto;
import io.digiservices.bcrgservice.dto.DonneeComplementaireDto;
import io.digiservices.bcrgservice.dto.EmployeurDto;
import io.digiservices.bcrgservice.dto.EncoursDto;
import io.digiservices.bcrgservice.dto.EngagementDto;
import io.digiservices.bcrgservice.dto.PageDto;
import io.digiservices.bcrgservice.dto.PersonneMoraleDto;
import io.digiservices.bcrgservice.dto.PersonnePhysiqueDto;
import io.digiservices.bcrgservice.dto.PieceDto;
import io.digiservices.clients.reg.RegAdresseDto;
import io.digiservices.clients.reg.RegCompteDto;
import io.digiservices.clients.reg.RegEncoursDto;
import io.digiservices.clients.reg.RegEngagementDto;
import io.digiservices.clients.reg.RegPersonneMoraleDto;
import io.digiservices.clients.reg.RegPersonnePhysiqueDto;
import io.digiservices.clients.reg.RegPieceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.function.Function;

import static io.digiservices.bcrgservice.utils.BcrgTranslator.ND;

/**
 * Mapping des DTO bruts SAF (contrat ebanking) vers les DTO publics au format BCRG.
 *
 * <p>Applique la politique de complétude du retour BCRG (août 2026) :
 * champ sans source SI → "ND" ; champ sourcé mais vide → null ; champ conditionnel
 * non applicable → null ; sous-objets facultatifs non portés → listes vides.</p>
 */
@Component
@RequiredArgsConstructor
public class BcrgMapper {

    private final BcrgTranslator translator;

    public PersonnePhysiqueDto toPersonnePhysique(RegPersonnePhysiqueDto s) {
        if (s == null) return null;
        RegAdresseDto adresse = premiereAdresse(s.getAdresses());
        List<PieceDto> pieces = toPieces(s.getCodCliente(), s.getPieces());

        PersonnePhysiqueDto d = new PersonnePhysiqueDto();
        d.setIdInterneClt(s.getCodCliente());
        d.setNatDec(null); // géré par le middleware BCRG
        d.setNatClient(translator.translateNatClient(s.getIndRelacion()));
        // PP V2 : NIN = numéro de la CIN biométrique (type 02, 16 chiffres) quand elle existe
        d.setNin(pieces.stream()
                .filter(p -> "02".equals(p.getTypPiece()) && StringUtils.hasText(p.getNumPiece()))
                .map(PieceDto::getNumPiece)
                .findFirst().orElse(null));
        d.setDatCreaPart(translator.formatDate(s.getFecIngreso()));
        d.setNomNaiClt(join(s.getPrimerApellido(), s.getSegundoApellido()));
        String sexe = translator.translateSexe(s.getIndSexo());
        String etatCivil = translator.translateEtatCivil(s.getEstCivil());
        // Nom marital : exigé pour une femme mariée uniquement ; NOM_CONYUGUE en tient lieu, sinon ND
        d.setNomMtlClt("F".equals(sexe) && "2".equals(etatCivil)
                ? (StringUtils.hasText(s.getNomConyugue()) ? s.getNomConyugue().trim() : ND)
                : null);
        d.setPrenomClt(join(s.getPrimerNombre(), s.getSegundoNombre()));
        d.setNomComp(s.getNomCliente());
        d.setSexe(sexe);
        // PP V2 : date de naissance depuis la fiche associé (CL_DATOS_ASOCIADO)
        d.setDatNai(s.getFechNacimiento() != null ? translator.formatDate(s.getFechNacimiento()) : ND);
        d.setEtatCivil(etatCivil);
        d.setNomPere(ND);    // filiation non portée : ND exigé par la BCRG
        d.setPrenomPere(ND);
        d.setNomNaiMere(ND);
        d.setPrmMre(ND);
        d.setVilleNai(blankToNull(s.getLugarNacimiento()));
        // PP V2 : pays de naissance dérivé de la nationalité (convention documentée)
        d.setPaysNai(translator.paysDepuisNationalite(s.getNacionalidad()));
        // PP V2 : nationalité au référentiel pays_nationalites
        d.setNatClt(translator.paysDepuisNationalite(s.getNacionalidad()));
        d.setResident(BcrgTranslator.RESIDENT_OUI);
        d.setPaysRes(BcrgTranslator.PAYS_GUINEE);
        d.setMobile(translator.normaliserMobile(s.getTelPrincipal()));
        d.setEmail(null); // facultatif, consigne BCRG : laisser vide
        d.setAdress(adresse != null && StringUtils.hasText(adresse.getDetDireccion())
                ? adresse.getDetDireccion().trim() : ND); // obligatoire
        d.setCommuneAdress(null);
        d.setCodePostal(adresse != null ? blankToNull(adresse.getCodPostal()) : null);
        d.setProfession(blankToNull(s.getDesProfesion()));
        d.setSecActEcon(translator.translateSecteurNaema(s.getDesActividad()));
        d.setSectInst(BcrgTranslator.SECT_INST_PARTICULIERS);
        d.setNumSecSoc(null);
        d.setSTutelle("0");
        d.setStatutClt("0"); // Actif (SAF ne porte pas le décès)
        d.setDateDeces(null);
        d.setSitBancaire(null); // réservé aux participants de type banque
        d.setDateDebIB(null);
        d.setDateFinIB(null);

        d.setComptesAssocies(toComptes(s.getCodCliente(), s.getCodAgencia(), s.getComptes()));
        d.setPieces(pieces);
        // PP V2 : revenu = SALARIO ; personnes à charge = CANT_DEPENDIENTES (repli NUM_HIJOS) ;
        // PropLoc au référentiel P/L/A
        d.setDonneeComplementaire(new DonneeComplementaireDto(
                s.getCantDependientes() != null ? s.getCantDependientes() : s.getNumHijos(),
                s.getSalario() != null ? s.getSalario().toPlainString() : ND,
                ND,
                translator.translatePropLoc(s.getTenenciaVivienda())));
        d.setTuteurCurateur(List.of());
        // PP V2 : employeur partiel depuis la fiche associé (LUGAR_TRABAJO)
        d.setEmployeurs(StringUtils.hasText(s.getLugarTrabajo())
                ? List.of(new EmployeurDto(s.getCodCliente(), ND, s.getLugarTrabajo().trim(), ND, ND, ND, ND, ND))
                : List.of());
        d.setDonneesAdditionelles(List.of());
        return d;
    }

    public PersonneMoraleDto toPersonneMorale(RegPersonneMoraleDto s) {
        if (s == null) return null;
        RegAdresseDto adresse = premiereAdresse(s.getAdresses());
        String formeJuridique = translator.translateFormeJuridique(s.getClaseSociedad(), s.getDesSociedad());

        PersonneMoraleDto d = new PersonneMoraleDto();
        d.setIdInterneClt(s.getCodCliente());
        d.setNatDec(null);
        d.setNatClient(translator.translateNatClient(s.getIndRelacion()));
        d.setDenomSocial(StringUtils.hasText(s.getRazonSocial()) ? s.getRazonSocial() : s.getNomCliente());
        d.setSigle(blankToNull(s.getNomComercial()));
        d.setDatCreat(ND); // date de création juridique non portée par le SI
        d.setStatut(BcrgTranslator.STATUT_PM_EN_ACTIVITE);
        d.setDatCreaPart(translator.formatDate(s.getFecIngreso()));
        d.setFormeJuridique(formeJuridique);
        d.setPaysSiegeSocial(BcrgTranslator.PAYS_GUINEE);
        // PM V2 : ville du siège = libellé de la province SAF (référentiel PA_PROVINCIAS,
        // renseignée pour ~100 % des PM) ; ND si l'adresse ou le libellé manque
        d.setVilleSiegeSocial(adresse != null && StringUtils.hasText(adresse.getDesProvincia())
                ? adresse.getDesProvincia().trim() : ND);
        d.setMobile(translator.normaliserMobile(s.getTelPrincipal()));
        d.setEmail(null);
        d.setSiteWeb(null);
        d.setAdress(adresse != null && StringUtils.hasText(adresse.getDetDireccion())
                ? adresse.getDetDireccion().trim() : ND);
        // PM V2 : commune depuis le référentiel PA_DISTRITOS (repli canton) ; facultatif → null
        d.setCommuneAdresse(adresse == null ? null
                : StringUtils.hasText(adresse.getDesDistrito()) ? adresse.getDesDistrito().trim()
                : StringUtils.hasText(adresse.getDesCanton()) ? adresse.getDesCanton().trim()
                : null);
        d.setCodePostal(adresse != null ? blankToNull(adresse.getCodPostal()) : null);
        d.setResident(BcrgTranslator.RESIDENT_OUI);
        // PM V2 : RCCM / NIF / NIFP / agrément recherchés dans les pièces SAF du client
        // (même procédé que le NIN des PP) ; ND en repli si aucune pièce ne correspond
        d.setRccm(coalesceND(numeroPiece(s.getPieces(), translator::estPieceRccm)));
        d.setNif(coalesceND(numeroPiece(s.getPieces(), translator::estPieceNif)));
        d.setNifp(coalesceND(numeroPiece(s.getPieces(), translator::estPieceNifp)));
        d.setNumAgrement(coalesceND(numeroPiece(s.getPieces(), translator::estPieceAgrement)));
        d.setNumSecSoc(null);
        d.setActEcon(translator.translateSecteurNaema(s.getDesActividad()));
        d.setSectInst(translator.sectInstPersonneMorale(formeJuridique));
        d.setSitBancaire(null);
        d.setDateDebIB(null);
        d.setDateFinIB(null);

        d.setComptesAssocies(toComptesMorale(s.getCodCliente(), s.getCodAgencia(), s.getComptes()));
        d.setMandataires(List.of());
        d.setMandatairesComptes(List.of());
        d.setActionnaires(List.of());
        d.setDonneesAdditionelles(List.of());
        return d;
    }

    /**
     * Engagement au contrat v1.3 : conventions CRG (catégorie 01, taux fixe, aucun
     * différé), clôture dérivée de l'état SAF, bénéficiaire unique à 100 %.
     */
    public EngagementDto toEngagement(RegEngagementDto s) {
        if (s == null) return null;
        String refIntEng = s.getNumCredito() != null ? String.valueOf(s.getNumCredito()) : null;
        boolean cloture = translator.estCreditCloture(s.getIndEstado(), s.getMonSaldo());

        EngagementDto d = new EngagementDto();
        d.setRefIntEng(refIntEng);
        d.setTypEve("01");        // engagement accordé
        d.setLigneParent("01");   // pas de lignes mère/fils au CRG
        d.setRefIntLigne(null);
        d.setRefDemandeEng(null);
        d.setDatDem(null);
        d.setTypModif("01");      // aucune modification
        d.setEstDout(null);
        d.setCloture(cloture ? "1" : "0");
        d.setMotifCloture(cloture ? translator.motifCloture(s.getIndEstado()) : null);
        d.setDatClo(cloture
                ? (s.getFecCancelacionCredito() != null ? translator.formatDate(s.getFecCancelacionCredito()) : ND)
                : null);
        d.setDatAccord(translator.formatDate(s.getFecApertura()));
        d.setDateMEP(translator.formatDate(s.getFecPrimerDesembolso()));
        d.setTypEng(s.getTipCredito() != null ? String.valueOf(s.getTipCredito()) : ND); // référentiel F.9 en attente
        d.setMntEng(s.getMonCredito());
        d.setMntInt(s.getMntInteretsTotal());
        d.setCodDev(BcrgTranslator.DEVISE_GNF);
        d.setPeriodRemb(ND); // référentiel des périodicités en attente
        d.setTxIntEng(translator.formatTaux(s.getTasaInteres()));
        d.setTypTxInt("00"); // taux fixe (politique CRG)
        d.setTxComm(null);
        d.setIndRef(null);
        d.setSprd(null);
        d.setTxEffGlob(ND); // TEG non calculé par le SI
        d.setMoyRemb("01"); // débit de compte (convention CRG, à confirmer)
        d.setTypAmo(s.getCantCuotas() != null && s.getCantCuotas() == 1L ? "04" : "05"); // in fine / échéance constante
        d.setTypDiffAmo("A");
        d.setUnitDur(null);
        d.setPerDiffAmo(null);
        d.setMntEch(s.getMonCuota());
        d.setNbrEch(s.getCantCuotas());
        d.setDatPremEch(s.getFecPremiereEcheance() != null
                ? translator.formatDate(s.getFecPremiereEcheance()) : ND);
        d.setDatFin(translator.formatDate(s.getFecVencimiento()));
        d.setMntFrais(BigDecimal.ZERO);
        d.setMntComm(BigDecimal.ZERO);
        d.setCodAgce(s.getCodAgencia()); // code SI (référentiel des agences en attente)
        d.setEstRachatCreance("02");
        d.setParCont(null);
        d.setValNom(null);
        d.setValCess(null);
        d.setDatEvent(translator.formatDate(LocalDate.now()));

        d.setBeneficiaires(List.of(new BeneficiaireEngagementDto(refIntEng, s.getCodCliente(), "100.00")));
        d.setGaranties(List.of());      // non portées par SAF (facultatif)
        d.setConsolidations(List.of()); // TypModif=01 : sans objet
        return d;
    }

    /**
     * Encours au contrat v1.3, calculé à la date d'arrêté : hors-bilan, montant utilisé,
     * total des impayés (capital + intérêts), dernier paiement, date de défaillance.
     * Provisions/pertes/créances rattachées : 0 en régime transitoire (comptabilité).
     */
    public EncoursDto toEncours(RegEncoursDto s, LocalDate arrete) {
        if (s == null) return null;
        BigDecimal capImp = nvlZero(s.getMntCapImpaye());
        BigDecimal totImp = capImp.add(nvlZero(s.getMntInteretsImpayes()));
        Long joursRetard = (s.getFecPlusAncienneImpayee() != null && arrete != null)
                ? ChronoUnit.DAYS.between(s.getFecPlusAncienneImpayee(), arrete) : null;

        EncoursDto d = new EncoursDto();
        d.setRefIntEng(s.getNumCredito() != null ? String.valueOf(s.getNumCredito()) : null);
        d.setCodDev(BcrgTranslator.DEVISE_GNF);
        d.setDatEch(translator.formatDate(s.getDatDerniereEcheance()));
        d.setMntDerEch(s.getMntDerniereEcheance());
        d.setMonPai(nvlZero(s.getMntDernierPaiement())); // 0 si aucun paiement
        d.setDatPai(s.getMntDernierPaiement() != null ? translator.formatDate(s.getDatDernierPaiement()) : null);
        d.setMntHBil(horsBilan(s.getMonCredito(), s.getMonDesembolsado()));
        d.setMntRemAnt(null); // facultatif, non porté par le SI
        d.setMntCRDU(s.getMonSaldo());
        d.setMntCreRat(BigDecimal.ZERO); // transitoire (comptabilité)
        d.setMntUtilise(nvlZero(s.getMonDesembolsado()));
        d.setMntAgi(null); // catégorie 02 uniquement
        d.setMntCapImp(capImp);
        d.setMntTotImp(totImp);
        d.setDatDefaill(totImp.signum() > 0 ? translator.formatDate(s.getFecPlusAncienneImpayee()) : null);
        d.setMntPro(BigDecimal.ZERO);   // transitoire (comptabilité)
        d.setMntPerte(BigDecimal.ZERO); // transitoire (comptabilité)
        d.setNbrEchPay(s.getNbEchPayees());
        d.setNbrEchImp(s.getNbEchImpayees());
        d.setNbrEchRest(s.getNbEchRestantes());
        d.setQualiCre(translator.qualiCreDepuisRetard(joursRetard));
        d.setPd(null);
        d.setLgd(null);
        d.setCcf(null);
        d.setIfrsStage(null);
        d.setDatEvent(translator.formatDate(LocalDate.now()));
        return d;
    }

    private static BigDecimal nvlZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    /** Hors bilan = montant de l'engagement non encore décaissé (jamais négatif). */
    private static BigDecimal horsBilan(BigDecimal monCredito, BigDecimal monDesembolsado) {
        BigDecimal hb = nvlZero(monCredito).subtract(nvlZero(monDesembolsado));
        return hb.signum() > 0 ? hb : BigDecimal.ZERO;
    }

    private List<CompteAssocieDto> toComptes(String idClt, String codAgce, List<RegCompteDto> comptes) {
        if (comptes == null) return List.of();
        // NumCpt : numéro SAF exposé tel quel (règle 10 positions en attente d'arbitrage BCRG)
        // CleRib : null (consigne PP V2 du 16/08, remplace ND)
        return comptes.stream().map(c -> new CompteAssocieDto(
                idClt, codAgce, c.getNumCuenta(), null,
                BcrgTranslator.TYPE_COMPTE_INDIVIDUEL,
                translator.translateStatutCompte(c.getIndEstado()))).toList();
    }

    private List<CompteAssocieMoraleDto> toComptesMorale(String idClt, String codAgce, List<RegCompteDto> comptes) {
        if (comptes == null) return List.of();
        return comptes.stream().map(c -> new CompteAssocieMoraleDto(
                idClt, codAgce, c.getNumCuenta(), null,
                translator.translateStatutCompte(c.getIndEstado()))).toList();
    }

    private List<PieceDto> toPieces(String idClt, List<RegPieceDto> pieces) {
        if (pieces == null) return List.of();
        return pieces.stream().map(p -> new PieceDto(
                idClt,
                translator.translateTypePiece(p.getCodTipoId(), p.getDesTipoId()),
                blankToNull(p.getNumId()),
                ND, ND, ND, // date / lieu / pays d'émission non portés par le SI
                translator.formatDate(p.getFecVencim()))).toList();
    }

    private static RegAdresseDto premiereAdresse(List<RegAdresseDto> adresses) {
        return (adresses == null || adresses.isEmpty()) ? null : adresses.get(0);
    }

    /** Numéro de la première pièce SAF correspondant au type recherché (PM V2). */
    private static String numeroPiece(List<RegPieceDto> pieces,
                                      java.util.function.BiPredicate<String, String> type) {
        if (pieces == null) return null;
        return pieces.stream()
                .filter(p -> type.test(p.getCodTipoId(), p.getDesTipoId()))
                .map(p -> blankToNull(p.getNumId()))
                .filter(java.util.Objects::nonNull)
                .findFirst().orElse(null);
    }

    private static String coalesceND(String valeur) {
        return valeur != null ? valeur : ND;
    }

    private static String blankToNull(String s) {
        return StringUtils.hasText(s) ? s.trim() : null;
    }

    private static String join(String a, String b) {
        String left = a != null ? a.trim() : "";
        String right = b != null ? b.trim() : "";
        String res = (left + " " + right).trim();
        return res.isEmpty() ? null : res;
    }

    /** Convertit une PageDto (contrat ebanking) en PageDto publique en mappant le contenu. */
    public <S, T> PageDto<T> toPage(io.digiservices.clients.agri.PageDto<S> src, Function<S, T> map) {
        if (src == null) return new PageDto<>(List.of(), 0, 0, 0, 0, false, false);
        List<T> content = src.getContent() == null ? List.of() : src.getContent().stream().map(map).toList();
        return new PageDto<>(content, src.getPage(), src.getSize(), src.getTotalElements(),
                src.getTotalPages(), src.isHasNext(), src.isHasPrevious());
    }
}
