package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Membre d'une cooperative (contrat public AgriPilot).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembreCooperativeDto {

    private String codeClient;
    private String nom;
    private String typePersonne;
    private String role;
    private LocalDate dateAdhesion;
}
