package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChiffreAffairesDto {
    private Long caId;
    private Long collecteId;

    private BigDecimal caHebdomadaireDeclare;
    private BigDecimal caMensuelDeclare;

    private String cycleMensuelJson;
    private String cycleHebdoJson;

    private BigDecimal caJourFort;
    private BigDecimal caJourMoyen;
    private BigDecimal caJourFaible;

    private BigDecimal caHebdoCalcule;
    private BigDecimal caMensuelCalcule;
}
