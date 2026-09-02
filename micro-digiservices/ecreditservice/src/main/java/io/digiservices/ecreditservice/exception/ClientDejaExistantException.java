package io.digiservices.ecreditservice.exception;

import lombok.Getter;

/**
 * Tentative de création d'une personne physique dont le code client existe déjà
 * dans le module correction : cas guidé côté frontend (bascule vers la mise à
 * jour de la fiche) plutôt qu'une erreur de validation brute.
 */
@Getter
public class ClientDejaExistantException extends RuntimeException {

    private final String codCliente;

    public ClientDejaExistantException(String codCliente) {
        super("Le client " + codCliente + " existe déjà — utilisez la mise à jour de la fiche signalétique.");
        this.codCliente = codCliente;
    }
}
