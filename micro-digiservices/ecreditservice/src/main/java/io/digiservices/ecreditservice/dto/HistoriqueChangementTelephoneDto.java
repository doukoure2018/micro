package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistoriqueChangementTelephoneDto {

    private Long id;
    private Long demandeId;
    private Integer cycleNumero;
    private String action;
    private String motif;
    private String ancienTelephoneCycle;
    private String nouveauTelephoneCycle;
    private Long parUserId;
    private String parNom;
    private String parRole;
    private LocalDateTime at;
}
