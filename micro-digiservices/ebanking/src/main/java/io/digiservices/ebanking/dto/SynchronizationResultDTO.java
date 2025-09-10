package io.digiservices.ebanking.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SynchronizationResultDTO {
    private int successCount;
    private int errorCount;
    private List<String> errors;
    private String statut;
    private LocalDateTime timestamp;
}