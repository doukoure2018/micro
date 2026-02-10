package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BienPersonnelDto {
    private Long bienPersoId;
    private Long collecteId;

    private Boolean terrainExiste;
    private BigDecimal terrainValeur;

    private Boolean maisonExiste;
    private BigDecimal maisonValeur;

    private Boolean vehiculeExiste;
    private BigDecimal vehiculeValeur;

    private Boolean motoExiste;
    private BigDecimal motoValeur;

    private Boolean autreBienExiste;
    private BigDecimal autreBienValeur;
}
