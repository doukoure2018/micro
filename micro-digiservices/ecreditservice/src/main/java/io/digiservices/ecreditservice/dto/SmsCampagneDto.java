package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Campagne SMS avec ses compteurs par statut (agrégés depuis la file d'envoi).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SmsCampagneDto {
    private Long campagneId;
    private String nom;
    private String message;
    private String statut;
    private Integer totalDestinataires;
    private String creePar;
    private Long sourceRepertoireId;
    private String sourceRepertoireLibelle;

    // Compteurs temps réel
    private Long nbEnAttente;
    private Long nbEncours;
    private Long nbSucces;
    private Long nbEchecs;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateCreation;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateLancement;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateFin;
}
