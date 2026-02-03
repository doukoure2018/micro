package io.digiservices.ecreditservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NormesRatiosDto {
    private String code;
    private String libele;
    private String operateur;
    private Double valeur;
    private String affichage;
}
