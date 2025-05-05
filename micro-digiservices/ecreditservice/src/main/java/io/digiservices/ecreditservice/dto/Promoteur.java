package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Promoteur {

    private Long promoteurId;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String numeroIdentite;
    private String adresse;
    private String telephone;
    private String email;
    private LocalTime dateCreation;
    private LocalTime dateModification;
}
