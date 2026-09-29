package io.digiservices.clients.agri;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Credit en cours de remboursement d'un membre (etat SAF D ou J), avec ses prochaines
 * echeances restant a payer et le compte sur lequel elles seront prelevees.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditEnCoursDto {

    private Long numeroCredit;
    private String codeAgence;
    private String typeCredit;
    private String libelleTypeCredit;
    private BigDecimal montantAccorde;
    /** Capital restant du a ce jour. */
    private BigDecimal capitalRestantDu;
    private BigDecimal montantEcheance;
    private Long nombreEcheances;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOuverture;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateEcheanceFinale;
    /** D = decaisse, J = judiciaire. */
    private String statut;
    private String libelleStatut;
    /** Compte de remboursement rattache, quand il a pu etre identifie. */
    private String compteRemboursement;

    /** Echeances restant a payer, les plus proches d'abord. */
    private List<EcheanceCourteDto> prochainesEcheances;
    /** Nombre total d'echeances restant a payer, au-dela de celles listees. */
    private long nbEcheancesRestantes;
    private BigDecimal resteTotalAPayer;
}
