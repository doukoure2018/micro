package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Cautions connues de digi pour un client SAF (lot 2 du 24/10/2026).
 *
 * <p>Digi n'enregistre pas le numero du credit SAF : le rattachement ne peut donc pas se faire
 * credit par credit, mais client par client, par {@code demandeindividuel.numero_membre} qui
 * porte le code client SAF. Sur 6 640 clients ayant un dossier valide dans digi, 6 536 n'en ont
 * qu'un seul ; pour les 104 autres, on ne nomme personne — donner la mauvaise caution enverrait
 * l'agent appeler quelqu'un qui ne garantit pas ce credit.</p>
 */
@Repository
@RequiredArgsConstructor
public class CautionDigiRepository {

    /** Une personne caution telle que l'agent l'a saisie au montage du dossier. */
    public record Caution(String nom, String prenom, String telephone) {
        public String nomComplet() {
            String n = nom == null ? "" : nom.trim();
            String p = prenom == null ? "" : prenom.trim();
            return (n + " " + p).trim();
        }
    }

    /**
     * Ce que digi sait des cautions d'un client. {@code ambigu} vrai quand le client porte
     * plusieurs dossiers valides : on connait des cautions, mais pas celles de CE credit.
     */
    public record CautionsClient(String codCliente, boolean ambigu, Long demandeId,
                                 LocalDate dateDossier, List<Caution> cautions) {
    }

    private final JdbcClient jdbcClient;

    /** Pour chaque code client SAF fourni, ce que digi peut en dire ; les inconnus sont absents. */
    public Map<String, CautionsClient> parClient(Collection<String> codesClients) {
        Map<String, CautionsClient> resultat = new LinkedHashMap<>();
        if (codesClients == null || codesClients.isEmpty()) {
            return resultat;
        }
        Map<String, Long> ambigus = new LinkedHashMap<>();
        // 1. Combien de dossiers valides par client, et lequel quand il n'y en a qu'un.
        jdbcClient.sql("""
                SELECT d.numero_membre, count(*) AS nb, min(d.demandeindividuel_id) AS demande_id,
                       min(d.createdat) AS date_dossier
                FROM demandeindividuel d
                WHERE d.validation_state = 'VALIDATED_FINAL'
                  AND d.numero_membre IN (:codes)
                GROUP BY d.numero_membre
                """)
                .param("codes", List.copyOf(codesClients))
                .query((rs, n) -> {
                    String code = rs.getString("numero_membre");
                    int nb = rs.getInt("nb");
                    if (nb > 1) {
                        resultat.put(code, new CautionsClient(code, true, null, null, List.of()));
                    } else {
                        long id = rs.getLong("demande_id");
                        java.sql.Timestamp t = rs.getTimestamp("date_dossier");
                        resultat.put(code, new CautionsClient(code, false, id,
                                t == null ? null : t.toLocalDateTime().toLocalDate(), new ArrayList<>()));
                        ambigus.put(code, id);
                    }
                    return code;
                })
                .list();
        if (ambigus.isEmpty()) {
            return resultat;
        }
        // 2. Les cautions des dossiers retenus, dans l'ordre de saisie.
        Map<Long, String> clientParDemande = new LinkedHashMap<>();
        ambigus.forEach((code, id) -> clientParDemande.put(id, code));
        jdbcClient.sql("""
                SELECT c.demandeindividuel_id, c.nom, c.prenom, c.telephone
                FROM personnecaution c
                WHERE c.demandeindividuel_id IN (:ids)
                ORDER BY c.demandeindividuel_id, c.personnecaution_id
                """)
                .param("ids", List.copyOf(clientParDemande.keySet()))
                .query((rs, n) -> {
                    String code = clientParDemande.get(rs.getLong("demandeindividuel_id"));
                    CautionsClient c = code == null ? null : resultat.get(code);
                    if (c != null) {
                        c.cautions().add(new Caution(rs.getString("nom"), rs.getString("prenom"),
                                rs.getString("telephone")));
                    }
                    return code;
                })
                .list();
        return resultat;
    }

    /** Les cautions d'un seul client (fiche a l'ecran). */
    public CautionsClient pourClient(String codCliente) {
        return parClient(List.of(codCliente)).get(codCliente);
    }
}
