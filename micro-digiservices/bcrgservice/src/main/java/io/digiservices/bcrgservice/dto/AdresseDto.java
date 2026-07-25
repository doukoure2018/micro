package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Adresse (balise Adresses du modele BCRG).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdresseDto {
    private String typAdr;    // TIP_DIRECCION
    private String adresse;   // DET_DIRECCION
    private String pays;      // COD_PAIS
    private String region;    // COD_PROVINCIA
    private String ville;     // COD_CANTON
    private String codPost;   // COD_DISTRITO
}
