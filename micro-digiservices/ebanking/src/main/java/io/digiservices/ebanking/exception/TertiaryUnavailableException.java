package io.digiservices.ebanking.exception;

/**
 * Levee lorsque la datasource tertiary (BDCRG PROD / SAF2000) est injoignable
 * ou que la connexion ne peut etre obtenue / la requete expire.
 *
 * <p>Mappee en HTTP 503 SERVICE_UNAVAILABLE par {@link GlobalExceptionHandler}.</p>
 */
public class TertiaryUnavailableException extends RuntimeException {

    public TertiaryUnavailableException(String message) {
        super(message);
    }

    public TertiaryUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
