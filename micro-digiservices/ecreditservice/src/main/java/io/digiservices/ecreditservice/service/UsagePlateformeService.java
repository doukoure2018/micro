package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.DelegationDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.ExecutionDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.JourDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.ResumeDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.RoleDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.UsageSemaineDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.UsagePlateformeRepository;
import io.digiservices.ecreditservice.utils.UsagePlateformeExcelUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Barometre d'usage de digi (V175, lot 1) : ce que la plateforme compte d'elle-meme sur une
 * semaine, en sept familles — adoption, couverture, activite credit, fluidite du circuit, suivi
 * du portefeuille, alertes du portefeuille, qualite des donnees.
 *
 * <p>La semaine court du lundi au dimanche ; pour la semaine en cours, elle s'arrete au jour
 * du jour, et le libelle le dit (« semaine du 19 au 24 octobre 2026 »).</p>
 *
 * <p>Qui voit : la DG, la DE, la DSIG et les SUPER_ADMIN sur tout le reseau ; le DR sur sa
 * delegation, et sans les montants. Les autres roles n'y ont pas acces.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UsagePlateformeService {

    private static final Locale FR = Locale.FRENCH;
    /** Le journal des alertes commence avec la V175 : avant, rien n'etait enregistre. */
    private static final LocalDate DEBUT_JOURNAL_ALERTES = LocalDate.of(2026, 10, 24);

    private final UsagePlateformeRepository repository;
    private final UserClient userClient;

    /** Perimetre de lecture : null = tout le reseau. */
    private record Perimetre(Long delegationId, String libelle, boolean montants) {
    }

    private Perimetre perimetreDe(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        String role = user.getRole();
        boolean reseau = "DG".equals(role) || "SUPER_ADMIN".equals(role)
                || ("MANAGER".equals(role) && user.getService() != null
                    && ("DE".equalsIgnoreCase(user.getService()) || "DSIG".equalsIgnoreCase(user.getService())));
        if (reseau) {
            return new Perimetre(null, "Réseau", true);
        }
        if ("DR".equals(role)) {
            if (user.getDelegationId() == null) {
                throw new ApiException("Votre compte n'est rattache a aucune delegation");
            }
            return new Perimetre(user.getDelegationId(), "Votre délégation", false);
        }
        throw new ApiException("Le barometre d'usage est reserve a la direction generale, "
                + "a la Direction de l'exploitation, a la DSIG et aux directeurs regionaux");
    }

    /** Le barometre de la semaine qui contient {@code jour} (par defaut, la semaine en cours). */
    public UsageSemaineDto semaine(String uuid, LocalDate jour) {
        Perimetre p = perimetreDe(uuid);
        LocalDate reference = jour == null ? LocalDate.now() : jour;
        LocalDate debut = reference.with(DayOfWeek.MONDAY);
        LocalDate finExclue = debut.plusDays(7);
        LocalDate aujourdhui = LocalDate.now();
        if (finExclue.isAfter(aujourdhui)) {
            finExclue = aujourdhui.plusDays(1);           // semaine en cours : jusqu'a ce soir
        }
        UsageSemaineDto d = construire(p, debut, finExclue);
        d.setPrecedente(resume(p, debut.minusDays(7), debut));
        return d;
    }

    public byte[] exporter(String uuid, LocalDate jour) throws IOException {
        return UsagePlateformeExcelUtils.classeur(semaine(uuid, jour));
    }

    // ==================== Construction ====================

    private UsageSemaineDto construire(Perimetre p, LocalDate debut, LocalDate finExclue) {
        LocalDateTime d0 = debut.atStartOfDay(), d1 = finExclue.atStartOfDay();
        Long del = p.delegationId();
        LocalDate dernier = finExclue.minusDays(1);

        int[] connexions = repository.connexionsTotal(d0, d1, del);
        List<RoleDto> roles = repository.parRole(d0, d1, del);
        roles.forEach(r -> r.setLibelle(libelleRole(r.getRole())));
        RoleDto agents = roles.stream().filter(r -> "AGENT_CREDIT".equals(r.getRole())).findFirst().orElse(null);
        int[] couverture = repository.couverture(d0, d1, del);
        int[] crees = repository.dossiersCrees(d0, d1, del);
        Object[] valides = repository.validesDansLaPeriode(d0, d1, del);
        Object[] circuit = repository.circuit(d0, d1, del);
        BigDecimal[] delais = repository.delais(d0, d1, del);
        int[] portefeuille = repository.portefeuille(d0, d1, del);
        Map<String, Integer> alertes = repository.alertesParType(d0, d1, del);
        List<ExecutionDto> executions = repository.executions(d0, d1);
        int[] qualite = repository.qualite(d0, d1, del);
        List<DelegationDto> delegations = repository.parDelegation(d0, d1, del);

        Map<LocalDate, Integer> notes = repository.agentsNotesParJour(debut, finExclue, del);
        int agentsNotes = notes.isEmpty() ? 0 : notes.get(notes.keySet().stream().max(LocalDate::compareTo).orElse(debut));

        int alertesAgents = alertes.getOrDefault("DIGEST_AGENT", 0);
        int alertesDa = alertes.getOrDefault("SYNTHESE_DA", 0);
        int alertesDr = alertes.getOrDefault("SYNTHESE_DR", 0);
        int alertesDe = alertes.getOrDefault("SYNTHESE_DE", 0);
        int alertesTech = alertes.getOrDefault("SAF_SANTE", 0) + alertes.getOrDefault("SIGNALEMENT_TEL", 0);

        UsageSemaineDto dto = UsageSemaineDto.builder()
                .debut(debut).fin(dernier)
                .libellePeriode(libellePeriode(debut, dernier))
                .perimetre(p.delegationId() == null ? "Réseau"
                        : delegations.isEmpty() ? p.libelle() : "DR " + delegations.get(0).getLibelle())
                .toutReseau(p.delegationId() == null).montants(p.montants())
                .connexions(connexions[0]).utilisateursActifs(connexions[1])
                .comptesActifs(roles.stream().mapToInt(RoleDto::getComptes).sum())
                .jamaisConnectes(repository.jamaisConnectes(del))
                .agentsComptes(agents == null ? 0 : agents.getComptes())
                .agentsActifs(agents == null ? 0 : agents.getActifs())
                .roles(roles)
                .psProducteurs(couverture[0]).psTotal(couverture[1])
                .dossiersCrees(crees[0]).dossiersGroupe(crees[1]).dossiersFonctionnaire(crees[2])
                .dossiersValides((Integer) valides[0])
                .montantValide(p.montants() ? (BigDecimal) valides[1] : null)
                .evenements((Integer) circuit[0]).acteurs((Integer) circuit[1]).rejets((Integer) circuit[2])
                .annulations((Integer) circuit[3]).reattributions((Integer) circuit[4])
                .delaiMedianJours(delais[0]).delaiMoyenJours(delais[1])
                .affectations(portefeuille[0]).daAyantAffecte(portefeuille[1]).affectationsCloses(portefeuille[2])
                .affectationsActives(portefeuille[3]).agentsPorteurs(portefeuille[4]).agentsNotes(agentsNotes)
                .alertesAgents(alertesAgents).alertesDa(alertesDa).alertesDr(alertesDr).alertesDe(alertesDe)
                .alertesTechniques(alertesTech)
                .alertesEnvoyees(alertesAgents + alertesDa + alertesDr + alertesDe + alertesTech)
                .joursAvecDigest((int) executions.stream()
                        .filter(e -> "DIGEST_QUOTIDIEN".equals(e.getJob()) && "SUCCES".equals(e.getStatut()))
                        .map(ExecutionDto::getJour).distinct().count())
                .executions(executions)
                .fichesCorrigees(qualite[0]).correctionsAnnulees(qualite[1])
                .telephonesDemandes(qualite[2]).signalements(qualite[3])
                .jours(jours(debut, finExclue, del, notes))
                .delegations(delegations)
                .build();

        if (debut.isBefore(DEBUT_JOURNAL_ALERTES)) {
            dto.setAvertissement("Le journal des alertes commence le "
                    + DEBUT_JOURNAL_ALERTES.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                    + " : pour les semaines anterieures, la famille « alertes du portefeuille » est vide.");
        }
        return dto;
    }

    /** Une ligne par journee de la semaine, meme sans activite. */
    private List<JourDto> jours(LocalDate debut, LocalDate finExclue, Long del, Map<LocalDate, Integer> notes) {
        LocalDateTime d0 = debut.atStartOfDay(), d1 = finExclue.atStartOfDay();
        Map<LocalDate, int[]> connexions = repository.connexionsParJour(d0, d1, del);
        Map<LocalDate, int[]> dossiers = repository.dossiersParJour(d0, d1, del);
        List<JourDto> liste = new ArrayList<>();
        for (LocalDate j = debut; j.isBefore(finExclue); j = j.plusDays(1)) {
            int[] c = connexions.getOrDefault(j, new int[]{0, 0});
            int[] dd = dossiers.getOrDefault(j, new int[]{0, 0, 0});
            liste.add(JourDto.builder().jour(j).libelle(libelleJour(j))
                    .connexions(c[0]).utilisateurs(c[1])
                    .dossiersIndividuels(dd[0] - dd[1] - dd[2]).dossiersGroupe(dd[1]).dossiersFonctionnaire(dd[2])
                    .agentsNotes(notes.getOrDefault(j, 0))
                    .build());
        }
        return liste;
    }

    /** Les quelques chiffres d'une semaine, pour la mettre en regard de la suivante. */
    private ResumeDto resume(Perimetre p, LocalDate debut, LocalDate finExclue) {
        LocalDateTime d0 = debut.atStartOfDay(), d1 = finExclue.atStartOfDay();
        Long del = p.delegationId();
        int[] connexions = repository.connexionsTotal(d0, d1, del);
        List<RoleDto> roles = repository.parRole(d0, d1, del);
        RoleDto agents = roles.stream().filter(r -> "AGENT_CREDIT".equals(r.getRole())).findFirst().orElse(null);
        int[] couverture = repository.couverture(d0, d1, del);
        int[] crees = repository.dossiersCrees(d0, d1, del);
        Object[] valides = repository.validesDansLaPeriode(d0, d1, del);
        int[] portefeuille = repository.portefeuille(d0, d1, del);
        Map<String, Integer> alertes = repository.alertesParType(d0, d1, del);
        return ResumeDto.builder().debut(debut).fin(finExclue.minusDays(1))
                .connexions(connexions[0]).utilisateursActifs(connexions[1])
                .agentsActifs(agents == null ? 0 : agents.getActifs())
                .dossiersCrees(crees[0]).dossiersValides((Integer) valides[0])
                .psProducteurs(couverture[0]).affectations(portefeuille[0])
                .alertesEnvoyees(alertes.values().stream().mapToInt(Integer::intValue).sum())
                .build();
    }

    // ==================== Libelles ====================

    private static String libelleJour(LocalDate j) {
        String jour = j.getDayOfWeek().getDisplayName(TextStyle.SHORT, FR);
        return Character.toUpperCase(jour.charAt(0)) + jour.substring(1).replace(".", "") + " " + j.getDayOfMonth();
    }

    static String libellePeriode(LocalDate debut, LocalDate fin) {
        String moisFin = fin.getMonth().getDisplayName(TextStyle.FULL, FR);
        if (debut.getMonth() == fin.getMonth()) {
            return "semaine du " + debut.getDayOfMonth() + " au " + fin.getDayOfMonth() + " " + moisFin
                    + " " + fin.getYear();
        }
        String moisDebut = debut.getMonth().getDisplayName(TextStyle.FULL, FR);
        return "semaine du " + debut.getDayOfMonth() + " " + moisDebut + " au " + fin.getDayOfMonth()
                + " " + moisFin + " " + fin.getYear();
    }

    private static String libelleRole(String role) {
        Map<String, String> libelles = new LinkedHashMap<>(Map.of(
                "AGENT_CREDIT", "Agents de crédit", "DA", "Directeurs d'agence",
                "DR", "Directeurs régionaux", "RA", "Responsables d'antenne",
                "MANAGER", "Managers", "AGENT_CORRECTEUR", "Correcteurs",
                "CAISSE", "Caisse", "SUPER_ADMIN", "Administrateurs",
                "DG", "Direction générale", "USER", "Autres comptes"));
        return libelles.getOrDefault(role, role);
    }
}
