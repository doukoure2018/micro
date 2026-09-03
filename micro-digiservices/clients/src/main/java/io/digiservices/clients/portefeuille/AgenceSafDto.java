package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Agence SAF (CF.CF_AGENCIAS) pour la selection du perimetre du portefeuille. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgenceSafDto {
    private String codAgencia;
    private String desAgencia;
}
