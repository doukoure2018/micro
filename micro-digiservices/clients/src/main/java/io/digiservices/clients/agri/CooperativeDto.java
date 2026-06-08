package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Cooperative / groupement (CL.CL_GRUPOS_ECONOMICOS) avec agregats.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CooperativeDto {

    private String codGrupo;
    private String desGrupo;
    private String actividadGrupo;
    private long memberCount;
    private long creditCount;
    private BigDecimal totalAmount;
}
