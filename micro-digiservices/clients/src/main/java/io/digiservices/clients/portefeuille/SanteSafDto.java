package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Etat des connexions d'ebanking au systeme bancaire, sonde base par base par une
 * connexion directe courte (loginTimeout 5 s) : le message d'erreur SQL Server est rendu tel
 * quel (« Login failed for user 'DIGI'. Reason: The account is disabled. »…) pour que l'alerte
 * nomme la cause, pas seulement le symptome.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SanteSafDto {

    private boolean toutOk;
    private List<Base> bases;
    /** Aiguillage actif : les lectures ordinaires viennent de la sauvegarde. */
    private boolean sauvegardeActive;
    /** La sauvegarde est en cours de restauration (45 min environ, heure variable) : lectures SAF impossibles. */
    private boolean sauvegardeEnRestauration;
    /** Date de restauration de la sauvegarde (yyyy-MM-dd HH:mm:ss), a afficher comme « Donnees SAF au ». */
    private String dateDonneesSauvegarde;
    /**
     * La production refuse le compte de lecture (« account is disabled ») alors que la sauvegarde
     * repond : signature de la <b>cloture SAF</b>, qui desactive le login chaque soir en semaine
     * (mesure du 26 au 28/10/2026 : coupure apres 17 h GMT, retour automatique le soir ou la nuit).
     * Ce n'est pas une panne : les ecrans continuent de lire la sauvegarde.
     */
    private boolean productionEnCloture;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Base {
        private String nom;          // production, sauvegarde, tertiary (agri), middleware
        private String hote;
        private String utilisateur;
        private boolean ok;
        private long dureeMs;
        private String message;      // null si ok
        private String dateRestauration; // sauvegarde / tertiary : date de restauration de la base
    }
}
