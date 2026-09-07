package io.digiservices.ecreditservice.drh.query;

public final class PermissionQuery {

    private PermissionQuery() {
    }

    public static final String PERMISSION_SELECT = """
        SELECT ps.permission_id, ps.user_id, u.first_name || ' ' || u.last_name AS nom_complet,
               m.matricule, m.fonction,
               ps.departement_id, d.code AS departement_code, d.libelle AS departement_libelle,
               ps.exercice, ps.motif, ps.lien_parente, ps.precision_motif,
               ps.date_debut, ps.date_fin, ps.nb_jours, ps.statut, ps.motif_rejet, ps.soumise_le,
               tr.first_name || ' ' || tr.last_name AS traitee_resp_nom, ps.traitee_resp_le,
               vd.first_name || ' ' || vd.last_name AS validee_drh_nom, ps.validee_drh_le
          FROM drh_permission_sociale ps
          JOIN users u ON u.user_id = ps.user_id
          JOIN drh_departement d ON d.departement_id = ps.departement_id
          LEFT JOIN drh_departement_membre m ON m.user_id = ps.user_id AND m.actif
          LEFT JOIN users tr ON tr.user_id = ps.traitee_resp_par
          LEFT JOIN users vd ON vd.user_id = ps.validee_drh_par
        """;

    public static final String PERMISSION_BY_ID = PERMISSION_SELECT + " WHERE ps.permission_id = :permission_id";

    public static final String PERMISSIONS_DE_USER =
            PERMISSION_SELECT + """
             WHERE ps.user_id = :user_id AND ps.exercice = :exercice
             ORDER BY ps.date_debut DESC
            """;

    public static final String PERMISSIONS_DU_DEPARTEMENT =
            PERMISSION_SELECT + """
             WHERE ps.departement_id = :departement_id AND ps.exercice = :exercice
             ORDER BY ps.statut, ps.date_debut
            """;

    public static final String PERMISSIONS_A_VALIDER_DRH =
            PERMISSION_SELECT + """
             WHERE ps.statut = 'ACCEPTEE_RESP' AND ps.exercice = :exercice
             ORDER BY ps.traitee_resp_le
            """;

    public static final String INSERT_PERMISSION = """
        INSERT INTO drh_permission_sociale (user_id, departement_id, exercice, motif, lien_parente,
                                            precision_motif, date_debut, date_fin, nb_jours)
        VALUES (:user_id, :departement_id, :exercice, :motif, :lien_parente,
                :precision_motif, :date_debut, :date_fin, :nb_jours)
        RETURNING permission_id
        """;

    public static final String UPDATE_PERMISSION_STATUT = """
        UPDATE drh_permission_sociale
           SET statut = :statut, motif_rejet = :motif_rejet,
               traitee_resp_par = COALESCE(:traitee_resp_par, traitee_resp_par),
               traitee_resp_le  = COALESCE(:traitee_resp_le, traitee_resp_le),
               validee_drh_par  = COALESCE(:validee_drh_par, validee_drh_par),
               validee_drh_le   = COALESCE(:validee_drh_le, validee_drh_le),
               annulee_par      = COALESCE(:annulee_par, annulee_par),
               annulee_le       = COALESCE(:annulee_le, annulee_le),
               updated_at = CURRENT_TIMESTAMP
         WHERE permission_id = :permission_id
        """;

    /** Jours de permission consommés sur l'exercice (validées uniquement). */
    public static final String JOURS_PERMISSION_CONSOMMES = """
        SELECT COALESCE(SUM(nb_jours), 0) FROM drh_permission_sociale
         WHERE user_id = :user_id AND exercice = :exercice AND statut = 'VALIDEE_DRH'
        """;

    /** Permission « en cours » : en circuit, ou validée et pas encore terminée. */
    public static final String PERMISSION_EN_COURS =
            PERMISSION_SELECT + """
             WHERE ps.user_id = :user_id
               AND (ps.statut IN ('SOUMISE','ACCEPTEE_RESP')
                    OR (ps.statut = 'VALIDEE_DRH' AND ps.date_fin >= CURRENT_DATE))
             ORDER BY ps.date_debut
             LIMIT 1
            """;

    public static final String PERMISSIONS_ACTIVES_CHEVAUCHANTES = """
        SELECT COUNT(*) FROM drh_permission_sociale
         WHERE user_id = :user_id
           AND statut IN ('SOUMISE','ACCEPTEE_RESP','VALIDEE_DRH')
           AND NOT (date_fin < :date_debut OR date_debut > :date_fin)
        """;
}
