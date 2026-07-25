package io.digiservices.bcrgservice.exception;

/** Erreur de requete cliente (parametres invalides) -> HTTP 400. */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
