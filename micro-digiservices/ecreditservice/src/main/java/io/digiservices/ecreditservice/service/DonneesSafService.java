package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.SanteSafDto;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * « Donnees SAF au … » (aiguillage SAF, lot 2) : depuis le 21/10/2026 les lectures ordinaires
 * de SAF viennent de la sauvegarde restauree chaque matin. Ce service garde le dernier etat
 * releve par la sonde (toutes les dix minutes) et le met en forme pour les ecrans et les
 * courriels, pour qu'un chiffre lu dans la sauvegarde dise toujours de quand il date.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DonneesSafService {

    private static final DateTimeFormatter LECTURE = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter AFFICHAGE = DateTimeFormatter.ofPattern("dd/MM/yyyy 'à' HH:mm");

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final ClotureSaf cloture;

    private volatile SanteSafDto derniere;
    private volatile LocalDateTime dateSonde;

    @Data
    @Builder
    public static class DonneesSafDto {
        /** true : les lectures ordinaires viennent de la sauvegarde de la veille. */
        private boolean sauvegardeActive;
        /** Date de restauration de la sauvegarde (yyyy-MM-dd HH:mm:ss), null si inconnue. */
        private String dateDonnees;
        /** « 20/10/2026 à 07:15 », pret a afficher. */
        private String dateDonneesTexte;
        /** Phrase complete pour un en-tete ou un pied de courriel. */
        private String mention;
        private boolean toutOk;
        private LocalDateTime dateSonde;
        /** La sauvegarde est en cours de restauration : les ecrans SAF affichent un message d'attente. */
        private boolean enRestauration;
        /**
         * Cloture SAF en cours : la base de production n'accepte plus de lecture jusqu'a la fin de
         * soiree. Les ecrans continuent de fonctionner sur la sauvegarde ; seules les verifications
         * en direct (numero membre a la saisie, preuve des credits negatifs) sont reportees.
         */
        private boolean enCloture;
        private String messageInfo;
    }

    public static final String MESSAGE_RESTAURATION =
            "Veuillez patienter : la base SAF est actuellement en cours de restauration. Revenez dans 30 minutes.";

    public static final String MESSAGE_CLOTURE =
            "Clôture SAF en cours : la base de production n'accepte pas de lecture en direct jusqu'à la fin de la soirée.";

    /** Appele par la sonde a chaque passage. */
    public void memoriser(SanteSafDto sante) {
        this.derniere = sante;
        this.dateSonde = LocalDateTime.now();
    }

    public DonneesSafDto etat() {
        SanteSafDto s = derniere;
        // Pas encore sonde, ou sonde vieille de plus de trois minutes alors qu'elle etait en echec
        // (restauration en cours) : on relit, pour que le message d'attente disparaisse vite.
        boolean perimee = s != null && !s.isToutOk() && dateSonde != null
                && dateSonde.isBefore(LocalDateTime.now().minusMinutes(3))
                // Pendant la cloture, l'etat ne changera pas avant la fin de soiree : inutile de
                // resonder a chaque affichage d'ecran, la sonde passe deja toutes les dix minutes.
                && !(s.isProductionEnCloture() && cloture.dansLaFenetre());
        if (s == null || perimee) {
            try {
                s = portefeuilleClient.getSanteSaf();
                memoriser(s);
            } catch (Exception e) {
                log.warn("[DONNEES-SAF] Sonde ebanking injoignable : {}", e.getMessage());
                return DonneesSafDto.builder().sauvegardeActive(false).toutOk(false).mention("").build();
            }
        }
        String texte = texte(s.getDateDonneesSauvegarde());
        String mention = !s.isSauvegardeActive() ? "Données SAF en direct (base de production)"
                : texte == null ? "Données SAF lues dans la sauvegarde de la veille"
                : "Données SAF au " + texte + " (sauvegarde de la veille)";
        boolean enRestauration = s.isSauvegardeActive() && s.isSauvegardeEnRestauration();
        // La cloture (le soir) et la restauration (le matin) ne se chevauchent pas ; en cas de
        // doute la restauration passe devant, c'est elle qui empeche les ecrans de lire.
        boolean enCloture = !enRestauration && s.isProductionEnCloture() && cloture.dansLaFenetre();
        return DonneesSafDto.builder()
                .sauvegardeActive(s.isSauvegardeActive())
                .dateDonnees(s.getDateDonneesSauvegarde())
                .dateDonneesTexte(texte)
                .mention(mention)
                .toutOk(s.isToutOk())
                .dateSonde(dateSonde)
                .enRestauration(enRestauration)
                .enCloture(enCloture)
                .messageInfo(enRestauration ? MESSAGE_RESTAURATION : enCloture ? MESSAGE_CLOTURE : null)
                .build();
    }

    /** Pied de courriel, en HTML discret ; vide si rien a dire. */
    public String mentionHtml() {
        DonneesSafDto e = etat();
        if (e.getMention() == null || e.getMention().isBlank()) return "";
        return "<p style='color:#5C6B60;font-size:12px;margin-top:14px'>" + e.getMention()
                + (e.isSauvegardeActive() ? " — un crédit mis en place ou un remboursement encaissé aujourd'hui n'apparaît que demain matin." : "")
                + "</p>";
    }

    /** Insere la mention avant la fermeture du bloc principal d'un courriel HTML (ou a la fin). */
    public String annoter(String corpsHtml) {
        String mention = mentionHtml();
        if (corpsHtml == null || mention.isEmpty()) return corpsHtml;
        int i = corpsHtml.lastIndexOf("</div>");
        return i < 0 ? corpsHtml + mention : corpsHtml.substring(0, i) + mention + corpsHtml.substring(i);
    }

    private static String texte(String dateLecture) {
        if (dateLecture == null || dateLecture.isBlank()) return null;
        try {
            return LocalDateTime.parse(dateLecture.trim(), LECTURE).format(AFFICHAGE);
        } catch (Exception e) {
            return dateLecture;
        }
    }
}
