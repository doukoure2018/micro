package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Corps de la notification BCRG « données traitées » (POST /bcrg/traitements).
 * module : PERSONNE_PHYSIQUE | PERSONNE_MORALE | ENGAGEMENT ;
 * references : identifiants internes traités (IdInterneClt ou RefIntEng), 1 à 1000 par appel.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TraitementNotificationDto {
    private String module;
    private List<String> references;
    private LocalDateTime dateTraitement;
}
