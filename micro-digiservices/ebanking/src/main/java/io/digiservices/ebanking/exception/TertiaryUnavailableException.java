package io.digiservices.ebanking.exception;

/**
 * Levee lorsque la datasource tertiary (BDCRG PROD / SAF2000) est injoignable
 * ou que la connexion ne peut etre obtenue / la requete expire.
 *
 * <p>Mappee en HTTP 503 SERVICE_UNAVAILABLE par {@link GlobalExceptionHandler}.</p>
 */
public class TertiaryUnavailableException extends RuntimeException {

    /** La sauvegarde SAF est en cours de restauration (SQL Server : « Cannot open database … requested by the login »). */
    public static final String MESSAGE_RESTAURATION =
            "Veuillez patienter : la base SAF est actuellement en cours de restauration. Revenez dans 30 minutes.";

    public static boolean estEnRestauration(Throwable e) {
        for (Throwable t = e; t != null; t = t.getCause()) {
            String m = t.getMessage();
            if (m != null && (m.contains("Cannot open database") || m.contains("is in the middle of a restore")
                    || m.contains("RESTORING"))) return true;
            if (t.getCause() == t) break;
        }
        return false;
    }


    public TertiaryUnavailableException(String message) {
        super(message);
    }

    public TertiaryUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
