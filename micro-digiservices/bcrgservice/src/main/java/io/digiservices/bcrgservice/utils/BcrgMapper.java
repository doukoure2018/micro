package io.digiservices.bcrgservice.utils;

import io.digiservices.bcrgservice.dto.CompteAssocieDto;
import io.digiservices.bcrgservice.dto.CompteAssocieMoraleDto;
import io.digiservices.bcrgservice.dto.DonneeComplementaireDto;
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

        PersonnePhysiqueDto d = new PersonnePhysiqueDto();
        d.setIdInterneClt(s.getCodCliente());
        d.setNatDec(null); // géré par le middleware BCRG
        d.setNatClient(translator.translateNatClient(s.getIndRelacion()));
        d.setNin(ND); // NIN non porté par le SI
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
        d.setDatNai(ND); // date de naissance non portée par le SI
        d.setEtatCivil(etatCivil);
        d.setNomPere(ND);    // filiation non portée : ND exigé par la BCRG
        d.setPrenomPere(ND);
        d.setNomNaiMere(ND);
        d.setPrmMre(ND);
        d.setVilleNai(blankToNull(s.getLugarNacimiento()));
        d.setPaysNai(ND); // pays de naissance non porté
        d.setNatClt(blankToNull(s.getNacionalidad()));
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
        d.setPieces(toPieces(s.getCodCliente(), s.getPieces()));
        d.setDonneeComplementaire(new DonneeComplementaireDto(
                s.getNumHijos(), ND, ND, blankToNull(s.getTenenciaVivienda())));
        d.setTuteurCurateur(List.of());
        d.setEmployeurs(List.of());
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
        d.setVilleSiegeSocial(ND); // seuls des codes sans libellé sont portés par le SI
        d.setMobile(translator.normaliserMobile(s.getTelPrincipal()));
        d.setEmail(null);
        d.setSiteWeb(null);
        d.setAdress(adresse != null && StringUtils.hasText(adresse.getDetDireccion())
                ? adresse.getDetDireccion().trim() : ND);
        d.setCommuneAdresse(null);
        d.setCodePostal(adresse != null ? blankToNull(adresse.getCodPostal()) : null);
        d.setResident(BcrgTranslator.RESIDENT_OUI);
        d.setRccm(ND);        // non portés par le SI : ND en régime transitoire
        d.setNif(ND);
        d.setNifp(ND);
        d.setNumAgrement(ND);
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

    public EngagementDto toEngagement(RegEngagementDto s) {
        if (s == null) return null;
        EngagementDto d = new EngagementDto();
        d.setRefIntEng(s.getNumCredito() != null ? String.valueOf(s.getNumCredito()) : null);
        d.setBeneficiaireId(s.getCodCliente());
        d.setBeneficiaireNom(s.getNomCliente());
        d.setTypEng(s.getTipCredito() != null ? String.valueOf(s.getTipCredito()) : null);
        d.setMntEng(s.getMonCredito());
        d.setSolde(s.getMonSaldo());
        d.setCodDev(s.getCodMoneda());
        d.setTxIntEng(s.getTasaInteres());
        d.setMntEch(s.getMonCuota());
        d.setNbrEch(s.getCantCuotas());
        d.setDatAccord(s.getFecApertura());
        d.setDateMEP(s.getFecPrimerDesembolso());
        d.setDatFin(s.getFecVencimiento());
        d.setStatut(translator.translateStatutCredit(s.getIndEstado()));
        d.setCodAgce(s.getCodAgencia());
        d.setCodActivite(s.getCodActividad());
        return d;
    }

    public EncoursDto toEncours(RegEncoursDto s) {
        if (s == null) return null;
        EncoursDto d = new EncoursDto();
        d.setRefIntEng(s.getNumCredito() != null ? String.valueOf(s.getNumCredito()) : null);
        d.setBeneficiaireId(s.getCodCliente());
        d.setBeneficiaireNom(s.getNomCliente());
        d.setCodDev(s.getCodMoneda());
        d.setCodAgce(s.getCodAgencia());
        d.setMntEng(s.getMonCredito());
        d.setMntCRDU(s.getMonSaldo());
        d.setMntCapImp(s.getMntCapImpaye());
        d.setNbrEchPay(s.getNbEchPayees());
        d.setNbrEchImp(s.getNbEchImpayees());
        d.setNbrEchRest(s.getNbEchRestantes());
        d.setQualiCre(translator.translateStatutCredit(s.getIndEstado()));
        d.setDatFin(s.getFecVencimiento());
        // pd / lgd / ccf / ifrsStage : non disponibles dans SAF (laisses null)
        return d;
    }

    private List<CompteAssocieDto> toComptes(String idClt, String codAgce, List<RegCompteDto> comptes) {
        if (comptes == null) return List.of();
        // NumCpt : numéro SAF exposé tel quel (règle 10 positions en attente d'arbitrage BCRG)
        return comptes.stream().map(c -> new CompteAssocieDto(
                idClt, codAgce, c.getNumCuenta(), ND,
                BcrgTranslator.TYPE_COMPTE_INDIVIDUEL,
                translator.translateStatutCompte(c.getIndEstado()))).toList();
    }

    private List<CompteAssocieMoraleDto> toComptesMorale(String idClt, String codAgce, List<RegCompteDto> comptes) {
        if (comptes == null) return List.of();
        return comptes.stream().map(c -> new CompteAssocieMoraleDto(
                idClt, codAgce, c.getNumCuenta(), ND,
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
