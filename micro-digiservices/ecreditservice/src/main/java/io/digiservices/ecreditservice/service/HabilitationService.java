package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.HabilitationRepository;
import io.digiservices.ecreditservice.repository.HabilitationRepository.Contexte;
import io.digiservices.ecreditservice.repository.HabilitationRepository.Departement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Le porte-cles d'un compte : la liste des ecrans qu'il a le droit d'ouvrir (V178).
 *
 * <p>Un seul endroit decide, et le menu comme le serveur posent la meme question. Avant ce lot,
 * la regle etait recopiee une par une dans le menu et dans une dizaine de resolveurs de
 * perimetre, qui se contredisaient : la page des credits negatifs, par exemple, acceptait tout
 * role dont le service etait DSIG alors que le menu exigeait MANAGER.</p>
 *
 * <p>Tant que le parametre de bascule est a faux, un MANAGER d'un service ayant declare des
 * departements conserve toutes les rubriques de son service. C'est voulu : le champ apparait
 * sur la fiche du compte, l'administrateur place les agents au fil de l'eau, et personne ne
 * perd ses ecrans entre-temps.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HabilitationService {

    public static final String FICHE_RAPPROCHEMENT = "FICHE_RAPPROCHEMENT";
    public static final String RAPPROCHEMENT_CAISSE = "RAPPROCHEMENT_CAISSE";
    public static final String CREDITS_NEGATIFS = "CREDITS_NEGATIFS";
    public static final String CLIENTS_SOCIETARIAT = "CLIENTS_SOCIETARIAT";
    public static final String ASSAINISSEMENT = "ASSAINISSEMENT";
    public static final String STATS_TELEPHONE = "STATS_TELEPHONE";
    public static final String CREDITS_SUIVI = "CREDITS_SUIVI";
    public static final String ARRETE_CAISSE = "ARRETE_CAISSE";
    public static final String CONTACTS_AGENTS = "CONTACTS_AGENTS";
    public static final String USAGE_PLATEFORME = "USAGE_PLATEFORME";
    public static final String ADMIN_OUTILS = "ADMIN_OUTILS";

    private static final String MANAGER = "MANAGER";

    private final HabilitationRepository repository;
    private final UserClient userClient;

    /** Le porte-cles remis au navigateur a l'ouverture de session. */
    public Map<String, Object> porteCles(String uuid) {
        Contexte c = repository.contexte(uuid)
                .orElseThrow(() -> new ApiException("Utilisateur non identifie"));
        boolean actif = repository.parDepartementActif();
        Set<String> rubriques = rubriques(c, actif);

        Map<String, Object> cles = new LinkedHashMap<>();
        cles.put("role", c.role());
        cles.put("service", c.service());
        cles.put("departementId", c.departementId());
        cles.put("departementCode", c.departementCode());
        cles.put("departement", c.departementLibelle());
        cles.put("responsableDuService", c.toutVoir());
        cles.put("accueil", c.accueilRoute());
        cles.put("parDepartementActif", actif);
        cles.put("rubriques", List.copyOf(rubriques));
        // Un compte du service DSIG non encore place : l'administrateur doit le rattacher.
        cles.put("aPlacer", c.departementId() == null && repository.serviceADesDepartements(c.serviceOuVide()));
        return cles;
    }

    /** Les rubriques d'un compte, role et departement reunis. */
    public Set<String> rubriques(String uuid) {
        Contexte c = repository.contexte(uuid)
                .orElseThrow(() -> new ApiException("Utilisateur non identifie"));
        return rubriques(c, repository.parDepartementActif());
    }

    private Set<String> rubriques(Contexte c, boolean parDepartementActif) {
        Set<String> rubriques = new LinkedHashSet<>(repository.parRole(c.role(), c.serviceOuVide()));

        if (c.toutVoir()) {
            rubriques.addAll(repository.toutes());
            return rubriques;
        }
        rubriques.addAll(repository.parDepartement(c.departementId()));

        if (!parDepartementActif && MANAGER.equals(c.role())
                && repository.serviceADesDepartements(c.serviceOuVide())) {
            // Periode de transition : la direction garde ce qu'elle avait avant la bascule.
            rubriques.addAll(repository.toutes());
        }
        return rubriques;
    }

    public boolean peut(String uuid, String rubrique) {
        return rubriques(uuid).contains(rubrique);
    }

    /**
     * Barriere serveur. A appeler au debut de chaque point d'entree soumis a habilitation :
     * masquer une entree de menu ne protege rien, l'adresse de l'ecran reste tapable.
     */
    public void exiger(String uuid, String rubrique) {
        if (!peut(uuid, rubrique)) {
            throw new ApiException("Vous n'avez pas accès à cet écran");
        }
    }

    /** Les departements proposes a l'administrateur pour un service donne. */
    public List<Departement> departements(String service) {
        return repository.departements(service);
    }

    /** Le departement deja enregistre pour un compte, ou null. */
    public Departement departementDuCompte(Long userId) {
        return userId == null ? null : repository.departementDuCompte(userId).orElse(null);
    }

    /**
     * Rattache un compte a un departement, ou le detache si l'identifiant est nul. Reserve a
     * l'administrateur, comme le reste de la fiche du compte : c'est lui qui place les agents,
     * la responsable du service reglant pour sa part la matrice.
     */
    public String affecter(String uuidAdmin, Long userId, Long departementId) {
        User admin = userClient.getUserByUuid(uuidAdmin);
        if (admin == null || !"SUPER_ADMIN".equals(admin.getRole())) {
            throw new ApiException("Le rattachement à un département est réservé à l'administrateur");
        }
        if (userId == null) {
            throw new ApiException("Compte non precise");
        }
        if (departementId != null && repository.departements("").stream()
                .noneMatch(d -> d.id().equals(departementId))) {
            throw new ApiException("Departement inconnu");
        }
        if (repository.affecter(userId, departementId) == 0) {
            throw new ApiException("Compte introuvable");
        }
        log.info("[HABILITATION] Compte {} rattache au departement {} par {}", userId, departementId, admin.getUserId());
        return departementId == null ? "Rattachement retiré" : "Compte rattaché au département";
    }
}
