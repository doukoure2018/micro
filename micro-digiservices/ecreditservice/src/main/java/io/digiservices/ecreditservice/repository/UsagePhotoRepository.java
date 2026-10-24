package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.ResumeDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.UsageSemaineDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Photographie hebdomadaire de l'usage (V176, lot 2) : une semaine figee une fois pour toutes,
 * pour le reseau (delegation_id NULL) et pour chaque delegation.
 *
 * <p>Pourquoi figer : le passe bouge. Une fiche corrigee, un dossier annule, une affectation
 * close changent apres coup les chiffres d'une semaine deja close ; sans photographie, deux
 * rapports successifs ne diraient plus la meme chose de la meme semaine.</p>
 */
@Repository
@RequiredArgsConstructor
public class UsagePhotoRepository {

    private final JdbcClient jdbcClient;

    /** Delegations du reseau, pour photographier chacune. */
    public Map<Long, String> delegations() {
        Map<Long, String> m = new LinkedHashMap<>();
        jdbcClient.sql("SELECT id, libele FROM delegation ORDER BY libele")
                .query((rs, n) -> m.put(rs.getLong("id"), rs.getString("libele")))
                .list();
        return m;
    }

    /** Semaines deja photographiees pour un perimetre. */
    public List<LocalDate> semainesConnues(Long delegationId) {
        return jdbcClient.sql("""
                SELECT debut FROM usage_semaine
                WHERE (:delegationId IS NULL AND delegation_id IS NULL)
                   OR (:delegationId IS NOT NULL AND delegation_id = :delegationId)
                ORDER BY debut
                """)
                .param("delegationId", delegationId)
                .query((rs, n) -> rs.getDate("debut").toLocalDate())
                .list();
    }

    public boolean vide() {
        return jdbcClient.sql("SELECT count(*) FROM usage_semaine").query(Integer.class).single() == 0;
    }

    /** Fige une semaine ; une photographie deja prise est remplacee (reprise, correction). */
    public void enregistrer(UsageSemaineDto d, Long delegationId, boolean tronquee) {
        jdbcClient.sql("""
                INSERT INTO usage_semaine (
                    debut, fin, delegation_id, tronquee,
                    connexions, utilisateurs_actifs, comptes_actifs, jamais_connectes, agents_comptes, agents_actifs,
                    ps_producteurs, ps_total,
                    dossiers_crees, dossiers_groupe, dossiers_fonctionnaire, dossiers_valides, montant_valide,
                    evenements, acteurs, rejets, annulations, reattributions, delai_median_jours, delai_moyen_jours,
                    affectations, da_ayant_affecte, affectations_closes, affectations_actives, agents_porteurs, agents_notes,
                    alertes_agents, alertes_da, alertes_dr, alertes_de, alertes_techniques, jours_avec_digest,
                    fiches_corrigees, corrections_annulees, telephones_demandes, signalements, calcule_at)
                VALUES (
                    :debut, :fin, :delegationId, :tronquee,
                    :connexions, :utilisateursActifs, :comptesActifs, :jamaisConnectes, :agentsComptes, :agentsActifs,
                    :psProducteurs, :psTotal,
                    :dossiersCrees, :dossiersGroupe, :dossiersFonctionnaire, :dossiersValides, :montantValide,
                    :evenements, :acteurs, :rejets, :annulations, :reattributions, :delaiMedian, :delaiMoyen,
                    :affectations, :daAyantAffecte, :affectationsCloses, :affectationsActives, :agentsPorteurs, :agentsNotes,
                    :alertesAgents, :alertesDa, :alertesDr, :alertesDe, :alertesTechniques, :joursAvecDigest,
                    :fichesCorrigees, :correctionsAnnulees, :telephonesDemandes, :signalements, CURRENT_TIMESTAMP)
                ON CONFLICT (debut, delegation_id) DO UPDATE SET
                    fin = EXCLUDED.fin, tronquee = EXCLUDED.tronquee,
                    connexions = EXCLUDED.connexions, utilisateurs_actifs = EXCLUDED.utilisateurs_actifs,
                    comptes_actifs = EXCLUDED.comptes_actifs, jamais_connectes = EXCLUDED.jamais_connectes,
                    agents_comptes = EXCLUDED.agents_comptes, agents_actifs = EXCLUDED.agents_actifs,
                    ps_producteurs = EXCLUDED.ps_producteurs, ps_total = EXCLUDED.ps_total,
                    dossiers_crees = EXCLUDED.dossiers_crees, dossiers_groupe = EXCLUDED.dossiers_groupe,
                    dossiers_fonctionnaire = EXCLUDED.dossiers_fonctionnaire, dossiers_valides = EXCLUDED.dossiers_valides,
                    montant_valide = EXCLUDED.montant_valide,
                    evenements = EXCLUDED.evenements, acteurs = EXCLUDED.acteurs, rejets = EXCLUDED.rejets,
                    annulations = EXCLUDED.annulations, reattributions = EXCLUDED.reattributions,
                    delai_median_jours = EXCLUDED.delai_median_jours, delai_moyen_jours = EXCLUDED.delai_moyen_jours,
                    affectations = EXCLUDED.affectations, da_ayant_affecte = EXCLUDED.da_ayant_affecte,
                    affectations_closes = EXCLUDED.affectations_closes, affectations_actives = EXCLUDED.affectations_actives,
                    agents_porteurs = EXCLUDED.agents_porteurs, agents_notes = EXCLUDED.agents_notes,
                    alertes_agents = EXCLUDED.alertes_agents, alertes_da = EXCLUDED.alertes_da,
                    alertes_dr = EXCLUDED.alertes_dr, alertes_de = EXCLUDED.alertes_de,
                    alertes_techniques = EXCLUDED.alertes_techniques, jours_avec_digest = EXCLUDED.jours_avec_digest,
                    fiches_corrigees = EXCLUDED.fiches_corrigees, corrections_annulees = EXCLUDED.corrections_annulees,
                    telephones_demandes = EXCLUDED.telephones_demandes, signalements = EXCLUDED.signalements,
                    calcule_at = CURRENT_TIMESTAMP
                """)
                .param("debut", d.getDebut()).param("fin", d.getFin())
                .param("delegationId", delegationId).param("tronquee", tronquee)
                .param("connexions", d.getConnexions()).param("utilisateursActifs", d.getUtilisateursActifs())
                .param("comptesActifs", d.getComptesActifs()).param("jamaisConnectes", d.getJamaisConnectes())
                .param("agentsComptes", d.getAgentsComptes()).param("agentsActifs", d.getAgentsActifs())
                .param("psProducteurs", d.getPsProducteurs()).param("psTotal", d.getPsTotal())
                .param("dossiersCrees", d.getDossiersCrees()).param("dossiersGroupe", d.getDossiersGroupe())
                .param("dossiersFonctionnaire", d.getDossiersFonctionnaire()).param("dossiersValides", d.getDossiersValides())
                .param("montantValide", d.getMontantValide())
                .param("evenements", d.getEvenements()).param("acteurs", d.getActeurs()).param("rejets", d.getRejets())
                .param("annulations", d.getAnnulations()).param("reattributions", d.getReattributions())
                .param("delaiMedian", d.getDelaiMedianJours()).param("delaiMoyen", d.getDelaiMoyenJours())
                .param("affectations", d.getAffectations()).param("daAyantAffecte", d.getDaAyantAffecte())
                .param("affectationsCloses", d.getAffectationsCloses()).param("affectationsActives", d.getAffectationsActives())
                .param("agentsPorteurs", d.getAgentsPorteurs()).param("agentsNotes", d.getAgentsNotes())
                .param("alertesAgents", d.getAlertesAgents()).param("alertesDa", d.getAlertesDa())
                .param("alertesDr", d.getAlertesDr()).param("alertesDe", d.getAlertesDe())
                .param("alertesTechniques", d.getAlertesTechniques()).param("joursAvecDigest", d.getJoursAvecDigest())
                .param("fichesCorrigees", d.getFichesCorrigees()).param("correctionsAnnulees", d.getCorrectionsAnnulees())
                .param("telephonesDemandes", d.getTelephonesDemandes()).param("signalements", d.getSignalements())
                .update();
    }

    /** Les {@code nb} dernieres semaines figees d'un perimetre, de la plus ancienne a la plus recente. */
    public List<ResumeDto> tendance(Long delegationId, int nb) {
        List<ResumeDto> liste = jdbcClient.sql("""
                SELECT debut, fin, connexions, utilisateurs_actifs, agents_actifs,
                       dossiers_crees, dossiers_valides, ps_producteurs, affectations,
                       (alertes_agents + alertes_da + alertes_dr + alertes_de + alertes_techniques) AS alertes
                FROM usage_semaine
                WHERE ((:delegationId IS NULL AND delegation_id IS NULL)
                    OR (:delegationId IS NOT NULL AND delegation_id = :delegationId))
                ORDER BY debut DESC
                LIMIT :nb
                """)
                .param("delegationId", delegationId).param("nb", nb)
                .query((rs, n) -> ResumeDto.builder()
                        .debut(rs.getDate("debut").toLocalDate()).fin(rs.getDate("fin").toLocalDate())
                        .connexions(rs.getInt("connexions")).utilisateursActifs(rs.getInt("utilisateurs_actifs"))
                        .agentsActifs(rs.getInt("agents_actifs"))
                        .dossiersCrees(rs.getInt("dossiers_crees")).dossiersValides(rs.getInt("dossiers_valides"))
                        .psProducteurs(rs.getInt("ps_producteurs")).affectations(rs.getInt("affectations"))
                        .alertesEnvoyees(rs.getInt("alertes"))
                        .build())
                .list();
        java.util.Collections.reverse(liste);
        return liste;
    }

    /** La photographie d'une semaine, si elle a ete prise. */
    public ResumeDto photo(Long delegationId, LocalDate debut) {
        return jdbcClient.sql("""
                SELECT debut, fin, connexions, utilisateurs_actifs, agents_actifs,
                       dossiers_crees, dossiers_valides, ps_producteurs, affectations,
                       (alertes_agents + alertes_da + alertes_dr + alertes_de + alertes_techniques) AS alertes
                FROM usage_semaine
                WHERE debut = :debut
                  AND ((:delegationId IS NULL AND delegation_id IS NULL)
                    OR (:delegationId IS NOT NULL AND delegation_id = :delegationId))
                """)
                .param("delegationId", delegationId).param("debut", debut)
                .query((rs, n) -> ResumeDto.builder()
                        .debut(rs.getDate("debut").toLocalDate()).fin(rs.getDate("fin").toLocalDate())
                        .connexions(rs.getInt("connexions")).utilisateursActifs(rs.getInt("utilisateurs_actifs"))
                        .agentsActifs(rs.getInt("agents_actifs"))
                        .dossiersCrees(rs.getInt("dossiers_crees")).dossiersValides(rs.getInt("dossiers_valides"))
                        .psProducteurs(rs.getInt("ps_producteurs")).affectations(rs.getInt("affectations"))
                        .alertesEnvoyees(rs.getInt("alertes"))
                        .build())
                .optional().orElse(null);
    }
}
