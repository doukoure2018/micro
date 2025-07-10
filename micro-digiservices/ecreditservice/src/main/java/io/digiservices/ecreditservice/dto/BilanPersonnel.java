package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class BilanPersonnel {
    private Long bilanPersonnelId;
    private Long promoteurId;
    private LocalDate dateBilan;
    private BigDecimal epargnes;
    private BigDecimal valeurBiensDurables;
    private LocalDateTime dateEnregistrement;
    private LocalDateTime dateModification;

    // alter
    private String libeleGarantie;
    private BigDecimal montantGarantie;
}
