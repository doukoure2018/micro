package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Adresse declaree d'un membre (CL.CL_DIR_CLIENTES). */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdresseMembreDto {

    /** Code SAF du type d'adresse (domicile, travail...). */
    private String type;
    private String detail;
    private String province;
    private String prefecture;
    private String district;
}
