package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.dto.EcheancierDto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Échéancier prévisionnel avec moratoire (capital constant, intérêt simple mensuel sur capital restant). */
public interface EcheancierService {

    /** Simulation libre (aperçu en saisie). */
    EcheancierDto simuler(BigDecimal montant, BigDecimal tauxMensuel, Integer dureeMois,
                          Integer moratoireMois, Integer nombreEcheances, LocalDate dateOctroi);

    /** Échéancier d'une demande enregistrée, à partir de ses modalités sollicitées. */
    EcheancierDto pourDemande(Long demandeId);

    /** Même calcul, à partir d'un objet demande déjà chargé (ou en cours de saisie). */
    EcheancierDto pourDemande(DemandeIndividuel demande);

    /** Vrai si la demande relève de l'échéancier agricole (groupe CAS / CAS-R). */
    boolean estGroupeAgricole(DemandeIndividuel demande);
}
