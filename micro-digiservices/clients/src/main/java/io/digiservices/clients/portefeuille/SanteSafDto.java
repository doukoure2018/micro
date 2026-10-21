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
    /** Date de restauration de la sauvegarde (yyyy-MM-dd HH:mm:ss), a afficher comme « Donnees SAF au ». */
    private String dateDonneesSauvegarde;

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
