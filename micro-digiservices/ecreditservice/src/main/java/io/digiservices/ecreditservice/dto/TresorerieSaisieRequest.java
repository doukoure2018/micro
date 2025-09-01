package io.digiservices.ecreditservice.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class TresorerieSaisieRequest {
    private Integer numeroMois;
    private BigDecimal soldeDebut;
    private List<LigneEncaissementDto> encaissements;
    private List<LigneDecaissementDto> decaissements;
}