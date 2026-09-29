package io.digiservices.agriculteurservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Échéance restant à payer sur un crédit en cours de remboursement. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EcheanceCreditDto {

    private Long numeroEcheance;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateEcheance;
    private BigDecimal montant;
    private BigDecimal capital;
    private BigDecimal interets;
    private BigDecimal resteAPayer;
    /** A_ECHOIR si la date est à venir, IMPAYEE si elle est passée. */
    private String etat;
    private long joursRetard;
}
