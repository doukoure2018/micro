package io.digiservices.agriculteurservice.handler;

import feign.FeignException;
import io.digiservices.agriculteurservice.domain.ErrorResponse;
import io.digiservices.agriculteurservice.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Traduction des erreurs en reponses HTTP coherentes pour AgriPilot.
 *
 * <p>Les statuts metier d'ebanking (404 ressource absente, 503 BDCRG indisponible)
 * sont propages tels quels ; toute autre defaillance amont devient 502 Bad Gateway.</p>
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeign(FeignException ex) {
        HttpStatus status = switch (ex.status()) {
            case 400 -> HttpStatus.BAD_REQUEST;
            case 404 -> HttpStatus.NOT_FOUND;
            case 503 -> HttpStatus.SERVICE_UNAVAILABLE;
            default -> ex.status() <= 0 ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.BAD_GATEWAY;
        };
        log.warn("[AGRI] appel ebanking en echec (status amont={}) -> {}", ex.status(), status.value());
        String message = switch (status) {
            case NOT_FOUND -> "Ressource introuvable";
            case SERVICE_UNAVAILABLE -> "Service de donnees (ebanking/BDCRG) momentanement indisponible";
            case BAD_REQUEST -> "Requete invalide vers le service de donnees";
            default -> "Erreur lors de l'appel au service de donnees";
        };
        return build(status, message);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("[AGRI] erreur inattendue : {}", ex.getMessage(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne");
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String message) {
        return ResponseEntity.status(status)
                .body(new ErrorResponse(status.value(), status.getReasonPhrase(), message));
    }
}
