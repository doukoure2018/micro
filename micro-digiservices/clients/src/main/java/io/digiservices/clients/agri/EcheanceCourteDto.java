package io.digiservices.clients.agri;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Echeance restant a payer sur un credit en cours, telle que servie avec les comptes du membre. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EcheanceCourteDto {

    private Long numeroEcheance;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateEcheance;
    private BigDecimal montant;
    private BigDecimal capital;
    private BigDecimal interets;
    /** Solde restant du sur cette echeance : capital + interets non regles. */
    private BigDecimal resteAPayer;
    /** A_ECHOIR ou IMPAYEE, selon que la date est passee ou non. */
    private String etat;
    /** Jours de retard si IMPAYEE, sinon 0. */
    private long joursRetard;
}
