package io.digiservices.ebanking.dto;

import lombok.Data;

@Data
public class ValidationResponse {
    private boolean canStart;
    private String codeAgence;
    private Long serialCaisse;
    private String message;
    private ReconciliationResultDTO details;
}