package io.digiservices.userservice.enumeration;

public enum EventType {
    REGISTRATION, RESETPASSWORD, USER_CREATED, ACCOUNT_VERIFIED,
    // Canal de courriel generique du notificationservice (destinataire, sujet, corps HTML).
    // Reutilise ici pour envoyer un code de verification de contact, sans ajouter de type
    // a declarer des deux cotes.
    PORTEFEUILLE_ALERTE
}
