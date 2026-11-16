package io.digiservices.ecreditservice.dossier;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Le telephone et le web doivent dire LA MEME CHOSE d'un dossier.
 *
 * <p>Le referentiel des etats vit en TypeScript depuis V148 ({@code interface/etat-dossier.ts}).
 * Le telephone ne peut pas le lire : il en existe un jumeau en Java. Deux copies d'une meme
 * regle divergent toujours — sauf si quelque chose les compare. C'est ce que fait cet essai :
 * il LIT le fichier du web, etat par etat, et tombe le jour ou l'un des deux bouge.</p>
 *
 * <p>Pourquoi cela compte : un agent qui lit « Validee DA, chez le DR » sur son telephone et
 * autre chose sur le poste du DA n'a plus aucune raison de croire ni l'un ni l'autre.</p>
 */
class EtatDossierTest {

    private static final Path REFERENTIEL_WEB = Path.of("..", "..", "frontend",
            "ultima-ng-19.0.0", "src", "app", "interface", "etat-dossier.ts");

    private static String source() {
        try {
            return Files.readString(REFERENTIEL_WEB);
        } catch (IOException e) {
            throw new IllegalStateException(
                    "Le referentiel du web est introuvable : " + REFERENTIEL_WEB.toAbsolutePath(), e);
        }
    }

    /** Lit un bloc `const NOM: Record<string, X> = { CLE: 'valeur', ... }` du fichier TypeScript. */
    private static Map<String, String> bloc(String nom) {
        String source = source();
        int debut = source.indexOf("const " + nom);
        assertTrue(debut >= 0, "bloc " + nom + " absent du referentiel web");
        int fin = source.indexOf("};", debut);
        String corps = source.substring(debut, fin);
        Map<String, String> lu = new LinkedHashMap<>();
        Matcher m = Pattern.compile("(\\w+):\\s*'((?:[^'\\\\]|\\\\.)*)'").matcher(corps);
        while (m.find()) {
            lu.put(m.group(1), m.group(2).replace("\\'", "'"));
        }
        return lu;
    }

    @Test
    @DisplayName("chaque etat du web tombe dans la MEME etape cote serveur")
    void memesEtapes() {
        Map<String, String> web = bloc("ETAPES");
        assertFalse(web.isEmpty(), "aucun etat lu : la lecture du referentiel web est cassee");
        web.forEach((etat, etape) -> assertEquals(etape, EtatDossier.etape("EN_ATTENTE", etat),
                "l'etat " + etat + " ne tombe pas dans la meme etape que sur le web"));
    }

    @Test
    @DisplayName("chaque etat du web porte le MEME libelle cote serveur")
    void memesLibelles() {
        Map<String, String> web = bloc("LIBELLES");
        assertFalse(web.isEmpty(), "aucun libelle lu : la lecture du referentiel web est cassee");
        web.forEach((etat, libelle) -> assertEquals(libelle,
                EtatDossier.libelle("EN_ATTENTE", etat, null, null),
                "le libelle de " + etat + " differe de celui du web"));
    }

    @Test
    @DisplayName("rejet, annulation et approbation finale cloturent le dossier")
    void lesTroisFins() {
        assertEquals("REJETE", EtatDossier.etape("REJET", "SELECTION"));
        assertEquals("REJETE", EtatDossier.etape("REJECTED", "SELECTION"));
        assertEquals("ANNULATION", EtatDossier.etape("ANNULE", "SELECTION"));
        assertEquals("APPROUVE", EtatDossier.etape("EN_ATTENTE", "VALIDATED_FINAL"));
        assertTrue(EtatDossier.estCloture("EN_ATTENTE", "VALIDATED_FINAL"));
        assertFalse(EtatDossier.estCloture("EN_ATTENTE", "SELECTION"));
        assertEquals("Rejetée", EtatDossier.libelle("REJET", "SELECTION", null, null));
        assertEquals("Annulée (désistement)", EtatDossier.libelle("ANNULE", "SELECTION", null, null));
    }

    @Test
    @DisplayName("un rejet DG confirme par le DE se dit comme tel, et pas « retour DE »")
    void leRejetDgConfirmeParLeDe() {
        assertEquals("À corriger (rejet DG confirmé par le DE)",
                EtatDossier.libelle("EN_ATTENTE", "CORRECTION_DE", "Montant trop eleve", null));
        assertEquals("À corriger (retour DE)",
                EtatDossier.libelle("EN_ATTENTE", "CORRECTION_DE", null, "Pieces manquantes"));
    }

    @Test
    @DisplayName("« ce dossier attend l'agent » distingue ce qu'il doit faire de ce qu'il attend")
    void cequiAttendLAgent() {
        assertTrue(EtatDossier.attendLAgent("EN_ATTENTE", "SELECTION"), "il doit l'analyser");
        assertTrue(EtatDossier.attendLAgent("EN_ATTENTE", "CORRECTION"), "il doit le corriger");
        assertFalse(EtatDossier.attendLAgent("EN_ATTENTE", "VALIDATED_DA"), "il attend le DR");
        assertFalse(EtatDossier.attendLAgent("EN_ATTENTE", "VALIDATED_FINAL"));
        assertFalse(EtatDossier.attendLAgent("REJET", "SELECTION"));
    }

    @Test
    @DisplayName("un etat inconnu ne fait pas disparaitre le dossier : il tombe en reception")
    void unEtatInconnu() {
        assertEquals("RECEPTION", EtatDossier.etape("EN_ATTENTE", "ETAT_INVENTE_DEMAIN"));
        assertEquals("ETAT_INVENTE_DEMAIN",
                EtatDossier.libelle("EN_ATTENTE", "ETAT_INVENTE_DEMAIN", null, null),
                "faute de libelle, on montre le code brut plutot que rien");
    }
}
