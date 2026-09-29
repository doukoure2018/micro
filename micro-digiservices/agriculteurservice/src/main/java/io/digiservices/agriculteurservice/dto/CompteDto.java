package io.digiservices.agriculteurservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Compte d'un membre : compte de crédit, sur lequel le crédit a été déboursé, ou compte
 * de remboursement, sur lequel les échéances sont prélevées.
 *
 * <p>Le numéro se lit en trois blocs : trois chiffres d'agence, trois de produit, huit de
 * séquence. Exemple : 322-008-00202659 pour un compte de crédit de l'agence 322.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompteDto {

    private String numeroCompte;
    /** CREDIT ou REMBOURSEMENT. */
    private String type;
    private String produit;
    private String libelleProduit;
    private String codeAgence;
    private String libelleAgence;
    private String devise;
    private String statut;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOuverture;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dernierMouvement;

    private BigDecimal soldeDisponible;
    private BigDecimal soldeReserve;
    private BigDecimal soldeBloque;
}
