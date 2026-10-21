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
    }

    /** Appele par la sonde a chaque passage. */
    public void memoriser(SanteSafDto sante) {
        this.derniere = sante;
        this.dateSonde = LocalDateTime.now();
    }

    public DonneesSafDto etat() {
        SanteSafDto s = derniere;
        if (s == null) {
            // Premiere demande avant le premier passage de la sonde : une lecture directe, une fois.
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
        return DonneesSafDto.builder()
                .sauvegardeActive(s.isSauvegardeActive())
                .dateDonnees(s.getDateDonneesSauvegarde())
                .dateDonneesTexte(texte)
                .mention(mention)
                .toutOk(s.isToutOk())
                .dateSonde(dateSonde)
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
