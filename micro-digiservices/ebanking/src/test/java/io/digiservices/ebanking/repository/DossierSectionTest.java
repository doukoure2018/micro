package io.digiservices.ebanking.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.UncategorizedSQLException;

import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Le dossier d'un credit se lit en cinq tables ; une seule qui echoue ne doit plus vider
 * l'ecran. Ce qui est protege ici : reconnaitre une connexion cassee, qui merite un second
 * essai sur une connexion neuve, et extraire le message que l'utilisateur lira.
 *
 * <p>Mesure du 21/11/2026 en production : huit lectures de dossier, huit echecs, toujours sur
 * la cinquieme table (CG_ASTO_DETALLE, cinquante millions de lignes, aucun index sur la date
 * ni sur la reference), toujours avec « Connection reset » — SQLSTATE 08S01.</p>
 */
class DossierSectionTest {

    @Test
    @DisplayName("« Connection reset » et SQLSTATE 08S01 sont reconnus, meme enfouis sous plusieurs causes")
    void connexionCasseeReconnue() {
        SQLException reset = new SQLException("Connection reset", "08S01", 0);
        assertTrue(PortefeuilleRepository.connexionCassee(reset));
        assertTrue(PortefeuilleRepository.connexionCassee(
                new UncategorizedSQLException("dossier.ecritures", "SELECT ...", reset)));
        assertTrue(PortefeuilleRepository.connexionCassee(
                new RuntimeException("enveloppe", new DataAccessResourceFailureException("pool", reset))));
        assertTrue(PortefeuilleRepository.connexionCassee(
                new SQLException("The connection is closed.")));
    }

    @Test
    @DisplayName("une erreur de requete n'est pas une connexion cassee : inutile de la rejouer")
    void autresErreursNonRejouees() {
        assertFalse(PortefeuilleRepository.connexionCassee(
                new SQLException("Invalid column name 'REFERENCIA'", "42S22", 207)));
        assertFalse(PortefeuilleRepository.connexionCassee(new RuntimeException("delai depasse")));
        assertFalse(PortefeuilleRepository.connexionCassee(new SQLException((String) null)));
    }

    /** Java interdit {@code initCause(this)} ; un pilote peut tout de meme se rendre lui-meme. */
    private static class Circulaire extends RuntimeException {
        Circulaire(String message) {
            super(message);
        }

        @Override
        public synchronized Throwable getCause() {
            return this;
        }
    }

    @Test
    @DisplayName("une cause circulaire ne fait pas tourner la recherche en boucle")
    void causeCirculaire() {
        Circulaire boucle = new Circulaire("erreur opaque");
        assertFalse(PortefeuilleRepository.connexionCassee(boucle));
        assertEquals("erreur opaque", PortefeuilleRepository.racine(boucle));
    }

    @Test
    @DisplayName("la raison affichee est la premiere ligne de la cause la plus profonde")
    void raisonLisible() {
        SQLException reset = new SQLException("Connection reset", "08S01", 0);
        assertEquals("Connection reset", PortefeuilleRepository.racine(
                new UncategorizedSQLException("dossier.ecritures", "SELECT ...", reset)));
        assertEquals("Connection reset", PortefeuilleRepository.racine(
                new SQLException("Connection reset\n  suite de la pile\n  et encore", "08S01", 0)));
        assertEquals("IllegalStateException", PortefeuilleRepository.racine(new IllegalStateException()));
        assertEquals("IllegalStateException", PortefeuilleRepository.racine(new IllegalStateException("   ")));
    }
}
