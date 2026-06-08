package io.digiservices.agriculteurservice.exception;

/**
 * Requete invalide (ex : parametres de pagination hors bornes) -&gt; HTTP 400.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
