package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConditionCreditDto {
    private Long conditionCreditId;
    private Long collecteId;
    private BigDecimal capaciteRemboursementDeclaree;
}
