package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.CoupleDeuxPhotos;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCompteDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCoupleDto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Le classement d'une variation entre deux photos : pur, sans base ni contexte Spring.
 *
 * <p>C'est le portage de l'onglet « Évolution » de l'outil de bureau ({@code app/comparaison.py}),
 * qui compare deux relevés d'un point de service. Ici la même règle s'applique à tout le réseau,
 * et par compte comptable : c'est l'entrée demandée le 23/11/2026 — « derrière cette variation,
 * quels comptes comptables ».</p>
 *
 * <p>Deux notions, volontairement séparées. Le STATUT dit ce que fait l'écart : apparu, aggravé,
 * réduit, résolu, ligne nouvelle, ligne disparue, ou simple mouvement d'un écart qui reste. Le
 * CÔTÉ dit quel solde a bougé : le solde client, le solde comptable, les deux, ou aucun. Le
 * statut oriente la priorité, le côté oriente la recherche de l'opération.</p>
 */
public final class VariationEcarts {

    private VariationEcarts() {
    }

    public static final String STATUT_APPARU = "Écart apparu";
    public static final String STATUT_AGGRAVE = "Écart aggravé";
    public static final String STATUT_REDUIT = "Écart réduit";
    public static final String STATUT_RESOLU = "Écart résolu";
    public static final String STATUT_NOUVELLE = "Ligne nouvelle";
    public static final String STATUT_DISPARUE = "Ligne disparue";
    public static final String STATUT_MOUVEMENT = "Mouvement";
    public static final String STATUT_INCHANGE = "Inchangé";

    public static final String COTE_CLIENT = "Client seul";
    public static final String COTE_COMPTABILITE = "Comptabilité seule";
    public static final String COTE_LES_DEUX = "Les deux côtés";
    public static final String COTE_AUCUN = "Sans mouvement de solde";

    /** Seuil par défaut : celui de l'écart mineur de l'outil (SEUIL_ECART_MINEUR = 1 000 GNF). */
    public static final BigDecimal SEUIL_DEFAUT = new BigDecimal("1000");

    private static final DecimalFormat FORMAT;

    static {
        DecimalFormatSymbols symboles = DecimalFormatSymbols.getInstance(Locale.FRANCE);
        symboles.setGroupingSeparator(' ');
        FORMAT = new DecimalFormat("#,##0.00", symboles);
    }

    // ======================= Un couple =======================

    /**
     * Classe un couple. Rend {@code null} quand il n'a rien à dire : inchangé, ou sous le seuil.
     *
     * <p>Le seuil s'applique à la variation ; pour une ligne nouvelle ou disparue, à l'écart
     * qu'elle porte, puisque sa variation est cet écart.</p>
     */
    public static VariationCoupleDto classer(CoupleDeuxPhotos c, BigDecimal seuil) {
        BigDecimal s = seuil == null ? SEUIL_DEFAUT : seuil.abs();
        BigDecimal ecartJour = c.presentJour() ? zero(c.ecartJour()) : null;
        BigDecimal ecartRef = c.presentReference() ? zero(c.ecartReference()) : null;
        BigDecimal variation = zero(ecartJour).subtract(zero(ecartRef));
        BigDecimal dClient = zero(c.soldeClientJour()).subtract(zero(c.soldeClientReference()));
        BigDecimal dCompta = zero(c.soldeComptableJour()).subtract(zero(c.soldeComptableReference()));

        String statut = statut(c, ecartJour, ecartRef);
        if (STATUT_INCHANGE.equals(statut)) {
            return null;
        }
        if (variation.abs().compareTo(s) < 0) {
            return null;
        }
        String cote = (c.presentJour() && c.presentReference()) ? cote(dClient, dCompta) : null;
        return new VariationCoupleDto(
                c.codAgencia(), c.libellePoint(), c.libelleAgence(), c.libelleDelegation(),
                c.compteComptable(), c.produits(),
                ecartRef, ecartJour, variation, dClient, dCompta,
                c.etatReference(), c.etatJour(),
                statut, cote, expliquer(statut, c, ecartJour, ecartRef, dClient, dCompta), null, null,
                c.presentJour() ? c.operations() : null);
    }

    static String statut(CoupleDeuxPhotos c, BigDecimal ecartJour, BigDecimal ecartRef) {
        if (!c.presentReference()) {
            return STATUT_NOUVELLE;
        }
        if (!c.presentJour()) {
            return STATUT_DISPARUE;
        }
        boolean memesSoldes = zero(c.soldeClientJour()).compareTo(zero(c.soldeClientReference())) == 0
                && zero(c.soldeComptableJour()).compareTo(zero(c.soldeComptableReference())) == 0;
        if (memesSoldes && ecartJour.compareTo(ecartRef) == 0 && egal(c.etatJour(), c.etatReference())) {
            return STATUT_INCHANGE;
        }
        boolean avantEnEcart = enEcart(ecartRef, c.etatReference());
        boolean apresEnEcart = enEcart(ecartJour, c.etatJour());
        if (!avantEnEcart && apresEnEcart) {
            return STATUT_APPARU;
        }
        if (avantEnEcart && !apresEnEcart) {
            return STATUT_RESOLU;
        }
        if (avantEnEcart) {
            int cmp = ecartJour.abs().compareTo(ecartRef.abs());
            if (cmp > 0) {
                return STATUT_AGGRAVE;
            }
            if (cmp < 0) {
                return STATUT_REDUIT;
            }
        }
        return STATUT_MOUVEMENT;
    }

    /**
     * En écart : l'état de l'outil quand il est là (« Écart », « Écart mineur », « Écart interne
     * comptabilité », « Sans correspondance comptable »), sinon l'écart lui-même.
     */
    static boolean enEcart(BigDecimal ecart, String etat) {
        if (etat != null && !etat.isBlank()) {
            String e = etat.trim().toLowerCase(Locale.ROOT);
            return e.startsWith("écart") || e.startsWith("ecart") || e.startsWith("sans");
        }
        return ecart == null || ecart.signum() != 0;
    }

    static String cote(BigDecimal dClient, BigDecimal dCompta) {
        boolean client = dClient.signum() != 0;
        boolean compta = dCompta.signum() != 0;
        if (client && compta) {
            return COTE_LES_DEUX;
        }
        if (client) {
            return COTE_CLIENT;
        }
        if (compta) {
            return COTE_COMPTABILITE;
        }
        return COTE_AUCUN;
    }

    /** Une phrase courte : ce que fait l'écart, et de quel côté vient le mouvement. */
    static String expliquer(String statut, CoupleDeuxPhotos c, BigDecimal ecartJour, BigDecimal ecartRef,
                            BigDecimal dClient, BigDecimal dCompta) {
        if (STATUT_NOUVELLE.equals(statut)) {
            return "ligne absente de la photo de référence ; elle porte un écart de " + montant(ecartJour)
                    + (blanc(c.etatJour()) ? "" : ", " + c.etatJour().toLowerCase(Locale.ROOT));
        }
        if (STATUT_DISPARUE.equals(statut)) {
            return "ligne absente de la photo du jour ; elle portait un écart de " + montant(ecartRef)
                    + (blanc(c.etatReference()) ? "" : ", " + c.etatReference().toLowerCase(Locale.ROOT));
        }
        String debut;
        if (STATUT_RESOLU.equals(statut)) {
            debut = "l'écart disparaît (" + montant(ecartRef) + " → " + montant(ecartJour) + ")";
        } else if (STATUT_REDUIT.equals(statut)) {
            debut = "l'écart se réduit de " + montant(ecartRef) + " à " + montant(ecartJour);
        } else if (STATUT_AGGRAVE.equals(statut)) {
            debut = "l'écart se creuse de " + montant(ecartRef) + " à " + montant(ecartJour);
        } else if (ecartJour.compareTo(ecartRef) != 0) {
            debut = "l'écart passe de " + montant(ecartRef) + " à " + montant(ecartJour);
        } else {
            debut = "l'écart reste à " + montant(ecartJour);
        }
        String cote;
        boolean client = dClient.signum() != 0;
        boolean compta = dCompta.signum() != 0;
        if (!client && !compta) {
            cote = "sans mouvement de solde"
                    + (egal(c.etatJour(), c.etatReference()) ? "" : " (état " + c.etatReference() + " → " + c.etatJour() + ")");
        } else if (!client) {
            cote = "la comptabilité a bougé de " + montant(dCompta) + " sans mouvement côté client";
        } else if (!compta) {
            cote = "le solde client a bougé de " + montant(dClient) + " sans mouvement côté comptabilité";
        } else {
            cote = "les deux côtés ont bougé (client " + montant(dClient) + ", comptabilité " + montant(dCompta) + ")";
        }
        return debut + " : " + cote;
    }

    // ======================= Le réseau =======================

    /** Classe tous les couples et ne garde que ceux qui ont quelque chose à dire, les plus gros d'abord. */
    public static List<VariationCoupleDto> classerTous(List<CoupleDeuxPhotos> couples, BigDecimal seuil) {
        List<VariationCoupleDto> variations = new ArrayList<>();
        for (CoupleDeuxPhotos c : couples) {
            VariationCoupleDto v = classer(c, seuil);
            if (v != null) {
                variations.add(v);
            }
        }
        variations.sort(Comparator.comparing((VariationCoupleDto v) -> v.variation().abs()).reversed());
        return variations;
    }

    /** Une ligne par compte comptable, tous points de service confondus, la plus grosse variation absolue d'abord. */
    public static List<VariationCompteDto> parCompte(List<VariationCoupleDto> variations) {
        Map<String, Agregat> parCompte = new LinkedHashMap<>();
        for (VariationCoupleDto v : variations) {
            parCompte.computeIfAbsent(v.compteComptable(), k -> new Agregat(v.produits())).ajouter(v);
        }
        List<VariationCompteDto> lignes = new ArrayList<>();
        parCompte.forEach((compte, a) -> lignes.add(a.vers(compte)));
        lignes.sort(Comparator.comparing(VariationCompteDto::variationAbsolue).reversed());
        return lignes;
    }

    /** Somme de ce qui s'est creusé : la part des variations qui éloigne de zéro. */
    public static BigDecimal sommeAggravations(List<VariationCoupleDto> variations) {
        BigDecimal somme = BigDecimal.ZERO;
        for (VariationCoupleDto v : variations) {
            BigDecimal d = zero(v.ecartJour()).abs().subtract(zero(v.ecartReference()).abs());
            if (d.signum() > 0) {
                somme = somme.add(d);
            }
        }
        return somme;
    }

    /** Somme de ce qui s'est résorbé : la part des variations qui rapproche de zéro. */
    public static BigDecimal sommeResolutions(List<VariationCoupleDto> variations) {
        BigDecimal somme = BigDecimal.ZERO;
        for (VariationCoupleDto v : variations) {
            BigDecimal d = zero(v.ecartReference()).abs().subtract(zero(v.ecartJour()).abs());
            if (d.signum() > 0) {
                somme = somme.add(d);
            }
        }
        return somme;
    }

    /** Part de la variation absolue portée par les cinq premiers comptes ; nulle sans variation. */
    public static BigDecimal partCinqPremiers(List<VariationCompteDto> comptes) {
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal cinq = BigDecimal.ZERO;
        int i = 0;
        for (VariationCompteDto c : comptes) {
            total = total.add(c.variationAbsolue());
            if (i++ < 5) {
                cinq = cinq.add(c.variationAbsolue());
            }
        }
        if (total.signum() == 0) {
            return null;
        }
        return cinq.divide(total, 4, RoundingMode.HALF_UP);
    }

    // ======================= Outils =======================

    private static final class Agregat {
        private final String produits;
        private int nbPoints;
        private BigDecimal nette = BigDecimal.ZERO;
        private BigDecimal absolue = BigDecimal.ZERO;
        private final Map<String, BigDecimal> parCote = new LinkedHashMap<>();
        private int apparus, aggraves, reduits, resolus, nouvelles, disparues, mouvements;

        Agregat(String produits) {
            this.produits = produits;
        }

        void ajouter(VariationCoupleDto v) {
            nbPoints++;
            nette = nette.add(v.variation());
            absolue = absolue.add(v.variation().abs());
            if (v.cote() != null) {
                parCote.merge(v.cote(), v.variation().abs(), BigDecimal::add);
            }
            switch (v.statut()) {
                case STATUT_APPARU -> apparus++;
                case STATUT_AGGRAVE -> aggraves++;
                case STATUT_REDUIT -> reduits++;
                case STATUT_RESOLU -> resolus++;
                case STATUT_NOUVELLE -> nouvelles++;
                case STATUT_DISPARUE -> disparues++;
                default -> mouvements++;
            }
        }

        VariationCompteDto vers(String compte) {
            String dominant = parCote.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);
            return new VariationCompteDto(compte, produits, nbPoints, nette, absolue, dominant,
                    apparus, aggraves, reduits, resolus, nouvelles, disparues, mouvements);
        }
    }

    private static BigDecimal zero(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private static boolean egal(String a, String b) {
        return (a == null ? "" : a.trim()).equals(b == null ? "" : b.trim());
    }

    private static boolean blanc(String s) {
        return s == null || s.isBlank();
    }

    static String montant(BigDecimal v) {
        return FORMAT.format(zero(v)) + " GNF";
    }
}
