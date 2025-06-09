package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChargeInd {
    private Long chargesIndiId;
    private String referenceCredit;
    private String libele;
    private BigDecimal prixUnit;
    private Integer qte;
    private LocalDateTime createAt;
}
