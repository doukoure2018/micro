package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductInd {
    private Long produitIndId;
    private String referenceCredit;
    private String libele;
    @JsonProperty("prix_unit")
    private BigDecimal prixUnit;
    private Integer qte;
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    private String  observation;
}
