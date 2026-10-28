package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Crédit sorti du portefeuille, daté par SAF (point 10).
 *
 * <p><b>Limite à connaître :</b> SAF ne date que les crédits <i>clôturés</i>, et seulement une
 * partie d'entre eux. Les crédits <i>apurés</i> (passés en perte) et les <i>transferts</i> ne
 * portent jamais de date de sortie : ils n'apparaissent donc pas dans une plage de dates, et
 * restent consultables dans le portefeuille avec {@code inclureClos=true}.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SortiePortefeuilleDto {
    private String codeAgence;
    private Long numeroCredit;
    private String codeClient;
    private String nomClient;
    private Integer typeCredit;
    private String libelleTypeCredit;
    private String codeActivite;
    private FiliereDto filiere;
    private BigDecimal montant;
    /** Solde restant à la lecture : zéro pour un crédit soldé. */
    private BigDecimal solde;
    private LocalDate dateOuverture;
    private LocalDate dateEcheance;
    /** Date à laquelle SAF a clôturé le crédit. */
    private LocalDate dateSortie;
    /** Statut SAF traduit (voir /referentiels/statuts). */
    private String statut;
    private String codeAgent;
    private String nomAgent;
}
