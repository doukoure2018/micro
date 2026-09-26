package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** Totaux de l'etat TT1 sur la periode et le perimetre demandes. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EcheancesIndicateursDto {

    private long nbEcheances;
    private long nbCredits;
    private long nbClients;
    private BigDecimal montantAttendu;     // somme des echeances de la periode
    private BigDecimal capitalAttendu;
    private BigDecimal interetsAttendus;
    private BigDecimal montantRegle;       // attendu - reste
    private BigDecimal resteAEncaisser;    // soldes restant dus
    private long nbReglees;
    private long nbAEchoir;
    private long nbImpayees;
    /** montantRegle / montantAttendu, en pourcentage. */
    private BigDecimal tauxRecouvrement;
}
