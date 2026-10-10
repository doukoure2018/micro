package io.digiservices.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Les derniers mouvements d'un compte, Production et Middleware cote a cote,
 * pour la ligne depliable du tableau de rapprochement de la fiche signaletique.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DernieresTransactionsCompteDTO {

    private String codCliente;
    private String numCuenta;
    private int limite;

    private List<TransactionCompteDTO> production;
    private List<TransactionCompteDTO> middleware;

    /** false quand la base middleware n'a pas repondu : l'ecran affiche N/A, pas une erreur. */
    private boolean middlewareDisponible;

    private LocalDateTime genereLe;
}
