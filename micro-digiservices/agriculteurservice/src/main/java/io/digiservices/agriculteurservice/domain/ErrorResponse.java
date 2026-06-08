package io.digiservices.agriculteurservice.domain;

/**
 * Corps d'erreur standard renvoye a AgriPilot.
 */
public record ErrorResponse(int status, String error, String message) {
}
