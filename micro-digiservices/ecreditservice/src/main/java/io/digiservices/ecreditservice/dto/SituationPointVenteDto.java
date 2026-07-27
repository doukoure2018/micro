package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Situation de conformité d'un point de vente vis-à-vis de la remontée
 * des arrêtés de caisse (dernier arrêté connu + état calculé).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SituationPointVenteDto {

    private Long pointventeId;
    private String pointventeNom;
    private String pointventeCode;
    private Long agenceId;
    private String agenceNom;
    private Long delegationId;
    private String delegationNom;

    // Dernier arrêté connu (null si jamais remonté)
    private Long arreteId;
    private BigDecimal montant;
    private String statut;
    private LocalDate dateArreteCaisse;
    private LocalDateTime dateRemonte;
    private String document;
    private String nomUser;
    private String prenomUser;

    // A_JOUR | A_VALIDER | EN_RETARD | JAMAIS_REMONTE
    private String etat;
    // Jours de retard au-delà de la tolérance (null si jamais remonté)
    private Integer joursRetard;
}
