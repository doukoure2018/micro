package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** Indicateurs de tete du portefeuille d'une agence SAF (calcul a la date du jour). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortefeuilleIndicateursDto {
    private long nbCredits;              // credits actifs (solde > 0, non clotures)
    private BigDecimal encoursTotal;     // somme des capitaux restants dus
    private long nbEnRetard;             // credits avec au moins une echeance echue impayee
    private BigDecimal mntImpaye;        // capital + interets echus impayes
    private BigDecimal encoursPar30;     // encours des credits en retard > 30 jours (PAR30)
    private BigDecimal encoursPar90;     // encours des credits en retard > 90 jours (PAR90)
}
