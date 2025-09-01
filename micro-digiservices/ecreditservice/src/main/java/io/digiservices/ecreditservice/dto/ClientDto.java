package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {
    private Long id;
    private String nom;
    private String prenom;
    private String adresse;
    private String telephone;
    private String email;
    private String typeActivite;
    private String numeroIdentite;
    private String numeroRegistreCommerce;
    private String secteurActivite;
    private Integer anneesExperience;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime dateDerniereModification;


}