package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Filière agricole d'un crédit : la sous-sous-activité de SAF (point 11). Le référentiel complet
 * est servi par {@code GET /agriculteurs/referentiels/activites}.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FiliereDto {
    /** Code SAF de la sous-sous-activité, par exemple 313. */
    private String code;
    /** Libellé, par exemple « CÉRÉALE RIZ ». */
    private String libelle;
}
