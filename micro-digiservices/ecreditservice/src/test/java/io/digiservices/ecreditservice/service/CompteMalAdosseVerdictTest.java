package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.DossierCompteSafDto;
import io.digiservices.clients.portefeuille.DossierCompteSafDto.CompteSafDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * La verification a l'unite doit dire EXACTEMENT ce que dit la detection horaire.
 *
 * <p>La detection tourne en SQL sur tout le portefeuille ; la verification d'une anomalie relit
 * un seul credit et rejoue la meme regle en Java. Si les deux divergent, un compte paraitra
 * corrige quand l'agence clique, puis reviendra dans la liste au passage suivant — ou l'inverse,
 * et plus personne ne fera confiance a l'ecran.</p>
 *
 * <p>Les cas ci-dessous reprennent un a un les branches du {@code CASE} de
 * {@code SQL_COMPTES_MAL_ADOSSES}, dans le meme ordre de priorite.</p>
 */
class CompteMalAdosseVerdictTest {

    private static final Set<String> ETATS = Set.of("I", "J", "D");
    private static final Set<String> TYPES = Set.of("014", "011");

    private static DossierCompteSafDto credit(String etat, String idCuenta, CompteSafDto compte) {
        return DossierCompteSafDto.builder()
                .codAgencia("103").numCredito(94389L).codCliente("12100005893")
                .nomCliente("AYE BOBO BARRY").indEstado(etat).idCuenta(idCuenta)
                .compteSaisi(compte).build();
    }

    private static CompteSafDto compte(String numero, String client, String etat) {
        return CompteSafDto.builder().numCuenta(numero).codCliente(client)
                .nomCliente("AYE BOBO BARRY").indEstado(etat).build();
    }

    @Test
    @DisplayName("compte courant actif du client : corrigé, la ligne se referme")
    void compteConforme() {
        var v = CompteMalAdosseVerdict.verdict(
                credit("D", "103014000123", compte("103014000123", "12100005893", "A")), ETATS, TYPES);
        assertEquals(CompteMalAdosseVerdict.CORRIGE, v.conclusion());
        assertTrue(v.ferme());
        assertNull(v.famille());
        assertEquals("103014000123", v.compteActuel());
    }

    @Test
    @DisplayName("compte d'épargne actif du client : corrigé aussi")
    void compteEpargneConforme() {
        var v = CompteMalAdosseVerdict.verdict(
                credit("J", "103011000777", compte("103011000777", "12100005893", "A")), ETATS, TYPES);
        assertEquals(CompteMalAdosseVerdict.CORRIGE, v.conclusion());
    }

    @Test
    @DisplayName("aucun compte de remboursement : l'anomalie tient")
    void pasDeCompte() {
        for (String vide : new String[]{null, "", "   "}) {
            var v = CompteMalAdosseVerdict.verdict(credit("D", vide, null), ETATS, TYPES);
            assertEquals(CompteMalAdosseVerdict.TOUJOURS_MAL_ADOSSE, v.conclusion());
            assertEquals("PAS_DE_COMPTE", v.famille());
            assertFalse(v.ferme());
        }
    }

    @Test
    @DisplayName("compte inexistant dans SAF : l'anomalie tient")
    void compteInexistant() {
        var v = CompteMalAdosseVerdict.verdict(credit("D", "103014999999", null), ETATS, TYPES);
        assertEquals("COMPTE_INEXISTANT", v.famille());
        assertTrue(v.explication().contains("103014999999"));
    }

    @Test
    @DisplayName("compte d'un autre client : l'anomalie tient, et le propriétaire est nommé")
    void compteAutreClient() {
        var v = CompteMalAdosseVerdict.verdict(
                credit("D", "103014000123", compte("103014000123", "99900000000", "A")), ETATS, TYPES);
        assertEquals("COMPTE_AUTRE_CLIENT", v.famille());
        assertTrue(v.explication().contains("AYE BOBO BARRY"), v.explication());
    }

    @Test
    @DisplayName("compte du client mais fermé : l'anomalie tient")
    void compteNonActif() {
        var v = CompteMalAdosseVerdict.verdict(
                credit("D", "103014000123", compte("103014000123", "12100005893", "C")), ETATS, TYPES);
        assertEquals("COMPTE_NON_ACTIF", v.famille());
    }

    @Test
    @DisplayName("type de compte non autorisé : l'anomalie tient")
    void typeNonAutorise() {
        var v = CompteMalAdosseVerdict.verdict(
                credit("D", "103951000123", compte("103951000123", "12100005893", "A")), ETATS, TYPES);
        assertEquals("TYPE_NON_AUTORISE", v.famille());
        assertTrue(v.explication().contains("951"), v.explication());
    }

    @Test
    @DisplayName("l'ordre de priorité est celui de la détection SQL")
    void ordreDePriorite() {
        // Un compte d'un AUTRE client, ferme ET de type interdit : c'est « autre client » qui
        // sort, comme dans le CASE de la requete. Annoncer « type non autorise » ferait chercher
        // le mauvais probleme — le pire cas est que l'argent parte chez quelqu'un d'autre.
        var v = CompteMalAdosseVerdict.verdict(
                credit("D", "103951000123", compte("103951000123", "99900000000", "C")), ETATS, TYPES);
        assertEquals("COMPTE_AUTRE_CLIENT", v.famille());
    }

    @Test
    @DisplayName("crédit sorti du périmètre ou disparu : la ligne se referme sans être « corrigée »")
    void horsPerimetre() {
        // Le credit est soldé (C) : il n'est plus surveillé. Ce n'est pas une correction du
        // compte, et le dire evite de compter une regularisation qui n'a pas eu lieu.
        var solde = CompteMalAdosseVerdict.verdict(
                credit("C", "103951000123", compte("103951000123", "99900000000", "C")), ETATS, TYPES);
        assertEquals(CompteMalAdosseVerdict.HORS_PERIMETRE, solde.conclusion());
        assertTrue(solde.ferme());
        assertNull(solde.famille());

        var disparu = CompteMalAdosseVerdict.verdict(null, ETATS, TYPES);
        assertEquals(CompteMalAdosseVerdict.HORS_PERIMETRE, disparu.conclusion());
        assertTrue(disparu.ferme());
        assertTrue(disparu.explication().contains("n'existe plus"));
    }

    @Test
    @DisplayName("le type se lit aux positions 4 à 6, et un numéro trop court n'en a pas")
    void lectureDuType() {
        assertEquals("014", CompteMalAdosseVerdict.typeCompte("103014000123"));
        assertEquals("011", CompteMalAdosseVerdict.typeCompte("  103011000777  "));
        assertEquals("", CompteMalAdosseVerdict.typeCompte("10301"));
        assertEquals("", CompteMalAdosseVerdict.typeCompte(null));
    }

    @Test
    @DisplayName("les états surveillés viennent du paramètre, pas du code")
    void etatsParametrables() {
        // Si la DSIG resserre le perimetre a J seulement, un credit en D doit sortir — comme
        // cote SAF, ou la meme liste pilote le WHERE IND_ESTADO IN (...).
        var v = CompteMalAdosseVerdict.verdict(credit("D", "", null), Set.of("J"), TYPES);
        assertEquals(CompteMalAdosseVerdict.HORS_PERIMETRE, v.conclusion());
    }
}
