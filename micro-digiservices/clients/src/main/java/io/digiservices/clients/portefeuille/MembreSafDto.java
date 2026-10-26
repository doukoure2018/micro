package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Un client SAF ({@code CL.CL_CLIENTES}), lu dans la base de PRODUCTION au moment ou un agent
 * saisit un numero de membre. La sauvegarde de la veille ne connait pas un client ouvert le
 * matin meme : la verification a la saisie ne peut donc lire que la production.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembreSafDto {
    private String codCliente;
    private String nomCliente;
    private String codAgencia;
    private String desAgencia;
    /** F personne physique, J personne morale, selon SAF. */
    private String indPersona;
    private String catCliente;
    private LocalDate fecIngreso;
    private String telPrincipal;
}
