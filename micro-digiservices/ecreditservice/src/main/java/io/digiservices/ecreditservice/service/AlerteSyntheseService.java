package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.EcheanceAvenirDto;
import io.digiservices.clients.portefeuille.IndicateursAgenceDto;
import io.digiservices.clients.portefeuille.NouvelImpayeDto;
import io.digiservices.ecreditservice.repository.AlerteSyntheseRepository;
import io.digiservices.ecreditservice.repository.AlerteSyntheseRepository.Agent;
import io.digiservices.ecreditservice.repository.AlerteSyntheseRepository.Charge;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository.PointVenteHierarchie;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Syntheses d'alertes du matin pour le DA (par point de service et par agent), le DR (par
 * agence) et la DE (par delegation, le lundi) — proposition DSIG du 23/10/2026 : le detail va a
 * l'agent, la synthese au directeur. Pas de nom de client ni de numero de credit ; le courriel
 * dit ou regarder et renvoie a la plateforme.
 */
@Service
@RequiredArgsConstructor
public class AlerteSyntheseService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final AlerteSyntheseRepository repository;
    private final PortefeuillePerimetreRepository perimetre;

    /** Seuil d'alerte par point de service : impayes du jour en nombre OU en montant ; ligne en rouge, mention dans l'objet. */
    @Value("${portefeuille.alertes.seuil-impayes-nb:5}")
    private int seuilNb;
    @Value("${portefeuille.alertes.seuil-impayes-montant:20000000}")
    private long seuilMontant;
    @Value("${ui.app.url:https://digi-creditrural-io.com}")
    private String uiUrl;

    /** Une ligne de synthese (point de service, agence ou delegation). */
    @Data
    @Builder
    public static class Ligne {
        private String cle;
        private String libelle;
        private String complement;      // code SAF, nom du DA...
        private long nbImpayes;
        private BigDecimal mntImpayes;
        private long nbEcheances;
        private BigDecimal mntEcheances;
        private long nbNonAffectes;
        private BigDecimal encours;
        private BigDecimal encoursPar30;
        private boolean alerte;
    }

    @Data
    @Builder
    public static class LigneAgent {
        private String nom;
        private String pointService;
        private long nbImpayes;
        private long nbEcheances;
        private Long nbRetardPortefeuille;
        private Long nbCreditsPortefeuille;
    }

    @Data
    @Builder
    public static class Synthese {
        private String titre;
        private String sujet;
        private long nbImpayes;
        private BigDecimal mntImpayes;
        private long nbEcheances;
        private BigDecimal mntEcheances;
        private long nbNonAffectes;
        private int nbAlertes;
        private List<Ligne> lignes;
        private List<LigneAgent> agents;
        private String corpsHtml;
    }

    /** Synthese d'un perimetre (codes SAF) agregee par point de service, avec le tableau par agent. */
    public Synthese pourDa(String libellePerimetre, Collection<String> codes, List<EcheanceAvenirDto> echeances,
                           List<NouvelImpayeDto> impayes, Map<String, IndicateursAgenceDto> indicateurs, int joursAvant) {
        Map<String, PointVenteHierarchie> hier = hierarchie(codes);
        Map<String, Agent> agents = repository.agentsParCredit(codes);
        List<EcheanceAvenirDto> mesEch = echeances.stream().filter(e -> codes.contains(e.getCodAgencia())).toList();
        List<NouvelImpayeDto> mesImp = impayes.stream().filter(i -> codes.contains(i.getCodAgencia())).toList();
        if (mesEch.isEmpty() && mesImp.isEmpty()) return null;

        // Par point de service
        Map<String, Ligne> parPs = new LinkedHashMap<>();
        for (String code : codes) {
            PointVenteHierarchie h = hier.get(code);
            parPs.put(code, Ligne.builder().cle(code).libelle(h != null ? h.libelle() : code).complement(code)
                    .mntImpayes(BigDecimal.ZERO).mntEcheances(BigDecimal.ZERO).build());
        }
        long nonAffectes = 0;
        for (NouvelImpayeDto i : mesImp) {
            Ligne l = parPs.get(i.getCodAgencia());
            if (l == null) continue;
            l.setNbImpayes(l.getNbImpayes() + 1);
            l.setMntImpayes(l.getMntImpayes().add(nvl(i.getMntImpaye())));
            if (!agents.containsKey(i.getCodAgencia() + "-" + i.getNumCredito())) { l.setNbNonAffectes(l.getNbNonAffectes() + 1); nonAffectes++; }
        }
        for (EcheanceAvenirDto e : mesEch) {
            Ligne l = parPs.get(e.getCodAgencia());
            if (l == null) continue;
            l.setNbEcheances(l.getNbEcheances() + 1);
            l.setMntEcheances(l.getMntEcheances().add(nvl(e.getMonCuota())));
            if (!agents.containsKey(e.getCodAgencia() + "-" + e.getNumCredito())) { l.setNbNonAffectes(l.getNbNonAffectes() + 1); nonAffectes++; }
        }
        List<Ligne> lignes = new ArrayList<>();
        for (Ligne l : parPs.values()) {
            if (l.getNbImpayes() == 0 && l.getNbEcheances() == 0) continue;
            IndicateursAgenceDto ind = indicateurs.get(l.getCle());
            if (ind != null) { l.setEncours(ind.getEncoursTotal()); l.setEncoursPar30(ind.getEncoursPar30()); }
            l.setAlerte(l.getNbImpayes() >= seuilNb || l.getMntImpayes().compareTo(BigDecimal.valueOf(seuilMontant)) >= 0);
            lignes.add(l);
        }
        lignes.sort(Comparator.comparing(Ligne::getMntImpayes).reversed());

        // Par agent
        Map<Long, LigneAgent> parAgent = new LinkedHashMap<>();
        Map<Long, Charge> charges = repository.chargeParAgent(codes);
        LigneAgent nonAffecte = LigneAgent.builder().nom("Non affecté").pointService("").build();
        Set<String> psNonAffecte = new java.util.TreeSet<>();
        for (NouvelImpayeDto i : mesImp) {
            Agent a = agents.get(i.getCodAgencia() + "-" + i.getNumCredito());
            if (a == null) { nonAffecte.setNbImpayes(nonAffecte.getNbImpayes() + 1); psNonAffecte.add(libelle(hier, i.getCodAgencia())); continue; }
            LigneAgent la = parAgent.computeIfAbsent(a.userId(), k -> ligneAgent(a, hier.get(i.getCodAgencia()), charges.get(a.userId())));
            la.setNbImpayes(la.getNbImpayes() + 1);
        }
        for (EcheanceAvenirDto e : mesEch) {
            Agent a = agents.get(e.getCodAgencia() + "-" + e.getNumCredito());
            if (a == null) { nonAffecte.setNbEcheances(nonAffecte.getNbEcheances() + 1); psNonAffecte.add(libelle(hier, e.getCodAgencia())); continue; }
            LigneAgent la = parAgent.computeIfAbsent(a.userId(), k -> ligneAgent(a, hier.get(e.getCodAgencia()), charges.get(a.userId())));
            la.setNbEcheances(la.getNbEcheances() + 1);
        }
        List<LigneAgent> agentsLignes = new ArrayList<>(parAgent.values());
        agentsLignes.sort(Comparator.comparing(LigneAgent::getNbImpayes).reversed());
        if (nonAffecte.getNbImpayes() + nonAffecte.getNbEcheances() > 0) {
            nonAffecte.setPointService(String.join(", ", psNonAffecte));
            agentsLignes.add(nonAffecte);
        }

        Synthese s = totaux(libellePerimetre, lignes, nonAffectes);
        s.setAgents(agentsLignes);
        s.setCorpsHtml(html(s, "Point de service", "Par point de service", true, joursAvant,
                uiUrl + "/dashboards/portefeuille-saf", uiUrl + "/dashboards/portefeuille-affectation"));
        return s;
    }

    /** Synthese agregee par agence (DR) ou par delegation (DE) : une ligne par groupe, avec le DA / le nombre d'agences. */
    public Synthese pourGroupes(String libellePerimetre, Collection<String> codes, boolean parDelegation,
                                List<EcheanceAvenirDto> echeances, List<NouvelImpayeDto> impayes,
                                Map<String, IndicateursAgenceDto> indicateurs, int joursAvant) {
        Map<String, PointVenteHierarchie> hier = hierarchie(codes);
        Map<String, Agent> agents = repository.agentsParCredit(codes);
        Map<Long, String> das = parDelegation ? Map.of() : repository.daParAgence();
        List<EcheanceAvenirDto> mesEch = echeances.stream().filter(e -> codes.contains(e.getCodAgencia())).toList();
        List<NouvelImpayeDto> mesImp = impayes.stream().filter(i -> codes.contains(i.getCodAgencia())).toList();
        if (mesEch.isEmpty() && mesImp.isEmpty()) return null;

        Function<String, Long> groupeDe = code -> {
            PointVenteHierarchie h = hier.get(code);
            return h == null ? null : parDelegation ? h.delegationId() : h.agenceId();
        };
        Map<Long, Ligne> groupes = new LinkedHashMap<>();
        for (PointVenteHierarchie h : hier.values()) {
            Long g = parDelegation ? h.delegationId() : h.agenceId();
            if (g == null || groupes.containsKey(g)) continue;
            groupes.put(g, Ligne.builder().cle(String.valueOf(g)).libelle(parDelegation ? h.delegation() : h.agence())
                    .complement(parDelegation ? "" : nvl(das.get(g))).mntImpayes(BigDecimal.ZERO).mntEcheances(BigDecimal.ZERO)
                    .encours(BigDecimal.ZERO).encoursPar30(BigDecimal.ZERO).build());
        }
        for (PointVenteHierarchie h : hier.values()) {
            Long g = parDelegation ? h.delegationId() : h.agenceId();
            IndicateursAgenceDto ind = indicateurs.get(h.code());
            Ligne l = g == null ? null : groupes.get(g);
            if (l != null && ind != null) {
                l.setEncours(l.getEncours().add(nvl(ind.getEncoursTotal())));
                l.setEncoursPar30(l.getEncoursPar30().add(nvl(ind.getEncoursPar30())));
            }
        }
        long nonAffectes = 0;
        for (NouvelImpayeDto i : mesImp) {
            Ligne l = groupes.get(groupeDe.apply(i.getCodAgencia()));
            if (l == null) continue;
            l.setNbImpayes(l.getNbImpayes() + 1);
            l.setMntImpayes(l.getMntImpayes().add(nvl(i.getMntImpaye())));
            if (!agents.containsKey(i.getCodAgencia() + "-" + i.getNumCredito())) { l.setNbNonAffectes(l.getNbNonAffectes() + 1); nonAffectes++; }
        }
        for (EcheanceAvenirDto e : mesEch) {
            Ligne l = groupes.get(groupeDe.apply(e.getCodAgencia()));
            if (l == null) continue;
            l.setNbEcheances(l.getNbEcheances() + 1);
            l.setMntEcheances(l.getMntEcheances().add(nvl(e.getMonCuota())));
            if (!agents.containsKey(e.getCodAgencia() + "-" + e.getNumCredito())) { l.setNbNonAffectes(l.getNbNonAffectes() + 1); nonAffectes++; }
        }
        List<Ligne> lignes = groupes.values().stream().filter(l -> l.getNbImpayes() + l.getNbEcheances() > 0)
                .peek(l -> l.setAlerte(l.getNbImpayes() >= seuilNb * 3L || l.getMntImpayes().compareTo(BigDecimal.valueOf(seuilMontant * 3)) >= 0))
                .sorted(Comparator.comparing(Ligne::getMntImpayes).reversed()).collect(Collectors.toList());
        Synthese s = totaux(libellePerimetre, lignes, nonAffectes);
        s.setAgents(List.of());
        s.setCorpsHtml(html(s, parDelegation ? "Délégation" : "Agence", parDelegation ? "Par délégation" : "Par agence", false, joursAvant,
                uiUrl + "/dashboards/portefeuille-saf", null));
        return s;
    }

    // ==================== construction ====================

    private Map<String, PointVenteHierarchie> hierarchie(Collection<String> codes) {
        return perimetre.hierarchie(codes).stream()
                .collect(Collectors.toMap(PointVenteHierarchie::code, Function.identity(), (a, b) -> a, LinkedHashMap::new));
    }

    private static LigneAgent ligneAgent(Agent a, PointVenteHierarchie h, Charge c) {
        return LigneAgent.builder().nom(a.nom()).pointService(h == null ? "" : h.libelle())
                .nbRetardPortefeuille(c == null ? null : c.nbEnRetard()).nbCreditsPortefeuille(c == null ? null : c.nbCredits()).build();
    }

    private static String libelle(Map<String, PointVenteHierarchie> hier, String code) {
        PointVenteHierarchie h = hier.get(code);
        return h == null ? code : h.libelle();
    }

    private Synthese totaux(String libellePerimetre, List<Ligne> lignes, long nonAffectes) {
        long nbImp = lignes.stream().mapToLong(Ligne::getNbImpayes).sum();
        BigDecimal mntImp = lignes.stream().map(Ligne::getMntImpayes).reduce(BigDecimal.ZERO, BigDecimal::add);
        long nbEch = lignes.stream().mapToLong(Ligne::getNbEcheances).sum();
        BigDecimal mntEch = lignes.stream().map(Ligne::getMntEcheances).reduce(BigDecimal.ZERO, BigDecimal::add);
        int alertes = (int) lignes.stream().filter(Ligne::isAlerte).count();
        String jour = LocalDate.now().format(FMT);
        String sujet = libellePerimetre + " — alertes du " + jour + " : " + nbImp + " impayé(s) (" + millions(mntImp) + "), "
                + nbEch + " échéance(s) (" + millions(mntEch) + ")" + (alertes > 0 ? " ⚠ " + alertes + " au-dessus du seuil" : "");
        return Synthese.builder().titre(libellePerimetre + " — alertes du " + jour).sujet(sujet)
                .nbImpayes(nbImp).mntImpayes(mntImp).nbEcheances(nbEch).mntEcheances(mntEch)
                .nbNonAffectes(nonAffectes).nbAlertes(alertes).lignes(lignes).build();
    }

    private String html(Synthese s, String enteteLigne, String titreTableau, boolean avecAgents, int joursAvant,
                        String lienPortefeuille, String lienAffectation) {
        StringBuilder h = new StringBuilder();
        h.append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#1E6B4F;margin:0 0 10px'>").append(s.getTitre()).append("</h2>")
                .append("<div style='display:flex;flex-wrap:wrap;gap:10px;margin:8px 0 14px'>")
                .append(chiffre("Passés en impayé hier", s.getNbImpayes() + " crédit(s) · " + montant(s.getMntImpayes()), true))
                .append(chiffre("Échéances à J+" + joursAvant, s.getNbEcheances() + " crédit(s) · " + montant(s.getMntEcheances()), false))
                .append(chiffre("Non affectés parmi eux", String.valueOf(s.getNbNonAffectes()), false))
                .append("</div>");
        if (s.getNbAlertes() > 0) {
            h.append("<p style='color:#B3261E'><b>").append(s.getNbAlertes()).append(" ligne(s) au-dessus du seuil d'alerte</b> (")
                    .append(seuilNb).append(" impayés ou ").append(montant(BigDecimal.valueOf(seuilMontant))).append(" GNF en un jour").append(")</p>");
        }
        h.append("<h3 style='color:#B3261E;font-size:14px;margin:14px 0 6px'>").append(titreTableau).append("</h3>");
        h.append("<table style='border-collapse:collapse;font-size:13px'><tr>");
        for (String e : new String[]{enteteLigne, avecAgents ? "Code" : "Directeur", "Impayés hier", "Montant (GNF)", "Échéances J+" + joursAvant, "Montant (GNF)", "Non affectés", "PAR 30"}) {
            h.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#EAF2ED;text-align:left'>").append(e).append("</th>");
        }
        h.append("</tr>");
        for (Ligne l : s.getLignes()) {
            String style = l.isAlerte() ? "border:1px solid #D8DED8;padding:4px 8px;background:#FBE9E7;color:#B3261E" : "border:1px solid #D8DED8;padding:4px 8px";
            h.append("<tr>")
                    .append(cell(style, nvl(l.getLibelle()) + (l.isAlerte() ? " ⚠" : "")))
                    .append(cell(style, nvl(l.getComplement())))
                    .append(cell(style + ";text-align:right", String.valueOf(l.getNbImpayes())))
                    .append(cell(style + ";text-align:right", montant(l.getMntImpayes())))
                    .append(cell(style + ";text-align:right", String.valueOf(l.getNbEcheances())))
                    .append(cell(style + ";text-align:right", montant(l.getMntEcheances())))
                    .append(cell(style + ";text-align:right", String.valueOf(l.getNbNonAffectes())))
                    .append(cell(style + ";text-align:right", pourcent(l.getEncoursPar30(), l.getEncours())))
                    .append("</tr>");
        }
        h.append("</table>");
        if (avecAgents && !s.getAgents().isEmpty()) {
            h.append("<h3 style='color:#1E6B4F;font-size:14px;margin:14px 0 6px'>Par agent de crédit</h3>");
            h.append("<table style='border-collapse:collapse;font-size:13px'><tr>");
            for (String e : new String[]{"Agent", "Point de service", "Impayés hier", "Échéances J+" + joursAvant, "En retard dans son portefeuille"}) {
                h.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#EAF2ED;text-align:left'>").append(e).append("</th>");
            }
            h.append("</tr>");
            String st = "border:1px solid #D8DED8;padding:4px 8px";
            for (LigneAgent a : s.getAgents()) {
                String portefeuille = a.getNbRetardPortefeuille() == null ? "—" : a.getNbRetardPortefeuille() + " / " + a.getNbCreditsPortefeuille();
                h.append("<tr>").append(cell(st, nvl(a.getNom()))).append(cell(st, nvl(a.getPointService())))
                        .append(cell(st + ";text-align:right", String.valueOf(a.getNbImpayes())))
                        .append(cell(st + ";text-align:right", String.valueOf(a.getNbEcheances())))
                        .append(cell(st + ";text-align:right", portefeuille)).append("</tr>");
            }
            h.append("</table>");
        }
        h.append("<p style='color:#5C6B60;font-size:12px;margin-top:12px'>PAR 30 : part de l'encours du périmètre portée par des crédits en retard de plus de 30 jours, lue dans SAF. ")
                .append("Détail crédit par crédit : <a href='").append(lienPortefeuille).append("'>Portefeuille crédits SAF</a>");
        if (lienAffectation != null) h.append(" ; affectations : <a href='").append(lienAffectation).append("'>Affectation du portefeuille</a>");
        h.append(".</p></div>");
        return h.toString();
    }

    private static String chiffre(String libelle, String valeur, boolean rouge) {
        return "<div style='border:1px solid #D8DED8;border-radius:4px;padding:6px 12px;min-width:150px'>"
                + "<div style='font-size:11px;color:#5C6B60;text-transform:uppercase'>" + libelle + "</div>"
                + "<div style='font-size:17px;font-weight:bold;" + (rouge ? "color:#B3261E" : "") + "'>" + valeur + "</div></div>";
    }

    private static String cell(String style, String v) {
        return "<td style='" + style + "'>" + v + "</td>";
    }

    private static String montant(BigDecimal v) {
        return v == null ? "0" : NumberFormat.getIntegerInstance(Locale.FRANCE).format(v.longValue());
    }

    private static String millions(BigDecimal v) {
        if (v == null) return "0";
        double m = v.doubleValue() / 1_000_000d;
        return m >= 10 ? String.format(Locale.FRANCE, "%.0f M", m) : String.format(Locale.FRANCE, "%.1f M", m);
    }

    private static String pourcent(BigDecimal part, BigDecimal total) {
        if (part == null || total == null || total.signum() == 0) return "—";
        return String.format(Locale.FRANCE, "%.1f %%", part.doubleValue() * 100 / total.doubleValue());
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}
