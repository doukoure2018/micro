package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Agriculteur (client ayant au moins un credit agricole).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmerDto {

    private String codEmpresa;
    private String codCliente;
    private String nomCliente;

    private String indPersona;
    private String personType;

    private String telPrincipal;
    private LocalDate fecIngreso;

    private String codAgencia;
    private String desAgencia;

    private String desActividad;
    private String desSector;

    private long nbCredits;
    private BigDecimal totalAmount;

    private FarmerPhysicalDto physicalDetails;
    private FarmerLegalDto legalDetails;

    /**
     * Les pieces d'identite du client ({@code CL.CL_ID_CLIENTES}), valables d'abord.
     * Vide quand SAF n'en porte aucune — ce qui est en soi une information.
     */
    private java.util.List<PieceIdentiteDto> piecesIdentite;
}
