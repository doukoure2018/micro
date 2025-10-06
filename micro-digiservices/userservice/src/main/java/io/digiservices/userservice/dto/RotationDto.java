package io.digiservices.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RotationDto {
    private Long idRotation;
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private String nomComplet;
    private Long ps;
    private String nomPointVente;
    private String codePointVente;
    private Boolean statut;
    private String statutLibelle;
    private LocalDateTime dateRotation;
    private String dureeActive;
}
