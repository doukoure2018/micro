package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Agriculteur (client ayant au moins un credit agricole).
 * Agrege CL.CL_CLIENTES + details physique/morale + activite/secteur + agence
 * + agregats credits (nombre, montant total).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmerDto {

    private String codEmpresa;
    private String codCliente;
    private String nomCliente;

    /** Code brut IND_PERSONA (ex: F / J). */
    private String indPersona;
    /** Type traduit : PHYSICAL / LEGAL (rempli par le service). */
    private String personType;

    private String telPrincipal;
    private LocalDate fecIngreso;

    private String codAgencia;
    private String desAgencia;

    private String desActividad;
    private String desSector;

    private long nbCredits;
    private BigDecimal totalAmount;

    /** Renseigne uniquement pour une personne physique (sinon null). */
    private FarmerPhysicalDto physicalDetails;
    /** Renseigne uniquement pour une personne morale (sinon null). */
    private FarmerLegalDto legalDetails;
}
