package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.CoupleDeuxPhotos;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCompteDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCoupleDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static io.digiservices.ecreditservice.service.VariationEcarts.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Le classement d'une variation entre deux photos, porte de l'onglet « Évolution » de l'outil.
 *
 * <p>Ce qui est protege : un couple inchange ou sous le seuil ne s'affiche pas ; le statut suit
 * l'ecart (apparu, aggrave, reduit, resolu) ; le cote suit les soldes ; une ligne presente d'un
 * seul cote est nommee comme telle ; l'agregation par compte somme en signe ET en valeur absolue.</p>
 */
class VariationEcartsTest {

    private static BigDecimal d(String v) {
        return new BigDecimal(v);
    }

    private static CoupleDeuxPhotos couple(String ps, String compte,
                                           String ecartJ, String clientJ, String comptaJ, String etatJ,
                                           String ecartR, String clientR, String comptaR, String etatR) {
        return new CoupleDeuxPhotos(ps, "PS " + ps, "AGENCE", "DELEGATION", compte, "01",
                ecartJ == null ? null : d(ecartJ), clientJ == null ? null : d(clientJ),
                comptaJ == null ? null : d(comptaJ), etatJ, ecartJ != null,
                ecartR == null ? null : d(ecartR), clientR == null ? null : d(clientR),
                comptaR == null ? null : d(comptaR), etatR, ecartR != null, null);
    }

    @Test
    @DisplayName("un couple inchange ne s'affiche pas, meme avec un seuil nul")
    void inchange() {
        var c = couple("612", "24100000000", "100", "1000", "-900", "Écart", "100", "1000", "-900", "Écart");
        assertNull(classer(c, BigDecimal.ZERO));
    }

    @Test
    @DisplayName("sous le seuil, la variation est masquee ; au seuil, elle passe")
    void seuil() {
        var c = couple("612", "24100000000", "100", "1000", "-900", "Écart", "0", "900", "-900", "Concordant");
        assertNull(classer(c, d("1000")));
        assertNotNull(classer(c, d("100")));
        assertNull(classer(c, null), "sans seuil, le seuil par defaut (1 000 GNF) masque 100 GNF");
    }

    @Test
    @DisplayName("ecart apparu, cote client : le solde client a bouge seul")
    void apparuClient() {
        var v = classer(couple("612", "24100000000", "5000", "15000", "-10000", "Écart",
                "0", "10000", "-10000", "Concordant"), BigDecimal.ZERO);
        assertEquals(STATUT_APPARU, v.statut());
        assertEquals(COTE_CLIENT, v.cote());
        assertEquals(d("5000"), v.variation());
        assertEquals(d("5000"), v.variationClient());
        assertEquals(0, v.variationComptable().signum());
        assertTrue(v.explication().contains("sans mouvement côté comptabilité"), v.explication());
    }

    @Test
    @DisplayName("ecart resolu, cote comptabilite : la regularisation est passee")
    void resoluComptabilite() {
        var v = classer(couple("612", "24100000000", "0", "15000", "-15000", "Concordant",
                "5000", "15000", "-10000", "Écart"), BigDecimal.ZERO);
        assertEquals(STATUT_RESOLU, v.statut());
        assertEquals(COTE_COMPTABILITE, v.cote());
        assertEquals(d("-5000"), v.variation());
        assertTrue(v.explication().startsWith("l'écart disparaît"), v.explication());
    }

    @Test
    @DisplayName("aggrave et reduit se lisent en valeur absolue, pas en signe")
    void aggraveEtReduit() {
        var aggrave = classer(couple("612", "C", "-8000", "1", "2", "Écart", "-5000", "0", "2", "Écart"), BigDecimal.ZERO);
        var reduit = classer(couple("612", "C", "-2000", "1", "2", "Écart", "-5000", "0", "2", "Écart"), BigDecimal.ZERO);
        assertEquals(STATUT_AGGRAVE, aggrave.statut());
        assertEquals(STATUT_REDUIT, reduit.statut());
        assertEquals(COTE_CLIENT, aggrave.cote());
    }

    @Test
    @DisplayName("un ecart qui change de signe sans changer de taille est un mouvement")
    void mouvement() {
        var v = classer(couple("612", "C", "5000", "1", "2", "Écart", "-5000", "2", "1", "Écart"), BigDecimal.ZERO);
        assertEquals(STATUT_MOUVEMENT, v.statut());
        assertEquals(COTE_LES_DEUX, v.cote());
        assertTrue(v.explication().contains("les deux côtés ont bougé"), v.explication());
    }

    @Test
    @DisplayName("ligne nouvelle et ligne disparue : pas de cote, la variation est l'ecart porte")
    void nouvelleEtDisparue() {
        var nouvelle = classer(couple("612", "C", "7000", "7000", "0", "Sans correspondance comptable",
                null, null, null, null), BigDecimal.ZERO);
        var disparue = classer(couple("612", "C", null, null, null, null,
                "7000", "7000", "0", "Écart"), BigDecimal.ZERO);
        assertEquals(STATUT_NOUVELLE, nouvelle.statut());
        assertNull(nouvelle.cote());
        assertEquals(d("7000"), nouvelle.variation());
        assertEquals(STATUT_DISPARUE, disparue.statut());
        assertEquals(d("-7000"), disparue.variation());
        assertTrue(disparue.explication().contains("portait un écart de 7 000,00 GNF"), disparue.explication());
    }

    @Test
    @DisplayName("l'etat de l'outil prime sur le signe de l'ecart pour dire « en ecart »")
    void etatPrime() {
        assertTrue(enEcart(BigDecimal.ZERO, "Écart mineur"));
        assertFalse(enEcart(d("0.5"), "Concordant"));
        assertTrue(enEcart(null, ""));
        assertFalse(enEcart(BigDecimal.ZERO, null));
    }

    @Test
    @DisplayName("par compte : somme signee, somme absolue, cote dominant et decomptes, le plus gros d'abord")
    void parCompteAgrege() {
        List<VariationCoupleDto> variations = classerTous(List.of(
                couple("612", "A", "5000", "15000", "-10000", "Écart", "0", "10000", "-10000", "Concordant"),
                couple("613", "A", "-5000", "10000", "-15000", "Écart", "0", "10000", "-10000", "Concordant"),
                couple("614", "B", "1000", "1", "2", "Écart", "0", "1", "1", "Concordant"),
                couple("615", "A", "100", "1", "2", "Écart", "0", "1", "1", "Concordant")), d("1000"));
        assertEquals(3, variations.size(), "le couple a 100 GNF est sous le seuil");
        assertEquals(d("5000"), variations.get(0).variation().abs(), "les plus gros d'abord");

        List<VariationCompteDto> comptes = parCompte(variations);
        assertEquals("A", comptes.get(0).compteComptable());
        VariationCompteDto a = comptes.get(0);
        assertEquals(2, a.nbPoints());
        assertEquals(0, a.variationNette().signum(), "deux PS qui se compensent : nette nulle");
        assertEquals(d("10000"), a.variationAbsolue(), "mais 10 000 de mouvement reel");
        assertEquals(COTE_CLIENT, a.coteDominant());
        assertEquals(2, a.nbApparus());

        assertEquals(d("11000"), sommeAggravations(variations));
        assertEquals(0, sommeResolutions(variations).signum());
        assertEquals(0, d("1.0000").compareTo(partCinqPremiers(comptes)));
        assertNull(partCinqPremiers(List.of()));
    }
}
