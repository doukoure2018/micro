package io.digiservices.ecreditservice.drh.query;

public final class PresenceQuery {

    private PresenceQuery() {
    }

    /** Upsert d'un pointage rapproché : les réimports consolident min(entrée) / max(sortie). */
    public static final String UPSERT_POINTAGE = """
        INSERT INTO drh_pointage (jour, matricule, nom_brut, premiere_entree, derniere_sortie)
        VALUES (:jour, :matricule, :nom_brut, :premiere_entree, :derniere_sortie)
        ON CONFLICT (jour, matricule) WHERE matricule IS NOT NULL
        DO UPDATE SET premiere_entree = LEAST(drh_pointage.premiere_entree, EXCLUDED.premiere_entree),
                      derniere_sortie = GREATEST(drh_pointage.derniere_sortie, EXCLUDED.derniere_sortie),
                      nom_brut = EXCLUDED.nom_brut
        """;

    /** Pointage sans matricule connu : conservé tel quel (dédoublonné par jour+nom+heures). */
    public static final String INSERT_POINTAGE_NON_RAPPROCHE = """
        INSERT INTO drh_pointage (jour, matricule, nom_brut, premiere_entree, derniere_sortie)
        SELECT :jour, NULL, :nom_brut, :premiere_entree, :derniere_sortie
        WHERE NOT EXISTS (SELECT 1 FROM drh_pointage
                           WHERE jour = :jour AND matricule IS NULL AND nom_brut = :nom_brut)
        """;

    public static final String POINTAGE_DU_JOUR = """
        SELECT matricule, premiere_entree, derniere_sortie
          FROM drh_pointage
         WHERE jour = :jour AND matricule IS NOT NULL
        """;

    public static final String PERSONNEL_ACTIF = """
        SELECT ip.matricule, ip.nom, ip.prenom, m.user_id
          FROM info_personnel ip
          LEFT JOIN drh_departement_membre m ON m.matricule = ip.matricule AND m.actif
         WHERE ip.statut = 'ACTIVE' AND ip.badge_siege
         ORDER BY ip.nom
        """;

    public static final String UPSERT_PRESENCE_JOUR = """
        INSERT INTO drh_presence_jour (jour, matricule, nom, user_id, statut,
                                       minutes_retard, minutes_depart, justification,
                                       premiere_entree, derniere_sortie, calcule_le)
        VALUES (:jour, :matricule, :nom, :user_id, :statut,
                :minutes_retard, :minutes_depart, :justification,
                :premiere_entree, :derniere_sortie, CURRENT_TIMESTAMP)
        ON CONFLICT (jour, matricule)
        DO UPDATE SET nom = EXCLUDED.nom, user_id = EXCLUDED.user_id, statut = EXCLUDED.statut,
                      minutes_retard = EXCLUDED.minutes_retard, minutes_depart = EXCLUDED.minutes_depart,
                      justification = EXCLUDED.justification,
                      premiere_entree = EXCLUDED.premiere_entree, derniere_sortie = EXCLUDED.derniere_sortie,
                      calcule_le = CURRENT_TIMESTAMP
        """;

    public static final String PRESENCES_PERIODE = """
        SELECT pj.presence_id, pj.jour, pj.matricule, pj.nom, pj.user_id,
               d.code AS departement_code,
               pj.statut, pj.minutes_retard, pj.minutes_depart, pj.justification,
               pj.premiere_entree, pj.derniere_sortie
          FROM drh_presence_jour pj
          LEFT JOIN drh_departement_membre m ON m.user_id = pj.user_id AND m.actif
          LEFT JOIN drh_departement d ON d.departement_id = m.departement_id
         WHERE pj.jour BETWEEN :du AND :au
           AND (CAST(:statut AS VARCHAR) IS NULL OR pj.statut = :statut)
         ORDER BY pj.jour DESC, pj.statut, pj.nom
        """;

    public static final String SYNTHESE_PERIODE = """
        SELECT jour,
               COUNT(*) FILTER (WHERE statut = 'PRESENT') AS presents,
               COUNT(*) FILTER (WHERE statut IN ('RETARD','RETARD_ET_DEPART')) AS retards,
               COUNT(*) FILTER (WHERE statut IN ('DEPART_ANTICIPE','RETARD_ET_DEPART')) AS departs_anticipes,
               COUNT(*) FILTER (WHERE statut = 'ABSENT_JUSTIFIE') AS absents_justifies,
               COUNT(*) FILTER (WHERE statut = 'ABSENT_NON_JUSTIFIE') AS absents_non_justifies,
               COUNT(*) AS total
          FROM drh_presence_jour
         WHERE jour BETWEEN :du AND :au
         GROUP BY jour
         ORDER BY jour
        """;

    public static final String POINTAGES_NON_RAPPROCHES = """
        SELECT jour, nom_brut, premiere_entree, derniere_sortie
          FROM drh_pointage
         WHERE matricule IS NULL AND jour BETWEEN :du AND :au
         ORDER BY jour DESC, nom_brut
        """;

    /** Congé validé (ou interrompu avant reprise) couvrant le jour pour cet agent. */
    public static final String CONGE_COUVRE_JOUR = """
        SELECT EXISTS (
            SELECT 1 FROM drh_demande_conge dc
             WHERE dc.user_id = :user_id
               AND :jour BETWEEN dc.date_debut AND dc.date_fin
               AND (dc.statut = 'VALIDEE_DRH'
                    OR (dc.statut = 'INTERROMPUE' AND :jour < dc.date_reprise))
        )
        """;

    public static final String PERMISSION_COUVRE_JOUR = """
        SELECT EXISTS (
            SELECT 1 FROM drh_permission_sociale ps
             WHERE ps.user_id = :user_id
               AND ps.statut = 'VALIDEE_DRH'
               AND :jour BETWEEN ps.date_debut AND ps.date_fin
        )
        """;

    public static final String PARAMETRE_TEXTE = """
        SELECT valeur FROM drh_parametre WHERE cle = :cle
        """;
}
