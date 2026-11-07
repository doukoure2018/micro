package io.digiservices.ecreditservice.utils;

import io.digiservices.clients.portefeuille.CreditMembreSafDto;
import io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.CreditOctroye;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Apparier un dossier valide dans digi au credit que SAF a mis en place.
 *
 * <p>Les deux systemes ne partagent AUCUN identifiant de credit : {@code demandeindividuel} ne
 * porte pas de {@code NUM_CREDITO}, et SAF ignore le numero du dossier digi. Le seul crochet
 * est le numero de membre, verifie contre SAF a la saisie depuis le 26/10/2026. Un membre peut
 * porter plusieurs credits, dont d'anciens montes avant digi : rapprocher sur le seul numero de
 * membre compterait ces credits-la comme le resultat du dossier du jour.</p>
 *
 * <p>La regle retenue, et c'est la seule chose qui importe dans cette classe : un dossier est
 * apparie au PLUS ANCIEN credit encore libre du membre dont la date d'ouverture n'est pas
 * anterieure de plus de {@value #TOLERANCE_JOURS} jours a la date d'octroi. Un credit deja
 * apparie a un autre dossier ne l'est pas deux fois — sans quoi deux dossiers du meme membre
 * doubleraient le meme encours.</p>
 *
 * <p>La tolerance existe parce que l'agence met parfois le credit en place dans SAF avant que
 * le dernier visa ne soit saisi dans digi. Elle ne va pas au-dela d'un mois : plus loin, on
 * attraperait le credit precedent du membre.</p>
 *
 * <p>Classe pure, sans base ni reseau : la regle d'appariement est le seul endroit ou ce suivi
 * peut mentir, et elle doit pouvoir etre eprouvee cas par cas.</p>
 */
public final class CreditsOctroyesRapprochement {

    /** Jours d'anteriorite tolere entre la mise en place dans SAF et l'octroi dans digi. */
    public static final int TOLERANCE_JOURS = 30;

    private CreditsOctroyesRapprochement() {
    }

    /** L'issue du rapprochement d'un dossier. */
    public enum Etat {
        /** Un credit SAF correspond : le dossier est bien devenu un credit. */
        EN_PLACE("Mis en place"),
        /** Le membre existe dans SAF mais aucun credit n'y correspond : octroi non suivi. */
        PAS_DE_CREDIT("Pas de credit dans SAF"),
        /** Le dossier n'a pas de numero de membre exploitable : rien a rapprocher. */
        SANS_NUMERO_MEMBRE("Sans numero de membre");

        private final String libelle;

        Etat(String libelle) {
            this.libelle = libelle;
        }

        public String getLibelle() {
            return libelle;
        }
    }

    /** Un dossier octroye et ce que SAF en dit. */
    public record SituationDossier(CreditOctroye dossier, Etat etat, CreditMembreSafDto credit) {

        public String etatCode() {
            return etat.name();
        }

        public String etatLibelle() {
            return etat.getLibelle();
        }

        /** Ce qu'est devenu le credit dans SAF ; vide quand il n'y en a pas. */
        public String situationSaf() {
            return credit == null ? null : credit.getSituation();
        }
    }

    /**
     * Les totaux du perimetre rapproche.
     *
     * @param montantDemande somme demandee dans digi
     * @param montantOctroye somme reellement mise en place dans SAF (MON_CREDITO des credits apparies)
     * @param encours        solde restant des credits apparies encore vivants
     * @param montantEnRetard capital + interets impayes des credits apparies
     * @param creditsHorsDigi credits des memes membres qu'aucun dossier n'explique : anciens
     *                        credits, ou dossiers montes hors plateforme. Comptes a part, jamais
     *                        melanges aux totaux de digi.
     */
    public record Totaux(long nombreDossiers,
                         long nombreEnPlace,
                         long nombrePasDeCredit,
                         long nombreSansNumero,
                         BigDecimal montantDemande,
                         BigDecimal montantOctroye,
                         BigDecimal encours,
                         long nombreEnRetard,
                         BigDecimal montantEnRetard,
                         long creditsHorsDigi,
                         Map<String, Long> parSituationSaf) {
    }

    public record Resultat(List<SituationDossier> dossiers, Totaux totaux) {
    }

    public static Resultat rapprocher(List<CreditOctroye> dossiers, List<CreditMembreSafDto> creditsSaf) {
        Map<String, List<CreditMembreSafDto>> parMembre = new HashMap<>();
        for (CreditMembreSafDto c : creditsSaf == null ? List.<CreditMembreSafDto>of() : creditsSaf) {
            parMembre.computeIfAbsent(cle(c.getCodCliente()), k -> new ArrayList<>()).add(c);
        }
        parMembre.values().forEach(l -> l.sort(Comparator.comparing(
                CreditMembreSafDto::getFecApertura, Comparator.nullsLast(Comparator.naturalOrder()))));

        // Les dossiers les plus anciens choisissent d'abord : c'est le seul ordre qui donne le
        // meme resultat a chaque execution, et le plus proche de la realite (le credit mis en
        // place en premier correspond au dossier valide en premier).
        List<CreditOctroye> ordonnes = new ArrayList<>(dossiers == null ? List.of() : dossiers);
        ordonnes.sort(Comparator.comparing(CreditOctroye::dateOctroi,
                Comparator.nullsLast(Comparator.naturalOrder())));

        Set<String> apparies = new HashSet<>();
        List<SituationDossier> situations = new ArrayList<>();
        for (CreditOctroye d : ordonnes) {
            String membre = cle(d.numeroMembre());
            if (membre == null) {
                situations.add(new SituationDossier(d, Etat.SANS_NUMERO_MEMBRE, null));
                continue;
            }
            CreditMembreSafDto choisi = choisir(parMembre.get(membre), d, apparies);
            if (choisi == null) {
                situations.add(new SituationDossier(d, Etat.PAS_DE_CREDIT, null));
            } else {
                apparies.add(identite(choisi));
                situations.add(new SituationDossier(d, Etat.EN_PLACE, choisi));
            }
        }
        return new Resultat(situations, totaliser(situations, creditsSaf, apparies));
    }

    /** Le plus ancien credit libre du membre ouvert apres l'octroi, a la tolerance pres. */
    private static CreditMembreSafDto choisir(List<CreditMembreSafDto> candidats, CreditOctroye dossier,
                                              Set<String> dejaApparies) {
        if (candidats == null) {
            return null;
        }
        LocalDate plancher = dossier.dateOctroi() == null
                ? null : dossier.dateOctroi().toLocalDate().minusDays(TOLERANCE_JOURS);
        for (CreditMembreSafDto c : candidats) {
            if (dejaApparies.contains(identite(c))) {
                continue;
            }
            // Sans date d'ouverture connue, on ne peut pas trancher : le credit reste libre
            // plutot que d'etre attribue a tort.
            if (c.getFecApertura() == null) {
                continue;
            }
            if (plancher == null || !c.getFecApertura().isBefore(plancher)) {
                return c;
            }
        }
        return null;
    }

    private static Totaux totaliser(List<SituationDossier> situations, List<CreditMembreSafDto> creditsSaf,
                                    Set<String> apparies) {
        long enPlace = 0;
        long pasDeCredit = 0;
        long sansNumero = 0;
        long enRetard = 0;
        BigDecimal demande = BigDecimal.ZERO;
        BigDecimal octroye = BigDecimal.ZERO;
        BigDecimal encours = BigDecimal.ZERO;
        BigDecimal retard = BigDecimal.ZERO;
        Map<String, Long> parSituation = new LinkedHashMap<>();

        for (SituationDossier s : situations) {
            demande = somme(demande, s.dossier().montantDemande());
            switch (s.etat()) {
                case EN_PLACE -> enPlace++;
                case PAS_DE_CREDIT -> pasDeCredit++;
                case SANS_NUMERO_MEMBRE -> sansNumero++;
            }
            CreditMembreSafDto c = s.credit();
            if (c == null) {
                continue;
            }
            parSituation.merge(c.getSituation(), 1L, Long::sum);
            octroye = somme(octroye, c.getMonCredito());
            if (c.isVivant()) {
                encours = somme(encours, c.getMonSaldo());
            }
            if (c.isEnRetard()) {
                enRetard++;
                retard = somme(somme(retard, c.getMonCapitalImpaye()), c.getMonInteretImpaye());
            }
        }
        long horsDigi = creditsSaf == null ? 0
                : creditsSaf.stream().filter(c -> !apparies.contains(identite(c))).count();
        return new Totaux(situations.size(), enPlace, pasDeCredit, sansNumero,
                demande, octroye, encours, enRetard, retard, horsDigi, parSituation);
    }

    private static BigDecimal somme(BigDecimal total, BigDecimal ajout) {
        return ajout == null ? total : total.add(ajout);
    }

    /** Un credit SAF est identifie par son point de service et son numero. */
    private static String identite(CreditMembreSafDto c) {
        return c.getCodAgencia() + "/" + c.getNumCredito();
    }

    /** Les numeros de membre arrivent avec des espaces de saisie des deux cotes. */
    private static String cle(String numero) {
        if (numero == null || numero.isBlank()) {
            return null;
        }
        return numero.trim();
    }
}
