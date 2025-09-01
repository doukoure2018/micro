package io.digiservices.ecreditservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StockUpdateResponse {
    private Long idCmd;
    private String status;
    private String stateValidation;
    private String message;
    private LocalDateTime dateTraitement;
    private String traitePar;
}