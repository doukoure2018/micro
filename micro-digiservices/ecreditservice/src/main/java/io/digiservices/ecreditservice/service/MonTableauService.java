package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AgentChargeRepository;
import io.digiservices.ecreditservice.repository.MonTableauRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Le volet lateral : ce qui attend l'utilisateur connecte, l'etat des donnees, et ses agents.
 *
 * <p>Trois principes, qui expliquent ce qui n'y est PAS :</p>
 *
 * <ul>
 *   <li><b>Aucun montant.</b> Le volet s'ouvre par-dessus n'importe quel ecran, souvent devant
 *       un client ou un collegue. Des nombres de dossiers, jamais des francs.</li>
 *   <li><b>Aucune lecture SAF.</b> Il s'ouvre sur chaque page : tout vient de Postgres, en
 *       requetes qui visent un index. L'etat de SAF lui-meme est lu dans la sonde deja en
 *       place, pas en interrogeant BDCRG.</li>
 *   <li><b>Aucune ligne a zero.</b> Un volet qui enumere des zeros ne se lit plus. Rien a
 *       faire se dit en une phrase, pas en six lignes vides.</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MonTableauService {

    private final MonTableauRepository repository;
    private final AgentChargeRepository charges;
    private final DonneesSafService donneesSaf;
    private final HabilitationService habilitations;
    private final UserClient userClient;

    /** Roles qui encadrent des agents de credit et voient donc le bloc « Mes agents ». */
    private static final Set<String> ENCADRANTS = Set.of("RA", "DA", "DR");

    /**
     * Une ligne du volet : un compte, un libelle, et ou aller.
     *
     * @param severite « urgent » (rouge), « attention » (ambre) ou « info » (neutre)
     */
    public record Ligne(String code, String libelle, int nombre, String lien, String severite) {
    }

    public Map<String, Object> tableau(String uuid) {
        User u = userClient.getUserByUuid(uuid);
        if (u == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        String role = u.getRole() == null ? "" : u.getRole().trim().toUpperCase();

        List<Ligne> lignes = new ArrayList<>();
        ajouterLignesMetier(lignes, u, role);
        ajouterLignesDsig(lignes, uuid);

        Map<String, Object> tableau = new LinkedHashMap<>();
        tableau.put("lignes", lignes);
        tableau.put("saf", etatDesDonnees());
        tableau.put("mesAgents", ENCADRANTS.contains(role) ? mesAgents(u, role) : List.of());
        tableau.put("montreMesAgents", ENCADRANTS.contains(role));
        return tableau;
    }

    private void ajouterLignesMetier(List<Ligne> lignes, User u, String role) {
        Long userId = u.getUserId();
        if (userId != null) {
            // Ces deux-la ne dependent pas du role : un responsable qui porte encore des dossiers
            // doit les voir, et une saisie d'accueil ne peut etre corrigee que par son auteur.
            ajouter(lignes, "dossiers_a_corriger", "Dossiers à corriger",
                    repository.dossiersACorriger(userId), "/dashboards/credit/individuel/attente", "urgent");
            ajouter(lignes, "corrections_accueil", "Saisies d'accueil à corriger",
                    repository.correctionsAccueil(userId), "/dashboards/credit/individuel/attente", "urgent");
        }
        if ("AGENT_CREDIT".equals(role) && userId != null) {
            ajouter(lignes, "dossiers_en_instruction", "Dossiers en instruction",
                    repository.dossiersEnInstruction(userId), "/dashboards/credit/individuel/attente", "info");
        }
        if ("DA".equals(role) && u.getAgenceId() != null) {
            ajouter(lignes, "receptions_a_affecter", "Réceptions à affecter",
                    repository.receptionsAAffecter(u.getAgenceId()),
                    "/dashboards/da/receptions-a-affecter", "urgent");
            ajouter(lignes, "dossiers_a_reattribuer", "Dossiers à réattribuer",
                    charges.dossiersOrphelins(u.getAgenceId(), null).size(),
                    "/dashboards/dossiers-a-reattribuer", "attention");
            ajouter(lignes, "transferts_a_acquitter", "Transferts de charge à accuser",
                    repository.transfertsAAcquitter(u.getAgenceId()), "/dashboards/resp-agent", "info");
        }
        if ("DR".equals(role) && u.getDelegationId() != null) {
            ajouter(lignes, "dossiers_a_reattribuer", "Dossiers à réattribuer",
                    charges.dossiersOrphelins(null, u.getDelegationId()).size(),
                    "/dashboards/dossiers-a-reattribuer", "attention");
        }
    }

    /**
     * Les anomalies SAF, pour qui porte la rubrique : la DSIG, et depuis le 03/11/2026 la DE, la
     * DF et l'inspection. La rubrique decide, pas le role — c'est elle qui commande deja l'acces
     * aux deux ecrans et l'envoi des alertes.
     */
    private void ajouterLignesDsig(List<Ligne> lignes, String uuid) {
        if (!habilitations.peut(uuid, HabilitationService.CREDITS_NEGATIFS)) {
            return;
        }
        ajouter(lignes, "credits_negatifs", "Crédits à solde négatif",
                repository.creditsNegatifsOuverts(), "/dashboards/credits-negatifs", "urgent");
        ajouter(lignes, "comptes_mal_adosses", "Comptes de remboursement à corriger",
                repository.comptesMalAdossesATraiter(), "/dashboards/comptes-mal-adosses", "attention");
    }

    /** Une ligne n'entre que si elle a quelque chose a dire. */
    private static void ajouter(List<Ligne> lignes, String code, String libelle, int nombre,
                                String lien, String severite) {
        if (nombre > 0) {
            lignes.add(new Ligne(code, libelle, nombre, lien, severite));
        }
    }

    /**
     * Quelle base on lit, et de quand datent les donnees.
     *
     * <p>La confusion entre la production et la sauvegarde de la veille revient sans cesse :
     * un ecran lit l'une, un autre lit l'autre, et rien ne le disait. L'afficher en permanence
     * repond a la question une fois pour toutes, au lieu de la reposer a chaque doute.</p>
     */
    private Map<String, Object> etatDesDonnees() {
        var saf = donneesSaf.etat();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("joignable", saf.isToutOk());
        m.put("enRestauration", saf.isEnRestauration());
        m.put("sauvegardeActive", saf.isSauvegardeActive());
        m.put("mention", saf.getMention() == null ? "" : saf.getMention());
        m.put("dateDonnees", saf.getDateDonneesTexte() == null ? "" : saf.getDateDonneesTexte());
        return m;
    }

    private List<Map<String, Object>> mesAgents(User u, String role) {
        if ("DR".equals(role)) {
            return u.getDelegationId() == null ? List.of()
                    : repository.mesAgents(null, u.getDelegationId());
        }
        return u.getAgenceId() == null ? List.of() : repository.mesAgents(u.getAgenceId(), null);
    }
}
