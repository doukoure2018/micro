package io.digiservices.clients.agri;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Compte SAF d'un membre : compte de credit (produit CC008, sur lequel le credit est
 * debourse) ou compte de remboursement (produit CC014, sur lequel les echeances sont
 * prelevees). Contrat interne ebanking -> agriculteurservice.
 *
 * <p>Le numero de compte se lit en trois blocs : [3 agence][3 produit][8 sequence],
 * par exemple 322-008-00202659. Le code produit stocke porte le meme triplet prefixe
 * du systeme, ce qui permet un controle de coherence entre les deux.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompteMembreDto {

    private String numeroCompte;
    /** CREDIT, REMBOURSEMENT ou AUTRE — deduit du code produit, jamais laisse a l'appelant. */
    private String type;
    private String produit;
    private String libelleProduit;
    private String codeAgence;
    private String libelleAgence;
    private String devise;
    /** Code SAF brut (A actif, I inactif, B bloque, C cloture). */
    private String statut;
    private String libelleStatut;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOuverture;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dernierMouvement;

    private BigDecimal soldeDisponible;
    private BigDecimal soldeReserve;
    private BigDecimal soldeBloque;

    /** TRUE si le triplet produit du numero de compte ne correspond pas au code produit stocke. */
    private Boolean incoherenceNumero;
}
