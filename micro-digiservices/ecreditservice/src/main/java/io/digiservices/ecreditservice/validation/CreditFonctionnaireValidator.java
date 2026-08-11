package io.digiservices.ecreditservice.validation;

import io.digiservices.ecreditservice.dto.DemandeFonctionnaire;
import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.exception.ValidationException;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Règles métier du crédit fonctionnaire (décisions du 2026-08-10) :
 * - quotité cessible = salaire net x 35 % (taux fixe) : l'échéance ne doit jamais la dépasser
 * - capacité résiduelle = (salaire net x 65 %) + autres revenus - total charges, doit rester >= 0
 * - périodicité de remboursement : mensuelle uniquement
 * - domiciliation du salaire au CRG obligatoire
 */
public final class CreditFonctionnaireValidator {

    public static final String NATURE_FONCTIONNAIRE = "Demande de credit Pour Fonctionnaire";
    public static final BigDecimal TAUX_QUOTITE = new BigDecimal("0.35");
    public static final String PERIODICITE_MENSUELLE = "Mensuelle";

    private CreditFonctionnaireValidator() {
    }

    public static boolean isFonctionnaire(DemandeIndividuel demande) {
        return NATURE_FONCTIONNAIRE.equals(demande.getNatureClient());
    }

    /** Quotité cessible = salaire net x 35 %, plafond de l'échéance mensuelle. */
    public static BigDecimal quotiteCessible(BigDecimal salaireNetMensuel) {
        return salaireNetMensuel.multiply(TAUX_QUOTITE).setScale(2, RoundingMode.HALF_UP);
    }

    /** Capacité résiduelle = (salaire x 65 %) + autres revenus - total charges. */
    public static BigDecimal capaciteResiduelle(BigDecimal salaireNetMensuel,
                                                BigDecimal autresRevenus,
                                                BigDecimal totalCharges) {
        BigDecimal resteAVivre = salaireNetMensuel.subtract(quotiteCessible(salaireNetMensuel));
        return resteAVivre
                .add(autresRevenus == null ? BigDecimal.ZERO : autresRevenus)
                .subtract(totalCharges == null ? BigDecimal.ZERO : totalCharges);
    }

    /**
     * Validation bloquante à la saisie (accueil) et à la resoumission après correction.
     * Les charges ne sont pas encore connues à ce stade : la capacité résiduelle
     * est contrôlée à l'analyse par l'agent de crédit.
     */
    public static void validateDemande(DemandeIndividuel demande) {
        if (!isFonctionnaire(demande)) {
            return;
        }

        DemandeFonctionnaire ext = demande.getDemandeFonctionnaire();
        if (ext == null) {
            throw new ValidationException(
                    "Les informations fonctionnaire (service, salaire, contrat...) sont obligatoires pour cette nature de demande");
        }
        if (isBlank(ext.getServiceEmployeur())) {
            throw new ValidationException("Le service employeur est obligatoire pour un crédit fonctionnaire");
        }
        if (isBlank(ext.getDepartementMinistere())) {
            throw new ValidationException("Le département/ministère est obligatoire pour un crédit fonctionnaire");
        }
        if (isBlank(ext.getTypeContrat())) {
            throw new ValidationException("Le type de contrat est obligatoire pour un crédit fonctionnaire");
        }
        if (ext.getSalaireNetMensuel() == null || ext.getSalaireNetMensuel().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Le salaire net mensuel doit être supérieur à 0");
        }
        if (ext.getAutresRevenus() != null && ext.getAutresRevenus().compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("Les autres revenus ne peuvent pas être négatifs");
        }
        if (!Boolean.TRUE.equals(ext.getDomiciliationSalaire())) {
            throw new ValidationException(
                    "La domiciliation du salaire au CRG est obligatoire pour un crédit fonctionnaire");
        }
        if (!PERIODICITE_MENSUELLE.equalsIgnoreCase(demande.getPeriodiciteRemboursement())) {
            throw new ValidationException(
                    "La périodicité de remboursement d'un crédit fonctionnaire est obligatoirement mensuelle");
        }
        if (demande.getEcheance() == null || demande.getEcheance().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("L'échéance mensuelle est obligatoire pour un crédit fonctionnaire");
        }

        BigDecimal quotite = quotiteCessible(ext.getSalaireNetMensuel());
        if (demande.getEcheance().compareTo(quotite) > 0) {
            throw new ValidationException(String.format(
                    "L'échéance (%s GNF) dépasse la quotité cessible : 35 %% du salaire net = %s GNF",
                    demande.getEcheance().toPlainString(), quotite.toPlainString()));
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
