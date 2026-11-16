package io.digiservices.ecreditservice.reclamation.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.CategorieVue;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.FileReclamations;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.ReclamationRecue;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.ReclamationVue;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.SortReclamation;
import io.digiservices.ecreditservice.reclamation.repository.ReclamationRepository;
import io.digiservices.ecreditservice.reclamation.repository.ReclamationRepository.Responsable;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.service.HabilitationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.OUVERTE;
import static io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.TRAITEE;

/**
 * Les réclamations du terrain : de la saisie d'un agent au courriel des six directions.
 *
 * <p><b>La réclamation est écrite d'abord, acheminée ensuite.</b> Si le courriel échoue, la
 * réclamation existe quand même, et {@code notifiee_at} reste vide : c'est visible, réparable,
 * et l'agent n'a rien perdu. L'inverse — refuser la réclamation parce que le courriel n'est
 * pas parti — ferait disparaître le signalement d'un agent pour une panne de messagerie.</p>
 *
 * <p><b>La rubrique décide des destinataires, pas une liste dans le code.</b> Les six
 * directions arbitrées le 12/11 portent la rubrique RECLAMATIONS (V207) ; ajouter ou retirer
 * une direction se fait dans la matrice d'habilitation, sans toucher à ce service.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReclamationService {

    /** La rubrique qui désigne les destinataires. Posée par V207. */
    public static final String RUBRIQUE = "RECLAMATIONS";

    /** Qui a le droit de signaler depuis le terrain. */
    private static final Set<String> ROLES_AUTEURS = Set.of("AGENT_CREDIT", "DA");

    private static final int OBJET_MIN = 3;
    private static final int MESSAGE_MIN = 10;

    private static final DateTimeFormatter HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm");

    private final ReclamationRepository repository;
    private final AlerteDestinatairesRepository destinataires;
    private final AlerteJournalRepository journal;
    private final ApplicationEventPublisher publisher;
    private final UserClient userClient;
    private final HabilitationService habilitations;

    // ------------------------------------------------------------------ les catégories

    public List<CategorieVue> categories() {
        return repository.categories();
    }

    // ------------------------------------------------------------------- la réception

    /**
     * Reçoit une réclamation du terrain. Rejouable : une transmission coupée se renvoie, et
     * l'identifiant créé sur le téléphone la reconnaît.
     */
    @Transactional
    public SortReclamation recevoir(String uuid, ReclamationRecue r, Long appareilId, Long lotId) {
        User auteur = exigerAuteur(uuid);
        if (r == null || r.identifiantClient() == null || r.identifiantClient().isBlank()) {
            return SortReclamation.refusee(null, "Identifiant absent");
        }
        Optional<Long> deja = repository.idReclamation(r.identifiantClient());
        if (deja.isPresent()) {
            return SortReclamation.doublon(r.identifiantClient(), deja.get());
        }
        String refus = refus(r);
        if (refus != null) {
            return SortReclamation.refusee(r.identifiantClient(), refus);
        }
        Long id = repository.enregistrer(normaliser(r), auteur.getUserId(), appareilId, lotId);
        log.info("[RECLAMATION] {} ({}) de l'agent {}", id, r.categorie(), auteur.getUserId());
        acheminer(id, auteur);
        return SortReclamation.acceptee(r.identifiantClient(), id);
    }

    /** Ce qu'une réclamation ne peut pas être. Rendu en clair : l'agent doit pouvoir corriger. */
    private String refus(ReclamationRecue r) {
        if (r.categorie() == null || repository.responsable(r.categorie()).isEmpty()) {
            return "Categorie inconnue";
        }
        if (r.objet() == null || r.objet().trim().length() < OBJET_MIN) {
            return "Objet trop court";
        }
        if (r.message() == null || r.message().trim().length() < MESSAGE_MIN) {
            return "Le message doit faire au moins " + MESSAGE_MIN + " caracteres";
        }
        if (r.saisieAt() == null) {
            return "Date de saisie absente";
        }
        if (r.saisieAt().isAfter(OffsetDateTime.now().plusHours(12))) {
            // Même garde que les visites : une horloge de téléphone peut être très en avance.
            return "Date de saisie dans le futur";
        }
        return null;
    }

    private static ReclamationRecue normaliser(ReclamationRecue r) {
        return new ReclamationRecue(r.identifiantClient(), r.categorie().trim(),
                r.objet().trim(), r.message().trim(), r.codAgencia(), r.numCredito(),
                r.codCliente(), r.saisieAt());
    }

    /**
     * Achemine la réclamation. Un échec est tracé et n'annule RIEN : la réclamation reste en
     * base, sans date d'acheminement, et cela se voit.
     */
    private void acheminer(Long id, User auteur) {
        try {
            ReclamationVue vue = repository.parId(id).orElse(null);
            if (vue == null) {
                return;
            }
            List<Destinataire> porteurs = destinataires.porteursParRoleOuDepartement(RUBRIQUE);
            if (porteurs.isEmpty()) {
                log.warn("[RECLAMATION] {} : aucun porteur de la rubrique {} avec e-mail", id, RUBRIQUE);
                return;
            }
            Responsable responsable = repository.responsable(vue.categorie()).orElse(null);
            String sujet = "[Reclamation] " + vue.categorieLibelle() + " — " + vue.objet();
            String corps = corps(vue, responsable, auteur);
            for (Destinataire d : porteurs) {
                publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                        "email", d.email(), "sujet", sujet, "corpsHtml", corps)));
                journal.envoi("RECLAMATION", "EMAIL", d.email(), d.userId(), vue.categorie(),
                        null, sujet, 1);
            }
            repository.marquerNotifiee(id, porteurs.size());
            log.info("[RECLAMATION] {} acheminee a {} destinataire(s)", id, porteurs.size());
        } catch (Exception e) {
            log.warn("[RECLAMATION] {} non acheminee : {}", id,
                    e.getMessage() == null ? e.toString() : e.getMessage().split("\\R")[0]);
        }
    }

    private String corps(ReclamationVue v, Responsable responsable, User auteur) {
        StringBuilder h = new StringBuilder()
                .append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#1F6B45;margin:0 0 4px'>").append(echapper(v.objet())).append("</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 14px'>")
                .append(echapper(v.categorieLibelle()));
        if (responsable != null) {
            h.append(" — responsable : ")
                    .append(echapper(responsable.parRole()
                            ? responsable.role() + " / " + responsable.service()
                            : responsable.service() + " / " + responsable.departement()));
        }
        h.append("</p>")
                .append("<p style='white-space:pre-wrap;margin:0 0 14px'>")
                .append(echapper(v.message())).append("</p>")
                .append("<table style='border-collapse:collapse;font-size:13px'>")
                .append(ligne("Signale par", v.auteur()
                        + (v.auteurPointVente() == null ? "" : " — " + v.auteurPointVente())))
                .append(ligne("Le", v.saisieAt() == null ? "—" : v.saisieAt().format(HEURE)));
        if (v.numCredito() != null) {
            h.append(ligne("Credit", v.codAgencia() + "/" + v.numCredito()));
        }
        if (v.codCliente() != null) {
            h.append(ligne("Membre", v.codCliente()));
        }
        if (auteur != null && auteur.getPhone() != null && !auteur.getPhone().isBlank()) {
            h.append(ligne("Joindre l'agent", auteur.getPhone()));
        }
        return h.append("</table>")
                .append("<p style='color:#5C6B60;font-size:12px;margin-top:14px'>")
                .append("Envoye aux porteurs de la rubrique RECLAMATIONS. ")
                .append("La reponse se saisit dans digi : elle revient a l'agent sur son telephone.")
                .append("</p></div>").toString();
    }

    private static String ligne(String libelle, String valeur) {
        return "<tr><td style='padding:2px 12px 2px 0;color:#5C6B60'>" + echapper(libelle)
                + "</td><td style='padding:2px 0'>" + echapper(valeur) + "</td></tr>";
    }

    /** Le message vient du terrain : il entre dans du HTML, il doit donc être échappé. */
    private static String echapper(String s) {
        if (s == null) {
            return "—";
        }
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    // --------------------------------------------------------------------- la lecture

    /** Ce que l'agent voit de ses propres signalements, et des réponses reçues. */
    public List<ReclamationVue> mes(String uuid, int limite) {
        User user = exigerAuteur(uuid);
        return repository.deLAuteur(user.getUserId(), limite);
    }

    /** La file des directions : tout ce qui est porté par la rubrique. */
    public FileReclamations file(String uuid, String statut, String categorie, int limite) {
        exigerPorteurDeLaRubrique(uuid);
        Map<String, Object> c = repository.compteurs();
        return new FileReclamations(entier(c.get("ouvertes")), entier(c.get("en_cours")),
                entier(c.get("traitees")), repository.file(vide(statut), vide(categorie), limite));
    }

    // -------------------------------------------------------------------- le traitement

    public ReclamationVue prendreEnCharge(String uuid, Long id) {
        User user = exigerPorteurDeLaRubrique(uuid);
        if (repository.prendreEnCharge(id, user.getUserId()) == 0) {
            ReclamationVue actuelle = repository.parId(id)
                    .orElseThrow(() -> new ApiException("Reclamation introuvable"));
            throw new ApiException(OUVERTE.equals(actuelle.statut())
                    ? "Prise en charge impossible"
                    : "Deja prise en charge par " + actuelle.priseEnChargePar());
        }
        log.info("[RECLAMATION] {} prise en charge par {}", id, user.getUserId());
        return repository.parId(id).orElseThrow();
    }

    public ReclamationVue repondre(String uuid, Long id, String reponse) {
        User user = exigerPorteurDeLaRubrique(uuid);
        if (reponse == null || reponse.trim().length() < 2) {
            throw new ApiException("La reponse ne peut pas etre vide");
        }
        if (repository.repondre(id, user.getUserId(), reponse.trim()) == 0) {
            ReclamationVue actuelle = repository.parId(id)
                    .orElseThrow(() -> new ApiException("Reclamation introuvable"));
            throw new ApiException(TRAITEE.equals(actuelle.statut())
                    ? "Deja traitee le " + (actuelle.reponduAt() == null ? "" : actuelle.reponduAt().format(HEURE))
                    : "Reponse impossible");
        }
        log.info("[RECLAMATION] {} traitee par {}", id, user.getUserId());
        return repository.parId(id).orElseThrow();
    }

    // --------------------------------------------------------------------- le commun

    private User exigerAuteur(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        if (user.getRole() == null || !ROLES_AUTEURS.contains(user.getRole())) {
            throw new ApiException("Le signalement depuis le terrain est reserve aux agents de credit et aux directeurs d'agence");
        }
        return user;
    }

    /**
     * Qui peut traiter : ceux à qui la matrice d'habilitation accorde la rubrique.
     *
     * <p>C'est la barrière serveur habituelle, et non la liste des destinataires du courriel.
     * La différence compte : cette liste exige une adresse e-mail, et un directeur dont la
     * fiche n'en porte pas doit quand même pouvoir répondre. Les deux restent commandées par
     * la même rubrique — qui reçoit et qui répond ne divergent pas pour autant.</p>
     */
    private User exigerPorteurDeLaRubrique(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        habilitations.exiger(uuid, RUBRIQUE);
        return user;
    }

    private static String vide(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    private static int entier(Object o) {
        return o instanceof Number n ? n.intValue() : 0;
    }
}
