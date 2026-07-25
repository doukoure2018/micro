package io.digiservices.clients.reg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Piece d'identite d'un client (source SAF : CL.CL_ID_CLIENTES).
 * Contrat brut ebanking &lt;-&gt; bcrgservice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegPieceDto {
    private String codTipoId;
    private String numId;
    private LocalDate fecVencim;
}
