package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.HabilitationRepository;
import io.digiservices.ecreditservice.repository.HabilitationRepository.Contexte;
import io.digiservices.ecreditservice.repository.HabilitationRepository.Case;
import io.digiservices.ecreditservice.repository.HabilitationRepository.Departement;
import io.digiservices.ecreditservice.repository.HabilitationRepository.Rubrique;
import io.digiservices.ecreditservice.repository.HabilitationRepository.Trace;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    /** Verification des pieces, detachee de CLIENTS_SOCIETARIAT le 28/10/2026 (V186). */
    public static final String VERIFICATION_DOCUMENTS = "VERIFICATION_DOCUMENTS";
    public static final String STATS_TELEPHONE = "STATS_TELEPHONE";
    public static final String CREDITS_SUIVI = "CREDITS_SUIVI";
    public static final String ARRETE_CAISSE = "ARRETE_CAISSE";
    public static final String CONTACTS_AGENTS = "CONTACTS_AGENTS";
    public static final String USAGE_PLATEFORME = "USAGE_PLATEFORME";
    public static final String ADMIN_OUTILS = "ADMIN_OUTILS";

    /**
     * Rubriques du service Audit (V194). Elles ne commandent pas un ecran chacune : chacune est
     * un GROUPE de menu qui ouvre, en lecture seule, plusieurs ecrans existants. Elles valent
     * donc cle alternative a cote de la rubrique propre de chaque ecran.
     */
    public static final String AUDIT_CREDIT = "AUDIT_CREDIT";
    public static final String AUDIT_CAISSE = "AUDIT_CAISSE";
    public static final String AUDIT_PORTEFEUILLE = "AUDIT_PORTEFEUILLE";
    public static final String AUDIT_CLIENTELE = "AUDIT_CLIENTELE";
    public static final String AUDIT_ACCES = "AUDIT_ACCES";

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
        // Le responsable du service regle la matrice ; l'administrateur place les agents.
        cles.put("peutReglerLaMatrice", c.toutVoir() || "SUPER_ADMIN".equals(c.role()));
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

    /** Etat de la bascule, pour les envois qui doivent suivre la meme regle que les ecrans. */
    public boolean parDepartementActif() {
        return repository.parDepartementActif();
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

    /**
     * Barriere serveur sur plusieurs cles : l'une suffit. Sert aux ecrans qu'une rubrique
     * d'audit ouvre en plus de leur rubrique propre, sans qu'il faille accorder celle-ci a
     * l'Audit (ce qui l'inscrirait, par exemple, aux envois de courriel des credits negatifs).
     */
    public void exigerUneDe(String uuid, String... rubriques) {
        Set<String> accordees = rubriques(uuid);
        for (String r : rubriques) {
            if (accordees.contains(r)) {
                return;
            }
        }
        throw new ApiException("Vous n'avez pas accès à cet écran");
    }

    public boolean peutUneDe(String uuid, String... rubriques) {
        Set<String> accordees = rubriques(uuid);
        for (String r : rubriques) {
            if (accordees.contains(r)) {
                return true;
            }
        }
        return false;
    }

    /** Les departements proposes a l'administrateur pour un service donne. */
    public List<Departement> departements(String service) {
        return repository.departements(service);
    }

    // ==================== Lot 2 : l'ecran de reglage ====================

    /** Le reglage de la matrice revient au responsable du service, et a l'administrateur. */
    private User exigerReglage(String uuid, String service) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        if ("SUPER_ADMIN".equals(user.getRole())) {
            return user;
        }
        Contexte c = repository.contexte(uuid).orElseThrow(() -> new ApiException("Utilisateur non identifie"));
        if (!c.toutVoir()) {
            throw new ApiException("Le réglage des habilitations revient au responsable du service");
        }
        if (service != null && !service.isBlank()
                && !service.trim().equalsIgnoreCase(c.serviceOuVide())) {
            throw new ApiException("Vous ne pouvez régler que les départements de votre service");
        }
        return user;
    }

    /** La matrice telle que l'ecran la montre : departements, rubriques, cases cochees. */
    public Map<String, Object> matrice(String uuid, String service) {
        User user = exigerReglage(uuid, service);
        Contexte c = repository.contexte(uuid).orElseThrow(() -> new ApiException("Utilisateur non identifie"));
        // L'administrateur voit tous les services ; un responsable, le sien seulement.
        String portee = "SUPER_ADMIN".equals(user.getRole())
                ? (service == null ? "" : service.trim())
                : c.serviceOuVide();

        List<Departement> departements = repository.departements(portee);
        List<Rubrique> rubriques = repository.rubriques();
        List<Case> cases = repository.cases(portee);

        Map<Long, int[]> comptes = new LinkedHashMap<>();
        for (Object[] ligne : repository.comptesParDepartement(portee)) {
            comptes.put((Long) ligne[0], new int[]{(Integer) ligne[1], (Integer) ligne[2]});
        }

        List<Map<String, Object>> lignes = new ArrayList<>();
        for (Departement d : departements) {
            int[] n = comptes.getOrDefault(d.id(), new int[]{0, 0});
            Map<String, Object> ligne = new LinkedHashMap<>();
            ligne.put("id", d.id());
            ligne.put("service", d.service());
            ligne.put("code", d.code());
            ligne.put("libelle", d.libelle());
            ligne.put("toutVoir", d.toutVoir());
            ligne.put("accueilRoute", d.accueilRoute());
            ligne.put("comptesActifs", n[0]);
            ligne.put("comptes", n[1]);
            ligne.put("noms", repository.nomsDuDepartement(d.id()));
            ligne.put("rubriques", cases.stream().filter(x -> x.departementId().equals(d.id()))
                    .map(Case::rubriqueCode).toList());
            lignes.add(ligne);
        }

        Map<String, Object> reponse = new LinkedHashMap<>();
        reponse.put("rubriques", rubriques);
        reponse.put("departements", lignes);
        reponse.put("parDepartementActif", repository.parDepartementActif());
        reponse.put("nonPlaces", repository.comptesSansDepartement(portee));
        reponse.put("journal", repository.journal(40));
        return reponse;
    }

    /** Coche ou decoche une rubrique pour un departement. */
    public String regler(String uuid, Long departementId, String rubriqueCode, boolean accorde) {
        Departement d = repository.departement(departementId)
                .orElseThrow(() -> new ApiException("Departement inconnu"));
        User user = exigerReglage(uuid, d.service());
        if (!repository.rubriqueExiste(rubriqueCode)) {
            throw new ApiException("Rubrique inconnue");
        }
        if (d.toutVoir()) {
            throw new ApiException("Le responsable du service voit toutes les rubriques : "
                    + "ses cases ne se décochent pas");
        }
        int n = accorde ? repository.accorder(departementId, rubriqueCode)
                : repository.retirer(departementId, rubriqueCode);
        if (n == 0) {
            return accorde ? "Rubrique déjà accordée" : "Rubrique déjà retirée";
        }
        repository.tracer(accorde ? "ACCORDER" : "RETIRER", d.service(), departementId, d.libelle(),
                rubriqueCode, accorde ? "non" : "oui", accorde ? "oui" : "non",
                user.getUserId(), nom(user));
        log.info("[HABILITATION] {} {} au departement {} par {}",
                accorde ? "Accorde" : "Retire", rubriqueCode, d.libelle(), user.getUserId());
        return accorde ? "Rubrique accordée au département" : "Rubrique retirée du département";
    }

    /**
     * Ouvre ou referme la bascule. Ouverte, chaque departement ne voit plus que ses rubriques ;
     * fermee, un MANAGER garde toutes celles de son service. L'ecran avertit du nombre de
     * comptes encore non places, qui perdraient leurs ecrans a l'ouverture.
     */
    public String basculer(String uuid, boolean actif) {
        User user = exigerReglage(uuid, null);
        boolean avant = repository.parDepartementActif();
        if (avant == actif) {
            return actif ? "L'habilitation par département est déjà active"
                    : "L'habilitation par département est déjà inactive";
        }
        repository.basculer(actif, user.getUserId());
        repository.tracer("BASCULE", null, null, null, null,
                Boolean.toString(avant), Boolean.toString(actif), user.getUserId(), nom(user));
        log.warn("[HABILITATION] Bascule par departement : {} -> {} par {}", avant, actif, user.getUserId());
        return actif ? "Habilitation par département activée"
                : "Habilitation par département désactivée";
    }

    /** Les dernieres traces, pour l'ecran de reglage. */
    public List<Trace> journal(String uuid, int limite) {
        exigerReglage(uuid, null);
        return repository.journal(Math.min(Math.max(limite, 1), 200));
    }

    private static String nom(User user) {
        String prenom = user.getFirstName() == null ? "" : user.getFirstName();
        String nom = user.getLastName() == null ? "" : user.getLastName();
        return (prenom + " " + nom).trim();
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
        repository.tracer("RATTACHEMENT", null, departementId,
                departementId == null ? null : repository.departement(departementId)
                        .map(Departement::libelle).orElse(null),
                null, null, String.valueOf(userId), admin.getUserId(), nom(admin));
        log.info("[HABILITATION] Compte {} rattache au departement {} par {}", userId, departementId, admin.getUserId());
        return departementId == null ? "Rattachement retiré" : "Compte rattaché au département";
    }
}
