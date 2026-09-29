package io.digiservices.agriculteurservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Crédit en cours de remboursement, avec ses prochaines échéances et le compte de
 * remboursement sur lequel elles seront prélevées.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditRemboursementDto {

    private Long numeroCredit;
    private String codeAgence;
    private String typeCredit;
    private String libelleTypeCredit;
    private BigDecimal montantAccorde;
    private BigDecimal capitalRestantDu;
    private BigDecimal montantEcheance;
    private Long nombreEcheances;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOuverture;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateEcheanceFinale;
    private String statut;
    private String compteRemboursement;

    private List<EcheanceCreditDto> prochainesEcheances;
    private long nbEcheancesRestantes;
    private BigDecimal resteTotalAPayer;
}
