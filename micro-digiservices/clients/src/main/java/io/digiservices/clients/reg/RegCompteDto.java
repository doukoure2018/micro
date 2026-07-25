package io.digiservices.clients.reg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Compte d'epargne du client au CRG (source SAF : CC.CC_CUENTA_EFECTIVO).
 * Contrat brut ebanking &lt;-&gt; bcrgservice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegCompteDto {
    private String numCuenta;    // NUM_CUENTA
    private String codMoneda;    // COD_MONEDA
    private String codProducto;  // COD_PRODUCTO (type de produit)
    private String indEstado;    // IND_ESTADO (statut du compte)
}
