package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agence SAF (CF.CF_AGENCIAS) - donnee de reference.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgriAgencyDto {

    private String codEmpresa;
    private String codAgencia;
    private String desAgencia;
}
