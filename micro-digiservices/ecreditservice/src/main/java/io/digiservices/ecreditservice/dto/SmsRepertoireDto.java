package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** Répertoire de diffusion SMS (produit × segment), chargé en amont par le responsable digital. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SmsRepertoireDto {
    private Long repertoireId;
    private String produit;
    private String segment;
    private String libelle;
    private Integer nbNumeros;
    private String chargePar;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateChargement;
}
