package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseRatiosDto {
    private Long ratioId;
    private Long analyseId;

    // Ratios on solicited amount
    private BigDecimal r1Sollicite;
    private BigDecimal r2Sollicite;
    private BigDecimal r3Sollicite;
    private BigDecimal r4Sollicite;
    private BigDecimal r5Sollicite;
    private BigDecimal r6Sollicite;

    // Ratios on proposed amount
    private BigDecimal r1Propose;
    private BigDecimal r2Propose;
    private BigDecimal r3Propose;
    private BigDecimal r4Propose;
    private BigDecimal r5Propose;
    private BigDecimal r6Propose;

    // Conformity flags
    private Boolean tousRatiosConformesSollicite;
    private Boolean tousRatiosConformesPropose;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateCalcul;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
