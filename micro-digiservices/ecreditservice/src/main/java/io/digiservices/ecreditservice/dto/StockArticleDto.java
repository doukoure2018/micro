package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class StockArticleDto {
    private Long stockArticleId;
    private Long collecteId;

    private Integer ordre;
    private String nomArticle;
    private Integer quantite;
    private BigDecimal coutUnitaire;

    // Generated column (read-only)
    private BigDecimal valeurStock;
}
