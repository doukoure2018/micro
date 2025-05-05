package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Entreprise {

    private Long entrepriseId;
    private Long promoteurId;
    private String nom;
    private String formeJuridique;
    private String secteurActivite;
    private LocalDate dateCreation;
    private String numeroRegistre;
    private String adresse;
    private String telephone;
    private String email;
    private LocalDateTime dateEnregistrement;
    private LocalDateTime dateModification;

}
