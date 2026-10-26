package io.digiservices.ecreditservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * Resultat de la verification d'un numero de membre dans SAF production.
 * Quatre etats, et un seul bloque la saisie cote serveur : INCONNU (et FORME_INVALIDE).
 * SAF_INDISPONIBLE laisse passer, avec marquage, pour qu'une coupure n'arrete pas le credit.
 */
@Data
@Builder
public class VerificationMembreDto {
    public static final String TROUVE = "TROUVE";
    public static final String INCONNU = "INCONNU";
    public static final String FORME_INVALIDE = "FORME_INVALIDE";
    public static final String SAF_INDISPONIBLE = "SAF_INDISPONIBLE";

    private String numero;
    private String etat;
    private String message;
    private String nomClient;
    private String codAgencia;
    private String agence;
    private String typePersonne;
    private LocalDate dateAdhesion;
    private String telephone;

    public boolean bloquant() {
        return INCONNU.equals(etat) || FORME_INVALIDE.equals(etat);
    }

    public boolean trouve() {
        return TROUVE.equals(etat);
    }
}
