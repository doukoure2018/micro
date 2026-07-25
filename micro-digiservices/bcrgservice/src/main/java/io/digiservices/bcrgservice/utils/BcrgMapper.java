package io.digiservices.bcrgservice.utils;

import io.digiservices.bcrgservice.dto.AdresseDto;
import io.digiservices.bcrgservice.dto.CompteAssocieDto;
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

/**
 * Mapping des DTO bruts SAF (contrat ebanking) vers les DTO publics au format BCRG.
 */
@Component
@RequiredArgsConstructor
public class BcrgMapper {

    private final BcrgTranslator translator;

    public PersonnePhysiqueDto toPersonnePhysique(RegPersonnePhysiqueDto s) {
        if (s == null) return null;
        PersonnePhysiqueDto d = new PersonnePhysiqueDto();
        d.setIdInterneClt(s.getCodCliente());
        d.setNatClient(translator.translateNatClient(s.getIndRelacion()));
        d.setDatCreaPart(s.getFecIngreso());
        d.setNomNaiClt(join(s.getPrimerApellido(), s.getSegundoApellido()));
        d.setPrenomClt(join(s.getPrimerNombre(), s.getSegundoNombre()));
        d.setNomComp(s.getNomCliente());
        d.setSexe(translator.translateSexe(s.getIndSexo()));
        d.setEtatCivil(translator.translateEtatCivil(s.getEstCivil()));
        d.setVilleNai(s.getLugarNacimiento());
        d.setNatClt(s.getNacionalidad());
        d.setMobile(s.getTelPrincipal());
        d.setProfession(s.getDesProfesion());
        d.setSecActEcon(s.getCodActividad());
        d.setSecActEconLibelle(s.getDesActividad());
        d.setSectInst(BcrgTranslator.SECT_INST_PARTICULIERS);
        d.setStatutClt("0"); // Actif par defaut (SAF ne porte pas de statut deces ici)
        d.setCodAgce(s.getCodAgencia());
        d.setAgenceLibele(s.getDesAgencia());
        d.setComptesAssocies(toComptes(s.getCodCliente(), s.getCodAgencia(), s.getComptes()));
        d.setPieces(toPieces(s.getCodCliente(), s.getPieces()));
        d.setAdresses(toAdresses(s.getAdresses()));
        return d;
    }

    public PersonneMoraleDto toPersonneMorale(RegPersonneMoraleDto s) {
        if (s == null) return null;
        PersonneMoraleDto d = new PersonneMoraleDto();
        d.setIdInterneClt(s.getCodCliente());
        d.setNatClient(translator.translateNatClient(s.getIndRelacion()));
        d.setDenomSocial(StringUtils.hasText(s.getRazonSocial()) ? s.getRazonSocial() : s.getNomCliente());
        d.setSigle(s.getNomComercial());
        d.setFormeJuridique(translator.translateFormeJuridique(s.getClaseSociedad()));
        d.setDatCreaPart(s.getFecIngreso());
        d.setMobile(s.getTelPrincipal());
        d.setActEcon(s.getCodActividad());
        d.setActEconLibelle(s.getDesActividad());
        d.setCodAgce(s.getCodAgencia());
        d.setAgenceLibele(s.getDesAgencia());
        d.setComptesAssocies(toComptes(s.getCodCliente(), s.getCodAgencia(), s.getComptes()));
        d.setPieces(toPieces(s.getCodCliente(), s.getPieces()));
        d.setAdresses(toAdresses(s.getAdresses()));
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

    private List<AdresseDto> toAdresses(List<RegAdresseDto> adresses) {
        if (adresses == null) return null;
        return adresses.stream().map(a -> new AdresseDto(
                a.getTipDireccion(), a.getDetDireccion(), a.getCodPais(),
                a.getCodProvincia(), a.getCodCanton(), a.getCodDistrito())).toList();
    }

    private List<CompteAssocieDto> toComptes(String idClt, String codAgce, List<RegCompteDto> comptes) {
        if (comptes == null) return null;
        return comptes.stream().map(c -> new CompteAssocieDto(
                idClt, codAgce, c.getNumCuenta(), c.getCodProducto(), c.getIndEstado())).toList();
    }

    private List<PieceDto> toPieces(String idClt, List<RegPieceDto> pieces) {
        if (pieces == null) return null;
        return pieces.stream().map(p -> new PieceDto(
                idClt, translator.translateTypePiece(p.getCodTipoId()), p.getNumId(), p.getFecVencim())).toList();
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
