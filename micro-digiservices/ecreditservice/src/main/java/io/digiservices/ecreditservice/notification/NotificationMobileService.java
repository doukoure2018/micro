package io.digiservices.ecreditservice.notification;

import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import io.digiservices.ecreditservice.mobile.service.ExpoPushService;
import io.digiservices.ecreditservice.notification.NotificationMobile.APublier;
import io.digiservices.ecreditservice.notification.NotificationMobile.Journal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * La porte unique des notifications de l'application mobile (V215).
 *
 * <p><b>On range d'abord, on pousse ensuite.</b> Le push est un signal volatil : il s'efface
 * d'un balayage, n'arrive pas si le téléphone est éteint, et disparaît à la réinstallation.
 * Le journal, lui, reste — l'agent retrouve dans son centre de notifications ce qu'il a balayé
 * à 8 h 20 en marchant. Si l'envoi échoue, la notification existe quand même, sans date
 * d'envoi : c'est visible, et rien n'est perdu.</p>
 *
 * <p><b>Un envoi n'interrompt jamais ce qui l'a déclenché.</b> Une alerte du matin, une
 * réclamation prise en charge, une transmission terminée : le métier est déjà fait quand on
 * notifie. Tout échec est tracé et avalé.</p>
 *
 * <p><b>Ni nom de membre ni montant.</b> Une notification s'affiche sur un écran verrouillé,
 * que n'importe qui lit par-dessus l'épaule de l'agent. C'est la règle écrite sur la maquette
 * du 12/11, et elle tient au titre comme au corps. Le détail s'ouvre après déverrouillage.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationMobileService {

    private final NotificationMobileRepository repository;
    private final MobileRepository mobile;
    private final ExpoPushService push;

    /** Range la notification, puis la pousse aux appareils de l'agent. Rend son identifiant. */
    public Long publier(APublier n) {
        if (n == null || n.userId() == null) {
            return null;
        }
        Long id;
        try {
            id = repository.ranger(n.userId(), n.categorie(), n.titre(), n.corps(),
                    n.ecran(), n.parametres());
        } catch (Exception e) {
            log.warn("[NOTIF] notification non rangee pour l'agent {} : {}", n.userId(), e.getMessage());
            return null;
        }
        pousser(id, n);
        return id;
    }

    /** Plusieurs agents, un même message : le matin en sert deux cent quatre-vingts. */
    public int publier(List<APublier> notifications) {
        int n = 0;
        for (APublier a : notifications) {
            n += publier(a) == null ? 0 : 1;
        }
        return n;
    }

    private void pousser(Long id, APublier n) {
        if (!push.estActif()) {
            return;
        }
        try {
            List<String> jetons = mobile.jetonsActifs(n.userId());
            if (jetons.isEmpty()) {
                // Aucun appareil declare : la notification attend dans le journal, et l'agent
                // la trouvera a sa prochaine ouverture. Ce n'est pas une anomalie.
                return;
            }
            Map<String, Object> donnees = new HashMap<>(n.parametres() == null ? Map.of() : n.parametres());
            donnees.put("notificationId", id);
            if (n.ecran() != null) {
                donnees.put("ecran", n.ecran());
            }
            var resultat = push.envoyer(jetons, n.titre(), n.corps(), donnees);
            resultat.jetonsMorts().forEach(j -> mobile.desactiverAppareil(j, "JETON_PERIME"));
            if (resultat.envoyes() > 0) {
                repository.marquerEnvoyee(id, resultat.envoyes());
            }
        } catch (Exception e) {
            // Le metier est deja fait : une notification perdue ne doit rien emporter.
            log.warn("[NOTIF] notification {} non poussee a l'agent {} : {}", id, n.userId(), e.getMessage());
        }
    }

    // ------------------------------------------------------- les promesses à vérifier

    /**
     * Un matin par agent : les promesses dont la date est passée sans règlement constaté.
     *
     * <p>Une promesse non vérifiée est le trou le plus courant du recouvrement : l'agent
     * obtient un engagement, repart, et personne ne revient voir. C'est la seule notification
     * qui ne vient pas d'un événement — elle vient d'un silence.</p>
     */
    public int annoncerLesPromessesAVerifier(int fenetreJours) {
        int pousses = 0;
        for (var p : repository.promessesEchues(fenetreJours)) {
            if (p.nombre() <= 0
                    || repository.dejaRecuAujourdhui(p.userId(), NotificationMobile.RECOUVREMENT)) {
                continue;
            }
            Long id = publier(APublier.de(p.userId(), NotificationMobile.RECOUVREMENT,
                    p.nombre() == 1 ? "1 promesse à vérifier" : p.nombre() + " promesses à vérifier",
                    "Dates passées sans règlement constaté dans SAF", "recouvrement"));
            pousses += id == null ? 0 : 1;
        }
        return pousses;
    }

    // ---------------------------------------------------------------------- la lecture

    public Journal journal(Long userId, int limite) {
        return repository.journal(userId, limite);
    }

    public int marquerLues(Long userId, List<Long> ids) {
        return repository.marquerLues(userId, ids);
    }
}
