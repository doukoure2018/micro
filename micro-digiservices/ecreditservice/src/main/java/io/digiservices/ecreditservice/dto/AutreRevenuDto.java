package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AutreRevenuDto {
    private Long autreRevenuId;
    private Long collecteId;

    private Boolean salaireExterneExiste;
    private BigDecimal salaireExterneMontant;

    private Boolean loyersPercusExiste;
    private BigDecimal loyersPercusMontant;

    private Boolean activiteSecondaireExiste;
    private BigDecimal activiteSecondaireMontant;

    private Boolean autresRevenusExiste;
    private BigDecimal autresRevenusMontant;
}
