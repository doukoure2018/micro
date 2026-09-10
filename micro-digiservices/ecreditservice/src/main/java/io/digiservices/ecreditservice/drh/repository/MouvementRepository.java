package io.digiservices.ecreditservice.drh.repository;

import io.digiservices.ecreditservice.drh.dto.MouvementDtos.BadgeCorrespondanceDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.BadgeInconnuDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementDto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MouvementRepository {

    /** @return 1 si inséré, 0 si l'événement était déjà en base (réimport). */
    int insererMouvement(LocalDate jour, LocalTime heure, String sens, String matricule,
                         String nomBrut, String badgeNo, String credential,
                         String resultat, boolean visiteur, String porte, String lecteurId);

    /** @return nombre de mouvements INCONNU requalifiés pour ce lecteur. */
    int appliquerSensLecteur(String lecteurId, String sens);

    /** Doublon inter-sources : même personne/sens/résultat à moins de `toleranceSecondes`. */
    boolean existeMouvementProche(LocalDate jour, LocalTime heure, String sens, String resultat,
                                  String nomBrut, String matricule, int toleranceSecondes);

    Optional<String> matriculePourBadge(String badgeNo);

    /** @return 1 si la correspondance a été apprise, 0 si le badge était déjà connu. */
    int apprendreBadge(String badgeNo, String matricule);

    /** Tout le personnel ACTIVE : matricule, nom, prenom. */
    List<Map<String, Object>> personnelActifNoms();

    List<MouvementDto> mouvementsPeriode(LocalDate du, LocalDate au, String type);

    /** Événements ACCESS du personnel identifié : matricule, nom, jour, heure, sens (triés). */
    List<Map<String, Object>> mouvementsIdentifiesPeriode(LocalDate du, LocalDate au, String matricule);

    List<BadgeCorrespondanceDto> correspondances();

    List<BadgeInconnuDto> badgesInconnus();

    void associerBadgeManuel(String badgeNo, String matricule);

    /** @return nombre de mouvements ré-identifiés a posteriori. */
    int appliquerBadgeAuxMouvements(String badgeNo, String matricule);

    boolean matriculeConnu(String matricule);

    String parametreTexte(String cle, String defaut);

    // ===== Tableau de bord du jour =====

    /** Badgeages ACCESS du personnel identifié pour un jour : matricule, badgeages, derniere_heure, dernier_sens. */
    List<Map<String, Object>> comptagesBadgeagesJour(LocalDate jour);

    /** Accès refusés du jour : total, max_meme_badge. */
    Map<String, Object> statsBloquesJour(LocalDate jour);

    /** Affectations actives : matricule -> code département. */
    Map<String, String> departementsParMatricule();

    /** Badgeages ACCESS du jour par demi-heure : tableau de 48 compteurs. */
    int[] affluenceParDemiHeure(LocalDate jour);

    /** Mouvements du jour hors plage normale (avant debut ou après fin). */
    int nbHorsPlageJour(LocalDate jour, LocalTime debut, LocalTime fin);

    /** Agents à au moins `seuil` retards sur la période : matricule, nom, nb, minutes. */
    List<Map<String, Object>> recidivesRetard(LocalDate du, LocalDate au, int seuil);

    /** Présences de la période agrégées par département : code, agents, controles, presents, retards, absents_nj. */
    List<Map<String, Object>> statsDepartementsPeriode(LocalDate du, LocalDate au);

    /**
     * Journal drh_alerte réutilisé pour les mouvements : user_id porte le MATRICULE (numérique)
     * et reference_id la semaine (année*1000 + jour de l'an du lundi).
     * @return 1 si l'alerte est nouvelle, 0 si déjà envoyée (anti-doublon).
     */
    int enregistrerAlerte(String type, long userId, long referenceId);

    // ===== Connecteur UniFi Access =====

    void upsertUnifiUser(String unifiId, String matricule, String nom, String employeeNumber, String statut);

    Optional<String> matriculePourUnifiId(String unifiId);
}
