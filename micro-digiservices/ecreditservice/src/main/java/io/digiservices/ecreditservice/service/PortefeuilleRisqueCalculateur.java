package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.LigneRisqueDto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.NON_AFFECTE;

/**
 * Ventile les credits en cours d'un point de service par produit (type de credit SAF), par
 * agent (gestionnaire designe digi) et par croisement des deux, avec le PAR 30 et le PAR 90.
 *
 * <p>Pur et sans etat : il recoit les credits deja lus dans SAF et les affectations deja lues
 * dans digi, et rend des sommes. C'est ce qui permet de le tester a sec et de garantir que
 * la somme des lignes « agent », ligne « Non affecte » comprise, redonne le point de service.</p>
 *
 * <p>Arbitrages de la proposition du 29/10/2026 appliques ici : l'agent est le gestionnaire
 * designe et jamais le gestionnaire SAF ; les credits sans gestionnaire forment une ligne a
 * part ; les dossiers passes au contentieux par le DA restent dans la base et sont comptes.</p>
 */
public final class PortefeuilleRisqueCalculateur {

    private PortefeuilleRisqueCalculateur() {
    }

    public static final String TRANCHE_30 = "30";
    public static final String TRANCHE_90 = "90";
    public static final String TRANCHE_RETARD = "retard";

    public record Resultat(LigneRisqueDto total, List<LigneRisqueDto> parProduit,
                           List<LigneRisqueDto> parAgent, List<LigneRisqueDto> croisement) {}

    /**
     * @param credits             credits EN COURS du point de service (le filtre de categorie est fait en amont)
     * @param affectations        affectations actives de type CREDIT, par numero de credit
     * @param contentieuxDeclares numeros des credits que le DA a passes au contentieux dans digi
     * @param codAgencia          code SAF du point de service, pour savoir si l'agent y est encore
     * @param aujourdhui          date de lecture
     * @param agentSeul           si non nul, le tableau par agent et le croisement ne gardent que
     *                            cet agent et la ligne « Non affecte » (regle de l'agent de credit)
     */
    public static Resultat calculer(List<PortefeuilleCreditDto> credits, Map<Long, AffectationDto> affectations,
                                    Set<Long> contentieuxDeclares, String codAgencia, LocalDate aujourdhui,
                                    Long agentSeul) {
        LocalDate d30 = aujourdhui.minusDays(30), d90 = aujourdhui.minusDays(90);
        LigneRisqueDto total = LigneRisqueDto.vide("TOTAL", "Point de service");
        Map<String, LigneRisqueDto> produits = new LinkedHashMap<>();
        Map<String, LigneRisqueDto> agents = new LinkedHashMap<>();
        Map<String, LigneRisqueDto> croisements = new LinkedHashMap<>();

        for (PortefeuilleCreditDto c : credits) {
            AffectationDto aff = affectations.get(c.getNumCredito());
            String cleProduit = cleProduit(c);
            String cleAgent = aff == null ? NON_AFFECTE : String.valueOf(aff.getAgentUserId());

            LigneRisqueDto p = produits.computeIfAbsent(cleProduit, k -> ligneProduit(c));
            LigneRisqueDto a = agents.computeIfAbsent(cleAgent, k -> ligneAgent(aff, codAgencia));
            LigneRisqueDto x = croisements.computeIfAbsent(cleAgent + "|" + cleProduit, k -> {
                LigneRisqueDto l = ligneAgent(aff, codAgencia);
                l.setCle(k);
                l.setTipCredito(c.getTipCredito());
                l.setLibelle(l.getLibelle() + " · " + libelleProduit(c));
                return l;
            });

            boolean contentieux = contentieuxDeclares.contains(c.getNumCredito());
            for (LigneRisqueDto l : List.of(total, p, a, x)) {
                cumuler(l, c, d30, d90, contentieux);
            }
        }

        total.figerTaux();
        List<LigneRisqueDto> parProduit = trier(new ArrayList<>(produits.values()));
        List<LigneRisqueDto> parAgent = trier(new ArrayList<>(agents.values()));
        List<LigneRisqueDto> croisement = trier(new ArrayList<>(croisements.values()));
        // La ligne « Non affecte » ferme le tableau des agents, quel que soit son poids.
        parAgent.sort(Comparator.comparing(LigneRisqueDto::isNonAffecte));

        if (agentSeul != null) {
            parAgent = parAgent.stream().filter(l -> l.isNonAffecte() || agentSeul.equals(l.getAgentUserId())).toList();
            croisement = croisement.stream().filter(l -> l.isNonAffecte() || agentSeul.equals(l.getAgentUserId())).toList();
        }
        return new Resultat(total, parProduit, parAgent, croisement);
    }

    /**
     * Le credit repond-il aux filtres de la liste « credits derriere ce chiffre » ?
     *
     * @param agentCle  identifiant d'agent, {@link io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos#NON_AFFECTE}, ou null
     * @param tranche   {@code 30}, {@code 90}, {@code retard} ou null pour tous
     */
    public static boolean correspond(PortefeuilleCreditDto c, AffectationDto aff, Long tipCredito,
                                     String agentCle, String tranche, LocalDate aujourdhui) {
        if (tipCredito != null && !tipCredito.equals(c.getTipCredito())) {
            return false;
        }
        if (agentCle != null && !agentCle.isBlank()) {
            if (NON_AFFECTE.equals(agentCle)) {
                if (aff != null) return false;
            } else if (aff == null || !agentCle.equals(String.valueOf(aff.getAgentUserId()))) {
                return false;
            }
        }
        LocalDate prem = c.getDatPremiereImpayee();
        if (TRANCHE_30.equals(tranche)) return prem != null && !prem.isAfter(aujourdhui.minusDays(30));
        if (TRANCHE_90.equals(tranche)) return prem != null && !prem.isAfter(aujourdhui.minusDays(90));
        if (TRANCHE_RETARD.equals(tranche)) return prem != null;
        return true;
    }

    // ------------------------------------------------------------------ interne

    private static void cumuler(LigneRisqueDto l, PortefeuilleCreditDto c, LocalDate d30, LocalDate d90, boolean contentieux) {
        BigDecimal solde = nvl(c.getMonSaldo());
        l.setNbCredits(l.getNbCredits() + 1);
        l.setEncours(l.getEncours().add(solde));
        LocalDate prem = c.getDatPremiereImpayee();
        if (prem != null) {
            l.setNbEnRetard(l.getNbEnRetard() + 1);
            l.setImpaye(l.getImpaye().add(nvl(c.getMntCapImpaye())).add(nvl(c.getMntIntImpaye())));
            if (!prem.isAfter(d30)) {
                l.setNbPar30(l.getNbPar30() + 1);
                l.setEncoursPar30(l.getEncoursPar30().add(solde));
            }
            if (!prem.isAfter(d90)) {
                l.setNbPar90(l.getNbPar90() + 1);
                l.setEncoursPar90(l.getEncoursPar90().add(solde));
            }
        }
        if (contentieux) {
            l.setNbContentieuxDeclares(l.getNbContentieuxDeclares() + 1);
        }
    }

    private static List<LigneRisqueDto> trier(List<LigneRisqueDto> lignes) {
        lignes.forEach(LigneRisqueDto::figerTaux);
        lignes.sort(Comparator.comparing(LigneRisqueDto::getEncoursPar30).reversed()
                .thenComparing(Comparator.comparing(LigneRisqueDto::getEncours).reversed())
                .thenComparing(l -> Objects.toString(l.getLibelle(), "")));
        return lignes;
    }

    private static String cleProduit(PortefeuilleCreditDto c) {
        return c.getTipCredito() == null ? "SANS_TYPE" : String.valueOf(c.getTipCredito());
    }

    private static String libelleProduit(PortefeuilleCreditDto c) {
        String des = c.getDesTipCredito() == null ? "" : c.getDesTipCredito().trim();
        if (!des.isEmpty()) return des;
        return c.getTipCredito() == null ? "Sans type" : "Type " + c.getTipCredito();
    }

    private static LigneRisqueDto ligneProduit(PortefeuilleCreditDto c) {
        LigneRisqueDto l = LigneRisqueDto.vide(cleProduit(c), libelleProduit(c));
        l.setTipCredito(c.getTipCredito());
        return l;
    }

    private static LigneRisqueDto ligneAgent(AffectationDto aff, String codAgencia) {
        if (aff == null) {
            LigneRisqueDto l = LigneRisqueDto.vide(NON_AFFECTE, "Non affecté");
            l.setNonAffecte(true);
            return l;
        }
        LigneRisqueDto l = LigneRisqueDto.vide(String.valueOf(aff.getAgentUserId()),
                aff.getAgentNom() == null ? "Agent " + aff.getAgentUserId() : aff.getAgentNom());
        l.setAgentUserId(aff.getAgentUserId());
        l.setDisponible(!Boolean.FALSE.equals(aff.getAgentActif())
                && codAgencia != null && codAgencia.equals(aff.getAgentCodAgencia()));
        return l;
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
