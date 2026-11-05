package io.digiservices.agriculteurservice.utils;

import io.digiservices.clients.agri.PieceIdentiteDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Le verdict de peremption d'une piece d'identite.
 *
 * <p>Il est calcule a la source plutot que laisse au consommateur : une date d'expiration sans
 * verdict oblige chaque appelant — AgriScore, un tableau de bord, un export — a refaire la
 * comparaison, et l'un d'eux la fera a l'envers. Un dossier de connaissance client ou la piece
 * expiree passe pour valide est exactement ce que la reglementation sanctionne.</p>
 *
 * <p>Le troisieme cas est le plus important : SAF ne porte pas toujours la date. Ne pas savoir
 * n'est PAS la meme chose qu'etre valide, et le verdict reste indetermine plutot que de pencher
 * d'un cote.</p>
 */
class PiecesIdentiteTest {

    private static PieceIdentiteDto piece(LocalDate expiration) {
        return new PieceIdentiteDto("01", "Carte nationale d'identité", "GN2026001", expiration);
    }

    @Test
    @DisplayName("une piece dont la date est passee est perimee")
    void pieceExpiree() {
        PieceIdentiteDto p = piece(LocalDate.now().minusDays(1));
        assertTrue(p.getExpiree());
        assertEquals("GN2026001", p.getNumero());
        assertEquals("Carte nationale d'identité", p.getType());
        assertEquals("01", p.getCodeType());
    }

    @Test
    @DisplayName("une piece qui expire aujourd'hui est encore valable")
    void pieceQuiExpireAujourdhui() {
        // Une piece vaut jusqu'au terme inclus : la refuser le jour meme serait injuste pour le
        // client, et la requete SAF dit la meme chose avec FEC_VENCIM >= la date du jour.
        assertFalse(piece(LocalDate.now()).getExpiree());
    }

    @Test
    @DisplayName("une piece a echeance future est valable")
    void pieceValable() {
        assertFalse(piece(LocalDate.now().plusYears(2)).getExpiree());
    }

    @Test
    @DisplayName("sans date, le verdict reste indetermine")
    void dateInconnue() {
        PieceIdentiteDto p = piece(null);
        assertNull(p.getExpiree(), "ne pas savoir n'est pas la meme chose qu'etre valide");
        assertNull(p.getDateExpiration());
        assertEquals("GN2026001", p.getNumero(), "le numero reste lisible sans sa date");
    }
}
