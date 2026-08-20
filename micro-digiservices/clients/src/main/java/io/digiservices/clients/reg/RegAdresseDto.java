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
    private String codPostal;   // COD_POSTAL
    private String apdoPostal;  // APDO_POSTAL (boite postale)
    // PM V2 : libellés des référentiels géographiques PA.PA_* (ville du siège social)
    private String desProvincia; // PA_PROVINCIAS.DES_PROVINCIA (préfecture, ex. CONAKRY)
    private String desCanton;    // PA_CANTONES.DES_CANTON
    private String desDistrito;  // PA_DISTRITOS.DES_DISTRITO
}
