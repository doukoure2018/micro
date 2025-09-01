package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportResultDto {
    private Boolean success;
    private Integer totalLignes;
    private Integer lignesImportees;
    private Integer lignesEnErreur;
    private List<String> erreurs;
    private List<ValidationErrorDto> erreursValidation;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidationErrorDto {
        private Integer ligne;
        private String champ;
        private String valeur;
        private String message;
    }
}