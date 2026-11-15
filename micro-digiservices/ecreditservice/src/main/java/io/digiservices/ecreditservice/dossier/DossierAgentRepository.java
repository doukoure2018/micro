package io.digiservices.ecreditservice.dossier;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Les dossiers de crédit d'un agent, vus du téléphone.
 *
 * <p>Volontairement étroit : la fonction du web ({@code get_all_demandes_with_garanties}, V148)
 * rend tout le dossier et ses garanties en JSON, ce qui n'a pas de sens sur un forfait de
 * terrain. Ici, une ligne par dossier et rien de plus que ce que l'écran montre.</p>
 */
@Repository
@RequiredArgsConstructor
public class DossierAgentRepository {

    private final JdbcClient jdbcClient;

    /** Un dossier tel que son agent le relit : où il en est, et ce qu'on lui demande. */
    public record DossierVue(Long id, String nom, String prenom, String numeroMembre,
                             String telephone, BigDecimal montantDemande, BigDecimal montantPropose,
                             String objetCredit, OffsetDateTime createdAt, String statutDemande,
                             String validationState, String etape, String libelleEtat,
                             boolean attendLAgent, String aCorriger, String motifRenvoi,
                             OffsetDateTime derniereDecisionAt, int joursDansLEtape) {
    }

    /**
     * Les dossiers de l'agent. {@code cloture} sépare comme le web : en cours d'un côté,
     * approuvés, rejetés et annulés de l'autre.
     */
    public List<DossierVue> dossiersDeLAgent(Long agentUserId, boolean clotures, int limite) {
        return jdbcClient.sql("""
                        SELECT d.demandeindividuel_id, d.nom, d.prenom, d.numero_membre, d.telephone,
                               d.montant_demande, d.montant_propose, d.object_credit, d.createdat,
                               COALESCE(d.statut_demande, 'EN_ATTENTE') AS statut_demande,
                               COALESCE(d.validation_state, 'NOUVEAU') AS validation_state,
                               d.motif_rejet_dg, d.motif_rejet_de, d.renvoi_agent_motif,
                               COALESCE(d.sections_a_revoir_de, d.sections_a_revoir_dr,
                                        d.sections_a_revoir_da) AS a_corriger,
                               GREATEST(COALESCE(d.date_validation_de, d.createdat),
                                        COALESCE(d.date_validation_dr, d.createdat),
                                        COALESCE(d.date_validation_da, d.createdat),
                                        d.createdat) AS derniere_decision_at
                          FROM demandeindividuel d
                         WHERE d.agent_credit_affecte = :agent
                           AND (CASE WHEN CAST(:clotures AS BOOLEAN) THEN
                                     COALESCE(d.statut_demande,'') IN ('REJET','REJECTED','ANNULE')
                                     OR COALESCE(d.validation_state,'') = 'VALIDATED_FINAL'
                                ELSE
                                     COALESCE(d.statut_demande,'') NOT IN ('REJET','REJECTED','ANNULE')
                                     AND COALESCE(d.validation_state,'') <> 'VALIDATED_FINAL'
                                END)
                         ORDER BY d.createdat DESC
                         LIMIT :limite
                        """)
                .param("agent", agentUserId).param("clotures", clotures).param("limite", limite)
                .query((rs, n) -> {
                    String statut = rs.getString("statut_demande");
                    String etat = rs.getString("validation_state");
                    OffsetDateTime decision = rs.getObject("derniere_decision_at", OffsetDateTime.class);
                    return new DossierVue(
                            rs.getLong("demandeindividuel_id"), rs.getString("nom"),
                            rs.getString("prenom"), rs.getString("numero_membre"),
                            rs.getString("telephone"), rs.getBigDecimal("montant_demande"),
                            rs.getBigDecimal("montant_propose"), rs.getString("object_credit"),
                            rs.getObject("createdat", OffsetDateTime.class), statut, etat,
                            EtatDossier.etape(statut, etat),
                            EtatDossier.libelle(statut, etat, rs.getString("motif_rejet_dg"),
                                    rs.getString("motif_rejet_de")),
                            EtatDossier.attendLAgent(statut, etat),
                            rs.getString("a_corriger"), rs.getString("renvoi_agent_motif"),
                            decision, jours(decision));
                })
                .list();
    }

    /**
     * Depuis combien de jours le dossier n'a pas bougé. C'est ce chiffre, et non l'état, qui
     * dit à l'agent lequel de ses dossiers s'est enlisé.
     */
    private static int jours(OffsetDateTime depuis) {
        if (depuis == null) {
            return 0;
        }
        return (int) java.time.Duration.between(depuis, OffsetDateTime.now()).toDays();
    }
}
