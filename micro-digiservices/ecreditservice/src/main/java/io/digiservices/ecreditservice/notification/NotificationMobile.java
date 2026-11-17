package io.digiservices.ecreditservice.notification;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

/** Ce que le centre de notifications de l'application échange (V215). */
public final class NotificationMobile {

    private NotificationMobile() {
    }

    public static final String PORTEFEUILLE = "PORTEFEUILLE";
    public static final String RECOUVREMENT = "RECOUVREMENT";
    public static final String SYNCHRONISATION = "SYNCHRONISATION";
    public static final String RECLAMATION = "RECLAMATION";
    public static final String DOSSIER = "DOSSIER";

    /**
     * Une notification telle que l'agent la relit.
     *
     * <p>{@code envoyee} vaut faux quand le push n'est pas parti — aucun appareil déclaré,
     * projet Expo non rattaché, réseau absent. La notification existe quand même : c'est tout
     * l'intérêt du journal.</p>
     */
    public record Vue(Long id, String categorie, String titre, String corps, String ecran,
                      Map<String, Object> parametres, OffsetDateTime creeeAt,
                      boolean envoyee, boolean lue) {
    }

    /** Ce que l'écran affiche en tête : ses notifications, et combien attendent d'être lues. */
    public record Journal(int nonLues, List<Vue> notifications) {
    }

    /**
     * Une notification à publier.
     *
     * <p>Ni nom de membre ni montant dans {@code titre} et {@code corps} : ils s'affichent sur
     * un écran verrouillé. Le détail s'ouvre dans l'application, après déverrouillage.</p>
     */
    public record APublier(Long userId, String categorie, String titre, String corps,
                           String ecran, Map<String, Object> parametres) {

        public static APublier de(Long userId, String categorie, String titre, String corps,
                                  String ecran) {
            return new APublier(userId, categorie, titre, corps, ecran, Map.of());
        }
    }
}
