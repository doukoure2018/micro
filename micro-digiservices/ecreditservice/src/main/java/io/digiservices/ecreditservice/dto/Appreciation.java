package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Appreciation {

    private Long appreciationId;
    private String motif;
    private BigDecimal montantSuggere;
    private BigDecimal montantDemande;
    private String referenceCredit;
    private OffsetDateTime createdAt;
    private String status;
    private Long userId;
}
