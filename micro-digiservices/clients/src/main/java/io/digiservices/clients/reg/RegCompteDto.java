package io.digiservices.clients.reg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Compte associe a un client (source SAF : CL.CL_CTAS_CLIENTE).
 * Contrat brut ebanking &lt;-&gt; bcrgservice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegCompteDto {
    private String codAgencia;
    private String numCuenta;
    private String codMoneda;
    private String indDefecto;
}
