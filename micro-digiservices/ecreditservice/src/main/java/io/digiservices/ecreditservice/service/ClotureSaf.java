package io.digiservices.ecreditservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;

/**
 * Fenetre de cloture SAF. Chaque soir en semaine, la procedure de cloture du systeme bancaire
 * <b>desactive le compte de lecture</b> de la base de production : digi ne peut plus y lire, et
 * le compte est reactive automatiquement en fin de soiree ou dans la nuit.
 *
 * <p>Mesure du 26 au 28/10/2026 sur le journal des passages : succes jusqu'a 16 h 10 GMT,
 * echecs de 17 h 10 a 20 h 10 le lundi (retour a 06 h 10), echecs de 17 h 10 a 18 h 10 le mardi
 * (retour a 19 h 10), rien le samedi soir. Ce n'est donc pas une panne mais un evenement
 * attendu : pendant cette plage, les traitements qui lisent la <b>production</b> (surveillance
 * des credits negatifs, reprise des numeros membres) sont mis en pause plutot que de tomber en
 * echec, et la sonde n'emet pas d'alerte.</p>
 *
 * <p>La fenetre est <b>horaire et deterministe</b> : un passage saute ne coute rien, il est
 * repris a l'heure suivante ou au premier passage du matin, alors qu'un test de la base avant
 * chaque passage dependrait d'une sonde elle-meme susceptible d'etre muette. L'alerte, elle,
 * croise cette fenetre avec la signature exacte rendue par la sonde (compte desactive sur la
 * production, sauvegarde qui repond) pour ne jamais masquer une vraie panne.</p>
 *
 * <p>Les lectures ordinaires des ecrans ne sont pas concernees : depuis l'aiguillage du
 * 21/10/2026 elles viennent de la sauvegarde, qui reste disponible pendant la cloture.</p>
 */
@Component
@Slf4j
public class ClotureSaf {

    private static final ZoneId GMT = ZoneId.of("GMT");

    /** Mettre a false pour ignorer la fenetre (toutes les taches reprennent leur horaire). */
    @Value("${saf.cloture.active:true}")
    private boolean active;
    /** Premiere heure GMT de la fenetre, incluse. */
    @Value("${saf.cloture.debut-heure:17}")
    private int debutHeure;
    /** Derniere heure GMT de la fenetre, incluse (la cloture est finie avant minuit). */
    @Value("${saf.cloture.fin-heure:23}")
    private int finHeure;

    /** true si l'instant courant tombe dans la plage de cloture. */
    public boolean dansLaFenetre() {
        if (!active) {
            return false;
        }
        int heure = ZonedDateTime.now(GMT).getHour();
        return heure >= debutHeure && heure <= finHeure;
    }

    /**
     * Journalise la mise en pause d'une tache et rend le message a inscrire au journal des
     * passages, pour qu'une plage sans traitement s'explique d'elle-meme.
     */
    public String pause(String tache) {
        String message = "cloture SAF (" + plage() + ") : passage non effectue, reprise a la fin de la cloture";
        log.info("[CLOTURE-SAF] « {} » en pause : {}", tache, message);
        return message;
    }

    /** « 17h-23h GMT », pour les messages. */
    public String plage() {
        return debutHeure + "h-" + (finHeure + 1) + "h GMT";
    }
}
