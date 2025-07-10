package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Personnecaution {
    private Long personnecautionId;
    private Long entrepriseId;
    private String nom;
    private String prenom;
    private String telephone;
    private String activite;
    private Long age;
    private String profession;
}
