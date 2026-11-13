package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Desinscription SMS (lot 1) : etat d'un numero, historique de ses gestes, et le chargement
 * d'un repertoire — l'historique qui etait ecrit depuis aout sans jamais etre affiche.
 */
public final class SmsOptoutDtos {

    public static final String ORIGINE_STOP_HUB = "STOP_HUB";
    public static final String ORIGINE_GUICHET = "GUICHET";
    public static final String ORIGINE_ECHEC_PERMANENT = "ECHEC_PERMANENT";
    public static final String ORIGINE_IMPORT = "IMPORT";

    public static final String ACTION_EXCLUSION = "EXCLUSION";
    public static final String ACTION_LEVEE = "LEVEE";

    private SmsOptoutDtos() {
    }

    /** Etat courant d'un numero sur la liste de desinscription. */
    public record SmsOptoutDto(String telephone,
                               boolean actif,
                               String origine,
                               String motif,
                               String excluPar,
                               @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
                               LocalDateTime dateExclusion,
                               String levePar,
                               @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
                               LocalDateTime dateLevee,
                               String motifLevee) {
    }

    /** Une pose ou une levee, telle qu'elle s'est produite. */
    public record SmsOptoutJournalDto(String telephone,
                                      String action,
                                      String origine,
                                      String motif,
                                      String parUser,
                                      @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
                                      LocalDateTime dateAction) {
    }

    /** Ce que l'ecran de recherche affiche pour un numero : son etat et son histoire. */
    public record SmsOptoutRechercheDto(String telephone,
                                        boolean exclu,
                                        SmsOptoutDto etat,
                                        List<SmsOptoutJournalDto> journal,
                                        List<String> repertoires) {
    }

    /** Un chargement de repertoire, tel qu'il a ete journalise. */
    public record SmsChargementDto(int nbImportes,
                                   int nbDoublons,
                                   int nbInvalides,
                                   String chargePar,
                                   @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
                                   LocalDateTime dateChargement) {
    }

    /** Une page de numeros d'un repertoire, avec le total pour pouvoir paginer. */
    public record SmsNumerosPageDto(List<String> numeros,
                                    int total,
                                    int page,
                                    int size,
                                    Map<String, Integer> parOperateur) {
    }

    /** Demande d'exclusion ou de levee. */
    public record SmsOptoutRequest(String telephone, String origine, String motif) {
    }
}
