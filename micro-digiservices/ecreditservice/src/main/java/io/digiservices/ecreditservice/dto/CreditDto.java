package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreditDto {
    private Long creditId;
    private String referenceCredit;
    private String typeCredit;
    private String status;
    private LocalDateTime createAt;
    private String codeMembre;
    private Long delegationId;
    private Long agenceId;
    private Long pointventeId;
    private Long individuelId;
    private Long userId;
    private BigDecimal montantCredit;
}