package io.digiservices.notificationservice.service;

import io.digiservices.notificationservice.domain.StockNotificationData;

public interface EmailService {
    void sendNewAccountHtmlEmail(String name, String to, String token);
    void sendPasswordResetHtmlEmail(String name, String to, String token);
    void sendStockValidationEmail(StockNotificationData data);
    void sendStockRejectionEmail(StockNotificationData data);
    void sendNewTicketHtmlEmail(String name, String email, String ticketTitle, String ticketNumber, String priority);
    void sendNewFilesHtmlEmail(String name, String email, String files, String ticketTitle, String ticketNumber, String priority, String date);

    /** Envoi generique HTML (alertes du portefeuille credits SAF). */
    void sendPortefeuilleAlerteEmail(String to, String sujet, String corpsHtml);

    /**
     * Envoi generique HTML avec une piece jointe (etat TT1 mensuel).
     * contenuBase64 vide ou null : le message part sans piece jointe.
     */
    void sendPortefeuilleAlerteEmailAvecPiece(String to, String sujet, String corpsHtml,
                                              String nomFichier, String contenuBase64, String typeMime);
}
