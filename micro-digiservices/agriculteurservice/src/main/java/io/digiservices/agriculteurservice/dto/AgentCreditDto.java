package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agent de credit d'un point de vente (point 8 du tableau de bord DE). {@code codeAgence} est
 * le code SAF, celui que porte la ligne de portefeuille.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentCreditDto {
    private Long id;
    /** Identifiant de connexion en majuscules : meme convention que le code gestionnaire SAF,
     *  sans garantie d'egalite (MLSIDIBE dans digi, MLSIDIBE323 dans SAF). */
    private String identifiant;
    /** Matricule RH, souvent null a ce jour. */
    private String matricule;
    /** Nom complet, nom de famille d'abord. */
    private String nom;
    private String codeAgence;
    private String libelleAgence;
    private boolean actif;
    private long creditsAffectes;
}
