package io.digiservices.clients.reg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Adresse d'un client (source SAF : CL.CL_DIR_CLIENTES).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegAdresseDto {
    private String tipDireccion;
    private String detDireccion;
    private String codPais;
    private String codProvincia;
    private String codCanton;
    private String codDistrito;
}
