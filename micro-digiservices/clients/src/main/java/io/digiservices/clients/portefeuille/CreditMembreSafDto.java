package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Un credit SAF d'un membre, vu depuis le suivi des credits octroyes par digi.
 *
 * <p>Tous les etats sont rendus, y compris les credits clos : la question posee n'est pas
 * « quel est le portefeuille vivant ? » — d'autres ecrans y repondent — mais « qu'est devenu
 * le credit que nous avons accorde ? ». Un credit deja rembourse est une reponse, pas une
 * ligne a cacher.</p>
 *
 * <p>Lu dans la SAUVEGARDE (J-1) : la situation d'un credit accorde il y a des mois ne change
 * pas d'une heure a l'autre, et le rapprochement d'une delegation entiere n'a rien a faire
 * dans la base que les agences utilisent pour encaisser.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditMembreSafDto {

    private String codAgencia;
    private String desAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private Integer tipCredito;
    private String desTipCredito;
    /** D en cours, I apure, J contentieux, C clos, T transfere, X annule ; inconnu = en cours. */
    private String indEstado;
    private BigDecimal monCredito;
    private BigDecimal monSaldo;
    private LocalDate fecApertura;
    private LocalDate fecVencimiento;
    /** Plus ancienne echeance impayee ; vide quand le credit est a jour. */
    private LocalDate datPremImp;
    private BigDecimal monCapitalImpaye;
    private BigDecimal monInteretImpaye;

    /** Jours de retard a la date de lecture ; 0 quand le credit est a jour. */
    public int getJoursRetard() {
        if (datPremImp == null) {
            return 0;
        }
        long jours = java.time.temporal.ChronoUnit.DAYS.between(datPremImp, LocalDate.now());
        return jours < 0 ? 0 : (int) jours;
    }

    /**
     * Ce qu'est devenu le credit, en un mot.
     *
     * <p>Vocabulaire plus large que {@link CategorieCredit}, et c'est voulu : cette enumeration
     * repond a « peut-on confier ce credit a un agent ? » et renvoie donc EN_COURS pour tout
     * code qu'elle ne connait pas, y compris {@code C} (clos). Ici la question est l'issue du
     * credit, et annoncer « en cours » un credit rembourse serait faux la ou cela compte le
     * plus — devant le DA qui cherche ce qu'est devenu son dossier.</p>
     */
    public String getSituation() {
        String code = indEstado == null ? "" : indEstado.trim().toUpperCase();
        return switch (code) {
            case "X" -> "Annule";
            case "T" -> "Transfere";
            case "C" -> "Solde";
            case "J" -> "Contentieux";
            case "I" -> "Apure";
            default -> estEteint() ? "Solde" : "En cours";
        };
    }

    /** Le credit est-il solde ? Etat C, ou solde a zero sans impaye ouvert. */
    public boolean isSolde() {
        return "C".equalsIgnoreCase(indEstado == null ? null : indEstado.trim()) || estEteint();
    }

    /** Plus rien a recouvrer : solde nul ou negatif et aucune echeance impayee. */
    private boolean estEteint() {
        return monSaldo != null && monSaldo.signum() <= 0 && datPremImp == null;
    }

    /** Le credit court-il encore ? C'est lui qui pese dans l'encours. */
    public boolean isVivant() {
        return "En cours".equals(getSituation()) || "Contentieux".equals(getSituation())
                || "Apure".equals(getSituation());
    }

    /** En retard a la date de lecture. */
    public boolean isEnRetard() {
        return datPremImp != null;
    }
}
