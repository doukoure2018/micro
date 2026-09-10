package io.digiservices.ecreditservice.drh.query;

public final class MouvementQuery {

    private MouvementQuery() {
    }

    /** Insertion idempotente d'un événement de la porte : les réimports ne créent pas de doublon. */
    public static final String INSERT_MOUVEMENT = """
        INSERT INTO drh_mouvement (jour, heure, sens, matricule, nom_brut, badge_no, credential, resultat, visiteur, porte, lecteur_id)
        VALUES (:jour, :heure, :sens, :matricule, :nom_brut, :badge_no, :credential, :resultat, :visiteur, :porte, :lecteur_id)
        ON CONFLICT (jour, heure, nom_brut, sens, resultat) DO NOTHING
        """;

    /**
     * Le même badgeage arrive par deux sources (webhook = heure de livraison, CSV = heure de
     * l'événement, numéros de badge différents) : doublon si même personne, même sens, même
     * résultat à moins de :tolerance secondes.
     */
    public static final String EXISTE_MOUVEMENT_PROCHE = """
        SELECT EXISTS (
            SELECT 1 FROM drh_mouvement
             WHERE jour = :jour AND sens = :sens AND resultat = :resultat
               AND (nom_brut = :nom_brut
                    OR (CAST(:matricule AS VARCHAR) IS NOT NULL AND matricule = :matricule))
               AND ABS(EXTRACT(EPOCH FROM (heure - CAST(:heure AS TIME)))) <= :tolerance
        )
        """;

    /** Calibrage a posteriori : applique le sens aux mouvements INCONNU d'un lecteur donné. */
    public static final String APPLIQUER_SENS_LECTEUR = """
        UPDATE drh_mouvement SET sens = :sens
         WHERE lecteur_id = :lecteur_id AND sens = 'INCONNU'
        """;

    public static final String MOUVEMENTS_PERIODE = """
        SELECT m.mouvement_id, m.jour, m.heure, m.sens, m.matricule, m.nom_brut,
               m.badge_no, m.resultat, m.visiteur,
               TRIM(ip.prenom || ' ' || ip.nom) AS nom_personnel
          FROM drh_mouvement m
          LEFT JOIN info_personnel ip ON ip.matricule = m.matricule
         WHERE m.jour BETWEEN :du AND :au
           AND (CAST(:type AS VARCHAR) IS NULL
                OR (:type = 'PERSONNEL' AND m.matricule IS NOT NULL AND m.resultat = 'ACCESS')
                OR (:type = 'VISITEUR' AND m.visiteur AND m.resultat = 'ACCESS')
                OR (:type = 'NON_IDENTIFIE' AND m.matricule IS NULL AND NOT m.visiteur AND m.resultat = 'ACCESS')
                OR (:type = 'ANOMALIE' AND m.resultat <> 'ACCESS'))
         ORDER BY m.jour DESC, m.heure DESC
        """;

    public static final String BADGE_MATRICULE = """
        SELECT matricule FROM drh_badge_correspondance WHERE badge_no = :badge_no
        """;

    /** Apprentissage : n'écrase jamais une correspondance existante (notamment MANUEL). */
    public static final String INSERT_BADGE_AUTO = """
        INSERT INTO drh_badge_correspondance (badge_no, matricule, source)
        VALUES (:badge_no, :matricule, 'AUTO')
        ON CONFLICT (badge_no) DO NOTHING
        """;

    /** Tout le personnel ACTIVE (badgé ou non : la porte voit tout le monde) pour l'identification par nom. */
    public static final String PERSONNEL_ACTIF_NOMS = """
        SELECT matricule, nom, prenom FROM info_personnel WHERE statut = 'ACTIVE'
        """;

    /** Événements ACCESS du personnel identifié, ordonnés pour la reconstruction des intervalles. */
    public static final String MOUVEMENTS_IDENTIFIES_PERIODE = """
        SELECT m.matricule, TRIM(ip.prenom || ' ' || ip.nom) AS nom, m.jour, m.heure, m.sens
          FROM drh_mouvement m
          JOIN info_personnel ip ON ip.matricule = m.matricule
         WHERE m.resultat = 'ACCESS'
           AND m.sens IN ('ENTRY', 'EXIT')
           AND m.jour BETWEEN :du AND :au
           AND (CAST(:matricule AS VARCHAR) IS NULL OR m.matricule = :matricule)
         ORDER BY m.matricule, m.jour, m.heure
        """;

    // ===== Connecteur UniFi Access =====

    public static final String UPSERT_UNIFI_USER = """
        INSERT INTO drh_unifi_user (unifi_id, matricule, nom, employee_number, statut, updated_at)
        VALUES (:unifi_id, :matricule, :nom, :employee_number, :statut, CURRENT_TIMESTAMP)
        ON CONFLICT (unifi_id)
        DO UPDATE SET matricule = COALESCE(EXCLUDED.matricule, drh_unifi_user.matricule),
                      nom = EXCLUDED.nom, employee_number = EXCLUDED.employee_number,
                      statut = EXCLUDED.statut, updated_at = CURRENT_TIMESTAMP
        """;

    public static final String UNIFI_USER_MATRICULE = """
        SELECT matricule FROM drh_unifi_user WHERE unifi_id = :unifi_id AND matricule IS NOT NULL
        """;

    public static final String CORRESPONDANCES = """
        SELECT c.badge_no, c.matricule, c.source,
               TRIM(ip.prenom || ' ' || ip.nom) AS nom_personnel
          FROM drh_badge_correspondance c
          LEFT JOIN info_personnel ip ON ip.matricule = c.matricule
         ORDER BY nom_personnel NULLS LAST, c.badge_no
        """;

    /** Badges vus à la porte (ACCESS, non visiteur) jamais rattachés à un matricule. */
    public static final String BADGES_INCONNUS = """
        SELECT m.badge_no, m.nom_brut, COUNT(*) AS nb_mouvements, MAX(m.jour) AS dernier_jour
          FROM drh_mouvement m
         WHERE m.matricule IS NULL AND NOT m.visiteur AND m.resultat = 'ACCESS'
           AND m.badge_no IS NOT NULL
         GROUP BY m.badge_no, m.nom_brut
         ORDER BY nb_mouvements DESC, m.nom_brut
        """;

    /** Correction DRH : écrase l'apprentissage automatique et devient définitive. */
    public static final String UPSERT_BADGE_MANUEL = """
        INSERT INTO drh_badge_correspondance (badge_no, matricule, source)
        VALUES (:badge_no, :matricule, 'MANUEL')
        ON CONFLICT (badge_no)
        DO UPDATE SET matricule = EXCLUDED.matricule, source = 'MANUEL', updated_at = CURRENT_TIMESTAMP
        """;

    /** Ré-identifie a posteriori les mouvements déjà importés avec ce badge. */
    public static final String APPLIQUER_BADGE_AUX_MOUVEMENTS = """
        UPDATE drh_mouvement
           SET matricule = :matricule
         WHERE badge_no = :badge_no AND matricule IS NULL AND NOT visiteur AND resultat = 'ACCESS'
        """;

    public static final String PARAMETRE_TEXTE = """
        SELECT valeur FROM drh_parametre WHERE cle = :cle
        """;

    // ===== Tableau de bord du jour =====

    /** Badgeages ACCESS du personnel identifié : total, dernier passage et son sens. */
    public static final String COMPTAGES_BADGEAGES_JOUR = """
        SELECT m.matricule,
               COUNT(*)                                       AS badgeages,
               MAX(m.heure)                                   AS derniere_heure,
               (ARRAY_AGG(m.sens ORDER BY m.heure DESC))[1]   AS dernier_sens
          FROM drh_mouvement m
         WHERE m.jour = :jour AND m.resultat = 'ACCESS' AND NOT m.visiteur AND m.matricule IS NOT NULL
         GROUP BY m.matricule
         ORDER BY COUNT(*) DESC, MAX(m.heure) DESC
        """;

    /** Accès refusés du jour : total et pire répétition d'un même badge/libellé. */
    public static final String STATS_BLOQUES_JOUR = """
        SELECT COUNT(*) AS total, COALESCE(MAX(nb), 0) AS max_meme_badge
          FROM (SELECT COUNT(*) AS nb
                  FROM drh_mouvement
                 WHERE jour = :jour AND resultat <> 'ACCESS'
                 GROUP BY COALESCE(badge_no, nom_brut)) s
        """;

    public static final String DEPARTEMENTS_PAR_MATRICULE = """
        SELECT m.matricule, d.code
          FROM drh_departement_membre m
          JOIN drh_departement d ON d.departement_id = m.departement_id
         WHERE m.actif AND m.matricule IS NOT NULL
        """;

    // ===== Tableau de bord — phase 2 =====

    /** Badgeages ACCESS du jour ventilés par heure (0-23). */
    public static final String AFFLUENCE_PAR_HEURE = """
        SELECT EXTRACT(HOUR FROM heure)::int AS h, COUNT(*) AS nb
          FROM drh_mouvement
         WHERE jour = :jour AND resultat = 'ACCESS'
         GROUP BY 1
        """;

    /** Mouvements du jour hors plage normale de badgeage. */
    public static final String HORS_PLAGE_JOUR = """
        SELECT COUNT(*)
          FROM drh_mouvement
         WHERE jour = :jour AND (heure < :debut OR heure > :fin)
        """;

    /** Agents en récidive de retards sur la période (statuts RETARD / RETARD_ET_DEPART). */
    public static final String RECIDIVES_RETARD = """
        SELECT matricule, MAX(nom) AS nom, COUNT(*) AS nb, COALESCE(SUM(minutes_retard), 0) AS minutes
          FROM drh_presence_jour
         WHERE jour BETWEEN :du AND :au AND statut IN ('RETARD', 'RETARD_ET_DEPART')
         GROUP BY matricule
        HAVING COUNT(*) >= :seuil
         ORDER BY COUNT(*) DESC, SUM(minutes_retard) DESC
        """;

    /** Présences de la période agrégées par département (agents affectés uniquement). */
    public static final String STATS_DEPARTEMENTS_PERIODE = """
        SELECT d.code,
               COUNT(DISTINCT pj.matricule)                                        AS agents,
               COUNT(*)                                                            AS controles,
               COUNT(*) FILTER (WHERE pj.statut = 'PRESENT')                       AS presents,
               COUNT(*) FILTER (WHERE pj.statut IN ('RETARD','RETARD_ET_DEPART'))  AS retards,
               COUNT(*) FILTER (WHERE pj.statut = 'ABSENT_NON_JUSTIFIE')           AS absents_nj
          FROM drh_presence_jour pj
          JOIN drh_departement_membre m ON m.matricule = pj.matricule AND m.actif
          JOIN drh_departement d ON d.departement_id = m.departement_id
         WHERE pj.jour BETWEEN :du AND :au
         GROUP BY d.code
         ORDER BY d.code
        """;
}
