package io.digiservices.bcrgservice.utils;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Traduction des codes SAF2000 vers les nomenclatures attendues par la BCRG.
 *
 * <p>Regles a affiner avec le metier / les referentiels BCRG. Un code inconnu est
 * retourne tel quel (pas de perte d'information).</p>
 */
@Component
public class BcrgTranslator {

    /** Secteur institutionnel par defaut d'une personne physique : '032' (Particuliers). */
    public static final String SECT_INST_PARTICULIERS = "032";

    /** IND_SEXO SAF -> Sexe BCRG (M/F). */
    public String translateSexe(String indSexo) {
        if (!StringUtils.hasText(indSexo)) return null;
        return switch (indSexo.trim().toUpperCase()) {
            case "M", "1" -> "M";
            case "F", "2" -> "F";
            default -> indSexo.trim();
        };
    }

    /** EST_CIVIL SAF -> Etat civil BCRG (1=Celibataire,2=Marie,3=Divorce,4=Veuf). */
    public String translateEtatCivil(String estCivil) {
        if (!StringUtils.hasText(estCivil)) return null;
        return switch (estCivil.trim().toUpperCase()) {
            case "S", "1" -> "1"; // Celibataire
            case "C", "M", "2" -> "2"; // Marie(e)
            case "D", "3" -> "3"; // Divorce(e)
            case "V", "4" -> "4"; // Veuf(ve)
            default -> estCivil.trim();
        };
    }

    /** IND_RELACION SAF -> NatClient BCRG (0=client du participant, 1=tiers). */
    public String translateNatClient(String indRelacion) {
        if (!StringUtils.hasText(indRelacion)) return "0";
        return switch (indRelacion.trim()) {
            case "1", "S", "C" -> "0"; // relation etablie => client
            case "0", "N" -> "1";      // pas de relation => tiers
            default -> indRelacion.trim();
        };
    }

    /** CLASE_SOCIEDAD SAF -> Forme juridique BCRG (passthrough en attendant le referentiel). */
    public String translateFormeJuridique(String claseSociedad) {
        return StringUtils.hasText(claseSociedad) ? claseSociedad.trim() : null;
    }

    /** COD_TIPO_ID SAF -> TypPiece BCRG (01=CIN, 03=Passeport... a affiner). */
    public String translateTypePiece(String codTipoId) {
        if (!StringUtils.hasText(codTipoId)) return null;
        return codTipoId.trim();
    }

    /** IND_ESTADO SAF -> libelle de statut de credit (aligne sur SafTranslator agri). */
    public String translateStatutCredit(String indEstado) {
        if (!StringUtils.hasText(indEstado)) return null;
        return switch (indEstado.trim().toUpperCase()) {
            case "A" -> "Actif";
            case "D" -> "Decaisse";
            case "C" -> "Cloture";
            case "T" -> "Termine";
            case "V" -> "Echu";
            case "J" -> "Judiciaire";
            case "X" -> "Annule";
            default -> indEstado.trim();
        };
    }
}
