package io.digiservices.ecreditservice.validation;

import io.digiservices.ecreditservice.dto.DemandeGroupe;
import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.dto.MembreGroupe;
import io.digiservices.ecreditservice.exception.ValidationException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * Règles métier du crédit groupe solidaire (proposition validée le 2026-08-27) :
 * - type de groupe parmi CAS, CAS_R, CCS, CRS, CFE, MCK, ACM
 * - mandataire 1 + contact obligatoires
 * - la somme des montants à percevoir des membres = montant demandé du groupe
 * - le nombre de lignes membres = nombre de membres déclaré
 * - champs PE réservés au type CFE
 */
public final class CreditGroupeValidator {

    public static final String NATURE_GROUPE = "Demande de credit Pour Groupe Solidaire";
    public static final Set<String> TYPES_GROUPE = Set.of("CAS", "CAS_R", "CCS", "CRS", "CFE", "MCK", "ACM");

    private CreditGroupeValidator() {
    }

    public static boolean isGroupe(DemandeIndividuel demande) {
        return NATURE_GROUPE.equals(demande.getNatureClient());
    }

    /** Validation bloquante à la saisie d'une demande groupe (et à sa correction). No-op pour les autres natures. */
    public static void validateDemande(DemandeIndividuel demande) {
        if (!isGroupe(demande)) {
            return;
        }
        DemandeGroupe groupe = demande.getDemandeGroupe();
        if (groupe == null) {
            throw new ValidationException("Les informations du groupe sont obligatoires pour une demande groupe solidaire");
        }
        if (groupe.getTypeGroupe() == null || !TYPES_GROUPE.contains(groupe.getTypeGroupe())) {
            throw new ValidationException("Type de groupe invalide : " + groupe.getTypeGroupe()
                    + " (attendu : " + String.join(", ", TYPES_GROUPE) + ")");
        }
        if (isBlank(groupe.getNomGroupe())) {
            throw new ValidationException("Le nom du groupe est obligatoire");
        }
        if (isBlank(groupe.getMandataire1()) || isBlank(groupe.getContactMandataire1())) {
            throw new ValidationException("Le mandataire 1 et son contact sont obligatoires");
        }

        List<MembreGroupe> membres = demande.getMembresGroupe();
        if (membres == null || membres.isEmpty()) {
            throw new ValidationException("Au moins un membre est requis pour une demande groupe");
        }
        if (groupe.getNombreMembres() == null || groupe.getNombreMembres() != membres.size()) {
            throw new ValidationException("Le nombre de membres déclaré (" + groupe.getNombreMembres()
                    + ") ne correspond pas au tableau des membres (" + membres.size() + " ligne(s))");
        }

        BigDecimal totalParts = BigDecimal.ZERO;
        for (MembreGroupe membre : membres) {
            if (isBlank(membre.getNumeroMembre()) || isBlank(membre.getNomPrenom())) {
                throw new ValidationException("Chaque membre doit avoir un numéro de membre et un nom");
            }
            if (membre.getMontantPercevoir() == null || membre.getMontantPercevoir().signum() <= 0) {
                throw new ValidationException("Le montant à percevoir du membre " + membre.getNumeroMembre()
                        + " doit être supérieur à zéro");
            }
            totalParts = totalParts.add(membre.getMontantPercevoir());
        }

        BigDecimal montantDemande = demande.getMontantDemande();
        if (montantDemande == null || totalParts.compareTo(montantDemande) != 0) {
            throw new ValidationException("La somme des montants à percevoir des membres ("
                    + totalParts.toPlainString() + " GNF) doit être égale au montant demandé ("
                    + (montantDemande == null ? "?" : montantDemande.toPlainString()) + " GNF)");
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
