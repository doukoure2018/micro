package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Valeurs de controle SAF d'un point de service pour le rapport mensuel des indicateurs
 * (V167). Elles ne remplacent jamais la saisie de l'agence : elles s'affichent en regard
 * et servent a signaler un ecart. Encours, retards et capital en retard sont lus a la date
 * de lecture (SAF ne conserve pas de photographie a l'arrete) ; les octrois sont ceux dont
 * la date d'ouverture tombe dans le mois demande.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControleMensuelDto {
    private String codAgencia;
    /** Capital restant du des credits en cours (meme regle que le portefeuille). */
    private BigDecimal encoursCredits;
    /** Capital et interets echus impayes des credits en cours. */
    private BigDecimal retards;
    /** Encours des credits en cours ayant au moins une echeance impayee. */
    private BigDecimal capitalRetard;
    /** Credits ouverts dans le mois, tous etats sauf annules. */
    private long nbOctrois;
    private BigDecimal octroisRealises;
    private LocalDate dateLecture;
}
