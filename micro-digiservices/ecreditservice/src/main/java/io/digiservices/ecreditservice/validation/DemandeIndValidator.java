package io.digiservices.ecreditservice.validation;


import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.dto.GarantiePropose;
import io.digiservices.ecreditservice.exception.ValidationException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * Classe utilitaire pour la validation des demandes individuelles
 */
public class DemandeIndValidator {

    /**
     * Valeurs autorisées pour la nature du client
     */
    private static final Set<String> VALID_NATURE_CLIENT = Set.of(
            "Demande de credit Pour Professionnels",
            "Demande de Credit Pour PME/PMI",
            "Demande credit Pour Particulier"
    );

    /**
     * Valeurs autorisées pour les types de garantie
     */
    private static final Set<String> VALID_TYPE_GARANTIE = Set.of(
            "Caution Solidaire",
            "Garantie Financiere",
            "Garantie Materielle",
            "Autre Garantie"
    );

    /**
     * Valide la nature du client
     * @param demande La demande à valider
     * @throws ValidationException Si la nature du client n'est pas valide
     */
    public static void validateNatureClient(DemandeIndividuel demande) {
        String natureClient = demande.getNatureClient();

        if (natureClient == null || natureClient.isBlank()) {
            // Valeur par défaut si non spécifiée
            demande.setNatureClient("Demande credit Pour Particulier");
            return;
        }

        if (!VALID_NATURE_CLIENT.contains(natureClient)) {
            throw new ValidationException(
                    "Nature de client invalide: '" + natureClient + "'. " +
                            "Valeurs autorisées: " + String.join(", ", VALID_NATURE_CLIENT)
            );
        }

        // Validation spécifique pour PME/PMI - le nom de la personne morale est obligatoire
        if ("Demande de Credit Pour PME/PMI".equals(natureClient)) {
            if (demande.getNomPersonneMorale() == null || demande.getNomPersonneMorale().isBlank()) {
                throw new ValidationException(
                        "Le nom de l'entreprise est obligatoire pour une demande PME/PMI"
                );
            }
        }
    }

    /**
     * Valide les garanties proposées
     * @param garanties Liste des garanties à valider
     * @throws ValidationException Si une garantie a un type invalide
     */
    public static void validateGaranties(List<GarantiePropose> garanties) {
        if (garanties == null || garanties.isEmpty()) {
            throw new ValidationException("Au moins une garantie est obligatoire");
        }

        for (int i = 0; i < garanties.size(); i++) {
            GarantiePropose garantie = garanties.get(i);

            if (garantie.getTypeGarantie() == null || garantie.getTypeGarantie().isBlank()) {
                throw new ValidationException(
                        "Le type de garantie est obligatoire pour la garantie #" + (i + 1)
                );
            }

            if (!VALID_TYPE_GARANTIE.contains(garantie.getTypeGarantie())) {
                throw new ValidationException(
                        "Type de garantie invalide pour la garantie #" + (i + 1) + ": '" +
                                garantie.getTypeGarantie() + "'. " +
                                "Valeurs autorisées: " + String.join(", ", VALID_TYPE_GARANTIE)
                );
            }

            if (garantie.getDescriptionGarantie() == null || garantie.getDescriptionGarantie().isBlank()) {
                throw new ValidationException(
                        "La description est obligatoire pour la garantie #" + (i + 1)
                );
            }

            if (garantie.getValeurGarantie() == null ||
                    garantie.getValeurGarantie().compareTo(BigDecimal.ZERO) <= 0) {
                throw new ValidationException(
                        "La valeur de la garantie #" + (i + 1) + " doit être supérieure à 0"
                );
            }
        }
    }

    /**
     * Valide les nouveaux champs ajoutés
     * @param demande La demande à valider
     * @throws ValidationException Si un champ obligatoire est manquant
     */
    public static void validateNewFields(DemandeIndividuel demande) {
        // La préfecture et sous-préfecture sont optionnelles mais si fournies,
        // elles doivent avoir une longueur raisonnable
        if (demande.getPrefecture() != null && demande.getPrefecture().length() > 255) {
            throw new ValidationException("La préfecture ne doit pas dépasser 255 caractères");
        }

        if (demande.getSousPrefecture() != null && demande.getSousPrefecture().length() > 255) {
            throw new ValidationException("La sous-préfecture ne doit pas dépasser 255 caractères");
        }

        // Validation du surnom (sernom) si fourni
        if (demande.getSernom() != null && demande.getSernom().length() > 255) {
            throw new ValidationException("Le surnom ne doit pas dépasser 255 caractères");
        }

        // Validation de la catégorie si fournie
        if (demande.getCategorie() != null && demande.getCategorie().length() > 100) {
            throw new ValidationException("La catégorie ne doit pas dépasser 100 caractères");
        }

        // Validation des noms de famille
        if (demande.getNomPere() != null && demande.getNomPere().length() > 255) {
            throw new ValidationException("Le nom du père ne doit pas dépasser 255 caractères");
        }

        if (demande.getNomMere() != null && demande.getNomMere().length() > 255) {
            throw new ValidationException("Le nom de la mère ne doit pas dépasser 255 caractères");
        }

        if (demande.getNomConjoint() != null && demande.getNomConjoint().length() > 255) {
            throw new ValidationException("Le nom du conjoint ne doit pas dépasser 255 caractères");
        }

        // Validation de la nature d'activité si fournie
        if (demande.getNatureActivite() != null && demande.getNatureActivite().length() > 255) {
            throw new ValidationException("La nature de l'activité ne doit pas dépasser 255 caractères");
        }
    }

    /**
     * Valide complètement une demande individuelle
     * @param demande La demande à valider
     * @throws ValidationException Si la validation échoue
     */
    public static void validateAll(DemandeIndividuel demande) {
        validateNatureClient(demande);
        validateGaranties(demande.getGaranties());
        validateNewFields(demande);
    }
}