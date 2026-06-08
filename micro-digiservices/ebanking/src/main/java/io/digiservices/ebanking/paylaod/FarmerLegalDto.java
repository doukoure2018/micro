package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Details specifiques a une personne morale (CL.CL_PERSONAS_JURIDICAS).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FarmerLegalDto {

    private String razonSocial;
    private String nomComercial;
    private String claseSociedad;
}
