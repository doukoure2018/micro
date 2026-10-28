package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Correction du numero de membre d'un dossier de credit (V185).
 *
 * <p>Le numero identifie le client du credit : il n'etait ecrit qu'a la creation, et plus
 * rien ne permettait de le corriger. Ce depot porte la lecture du dossier, l'ecriture du
 * nouveau numero et la trace nominative de chaque correction.</p>
 */
@Repository
@RequiredArgsConstructor
public class CorrectionNumeroMembreRepository {

    private final JdbcClient jdbcClient;

    /** Ce qu'il faut savoir d'un dossier pour decider qui peut corriger son numero. */
    public record Dossier(Long id, String numeroMembre, String nom, String prenom, String etat,
                          Long agenceId, Long delegationId, Long agentId, Long saisiPar,
                          boolean membreInconnuSaf) {
        public String client() {
            return ((nom == null ? "" : nom) + " " + (prenom == null ? "" : prenom)).trim();
        }
    }

    public Optional<Dossier> dossier(Long demandeId) {
        return jdbcClient.sql("""
                        SELECT d.demandeindividuel_id, d.numero_membre, d.nom, d.prenom,
                               COALESCE(d.validation_state, '') AS etat,
                               d.agence, d.delegation, d.agent_credit_affecte, d.saisie_par,
                               COALESCE(d.membre_inconnu_saf, FALSE) AS membre_inconnu_saf
                          FROM demandeindividuel d
                         WHERE d.demandeindividuel_id = :id
                        """)
                .param("id", demandeId)
                .query((rs, n) -> new Dossier(rs.getLong("demandeindividuel_id"),
                        rs.getString("numero_membre"), rs.getString("nom"), rs.getString("prenom"),
                        rs.getString("etat"), (Long) rs.getObject("agence"),
                        (Long) rs.getObject("delegation"), (Long) rs.getObject("agent_credit_affecte"),
                        (Long) rs.getObject("saisie_par"), rs.getBoolean("membre_inconnu_saf")))
                .optional();
    }

    /**
     * Ecrit le nouveau numero et le marque verifie : il vient d'etre confronte a SAF, inutile
     * d'attendre la reprise horaire pour le savoir.
     */
    public void corriger(Long demandeId, String nouveauNumero, String nomSaf, String agenceSaf) {
        jdbcClient.sql("""
                        UPDATE demandeindividuel
                           SET numero_membre = :numero,
                               membre_verifie_saf = TRUE,
                               membre_inconnu_saf = FALSE,
                               membre_nom_saf = :nom,
                               membre_agence_saf = :agence,
                               membre_verifie_at = CURRENT_TIMESTAMP,
                               membre_reverifie_at = CURRENT_TIMESTAMP,
                               membre_signale_at = NULL
                         WHERE demandeindividuel_id = :id
                        """)
                .param("numero", nouveauNumero).param("nom", nomSaf)
                .param("agence", agenceSaf).param("id", demandeId).update();
    }

    public void tracer(Long demandeId, String ancien, String nouveau, String nomSaf,
                       String agenceSaf, String motif, Long parUserId, String parNom, String parRole) {
        jdbcClient.sql("""
                        INSERT INTO demande_numero_membre_correction
                               (demandeindividuel_id, ancien_numero, nouveau_numero, nom_saf,
                                cod_agencia_saf, motif, par_user_id, par_nom, par_role)
                        VALUES (:id, :ancien, :nouveau, :nom, :agence, :motif, :par, :parNom, :role)
                        """)
                .param("id", demandeId).param("ancien", ancien).param("nouveau", nouveau)
                .param("nom", nomSaf).param("agence", agenceSaf).param("motif", motif)
                .param("par", parUserId).param("parNom", parNom).param("role", parRole)
                .update();
    }

    /** Une correction passee, telle que l'ecran du dossier la montre. */
    public record Trace(String ancienNumero, String nouveauNumero, String nomSaf, String motif,
                        String parNom, String parRole, OffsetDateTime dateCorrection) {}

    public List<Trace> corrections(Long demandeId) {
        return jdbcClient.sql("""
                        SELECT ancien_numero, nouveau_numero, nom_saf, motif, par_nom, par_role, date_correction
                          FROM demande_numero_membre_correction
                         WHERE demandeindividuel_id = :id
                         ORDER BY date_correction DESC
                        """)
                .param("id", demandeId)
                .query((rs, n) -> new Trace(rs.getString("ancien_numero"), rs.getString("nouveau_numero"),
                        rs.getString("nom_saf"), rs.getString("motif"), rs.getString("par_nom"),
                        rs.getString("par_role"),
                        rs.getObject("date_correction", OffsetDateTime.class)))
                .list();
    }
}
