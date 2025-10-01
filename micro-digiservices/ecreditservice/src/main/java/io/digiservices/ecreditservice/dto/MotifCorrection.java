package io.digiservices.ecreditservice.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MotifCorrection {
    private Long id;
    private Long userId;
    private String libele;
    private String codCliente;
    private String codAgence;
    private String statut = "EN_COURS"; // EN_COURS, VALIDE, ANNULE, REJETE

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateAnnulation;

    private Long personnePhysiqueId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}