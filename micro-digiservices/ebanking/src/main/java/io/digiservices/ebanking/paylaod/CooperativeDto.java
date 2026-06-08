package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Cooperative / groupement (CL.CL_GRUPOS_ECONOMICOS) avec agregats
 * (nombre de membres, nombre de credits agricoles, montant total).
 *
 * <p>A ne pas confondre avec CL_VINCULACIONES (liens individuels client-client).</p>
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
