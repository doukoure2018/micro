package io.digiservices.ecreditservice.validation;

import io.digiservices.ecreditservice.dto.CreateAnalyseRequest;
import io.digiservices.ecreditservice.dto.CreateBilanRequest;
import io.digiservices.ecreditservice.dto.CreateRentabiliteRequest;
import io.digiservices.ecreditservice.exception.ValidationException;

import java.util.Set;

public class AnalyseFinanciereValidator {

    private static final Set<String> VALID_CYCLES = Set.of(
            "Mensuelle", "Bimestrielle", "Trimestrielle",
            "Quadrimestrielle", "Semestrielle", "Annuelle", "Unique"
    );

    private static final Set<Integer> VALID_FACTEURS = Set.of(1, 2, 3, 4, 6, 12);

    private static final Set<String> VALID_HYPOTHESES_CA = Set.of(
            "Hyp. Faib.", "Hyp. Moy.", "Hyp. Elev."
    );

    private static final Set<String> VALID_TYPES_MARGE = Set.of(
            "% Recom.", "Fort %", "Faible %", "% Declar"
    );

    private static final Set<String> VALID_TYPES_CDR = Set.of(
            "Capacité de remb. calculée", "Capacité de remb. déclarée"
    );

    private static final Set<String> VALID_PERIODES_BILAN = Set.of("N", "N_MOINS_1");

    private static final Set<String> VALID_PERIODES_RENTABILITE = Set.of("N", "N_MOINS_1", "N_PLUS_1");

    private static final Set<String> VALID_PERIODICITES = Set.of(
            "Mensuelle", "Bimestrielle", "Trimestrielle",
            "Quadrimestrielle", "Semestrielle", "Annuelle"
    );

    public static void validateCreateAnalyseRequest(CreateAnalyseRequest request) {
        if (request.getDemandeindividuelId() == null) {
            throw new ValidationException("L'ID de la demande est obligatoire");
        }

        if (request.getCycleAffaires() != null && !VALID_CYCLES.contains(request.getCycleAffaires())) {
            throw new ValidationException(
                    "Cycle d'affaires invalide: '" + request.getCycleAffaires() + "'. " +
                            "Valeurs autorisees: " + String.join(", ", VALID_CYCLES)
            );
        }

        if (request.getFacteurCycle() != null && !VALID_FACTEURS.contains(request.getFacteurCycle())) {
            throw new ValidationException(
                    "Facteur de cycle invalide: " + request.getFacteurCycle() + ". " +
                            "Valeurs autorisees: 1, 2, 3, 4, 6, 12"
            );
        }

        if (request.getHypotheseCa() != null && !VALID_HYPOTHESES_CA.contains(request.getHypotheseCa())) {
            throw new ValidationException(
                    "Hypothese CA invalide: '" + request.getHypotheseCa() + "'. " +
                            "Valeurs autorisees: " + String.join(", ", VALID_HYPOTHESES_CA)
            );
        }

        if (request.getTypeMarge() != null && !VALID_TYPES_MARGE.contains(request.getTypeMarge())) {
            throw new ValidationException(
                    "Type de marge invalide: '" + request.getTypeMarge() + "'. " +
                            "Valeurs autorisees: " + String.join(", ", VALID_TYPES_MARGE)
            );
        }

        if (request.getTypeCdr() != null && !VALID_TYPES_CDR.contains(request.getTypeCdr())) {
            throw new ValidationException(
                    "Type CDR invalide: '" + request.getTypeCdr() + "'. " +
                            "Valeurs autorisees: " + String.join(", ", VALID_TYPES_CDR)
            );
        }
    }

    public static void validateCreateBilanRequest(CreateBilanRequest request) {
        if (request.getAnalyseId() == null) {
            throw new ValidationException("L'ID de l'analyse est obligatoire");
        }

        if (request.getTypePeriode() == null || request.getTypePeriode().isBlank()) {
            throw new ValidationException("Le type de periode est obligatoire");
        }

        if (!VALID_PERIODES_BILAN.contains(request.getTypePeriode())) {
            throw new ValidationException(
                    "Type de periode invalide: '" + request.getTypePeriode() + "'. " +
                            "Valeurs autorisees: N, N_MOINS_1"
            );
        }
    }

    public static void validateCreateRentabiliteRequest(CreateRentabiliteRequest request) {
        if (request.getAnalyseId() == null) {
            throw new ValidationException("L'ID de l'analyse est obligatoire");
        }

        if (request.getTypePeriode() == null || request.getTypePeriode().isBlank()) {
            throw new ValidationException("Le type de periode est obligatoire");
        }

        if (!VALID_PERIODES_RENTABILITE.contains(request.getTypePeriode())) {
            throw new ValidationException(
                    "Type de periode invalide: '" + request.getTypePeriode() + "'. " +
                            "Valeurs autorisees: N, N_MOINS_1, N_PLUS_1"
            );
        }
    }

    public static void validatePeriodicite(String periodicite) {
        if (periodicite != null && !periodicite.isBlank() && !VALID_PERIODICITES.contains(periodicite)) {
            throw new ValidationException(
                    "Periodicite invalide: '" + periodicite + "'. " +
                            "Valeurs autorisees: " + String.join(", ", VALID_PERIODICITES)
            );
        }
    }
}
