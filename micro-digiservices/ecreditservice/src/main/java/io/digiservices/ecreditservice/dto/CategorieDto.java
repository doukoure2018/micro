package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategorieDto {
    private Long id;
    private String code;
    private String libelle;
    private String type; // ENCAISSEMENT ou DECAISSEMENT
    private Integer ordreAffichage;
    private Boolean actif;
}