package io.digiservices.ecreditservice.drh.query;

public final class CongeQuery {

    private CongeQuery() {
    }

    public static final String DEMANDE_SELECT = """
        SELECT dc.demande_id, dc.user_id, u.first_name || ' ' || u.last_name AS nom_complet,
               m.matricule, m.fonction,
               dc.departement_id, d.code AS departement_code, d.libelle AS departement_libelle,
               dc.exercice, dc.periode_id, dc.date_debut, dc.date_fin, dc.nb_jours,
               dc.deja_pris, dc.solde_apres, dc.statut, dc.commentaire, dc.motif_rejet,
               dc.soumise_le,
               tr.first_name || ' ' || tr.last_name AS traitee_resp_nom, dc.traitee_resp_le,
               vd.first_name || ' ' || vd.last_name AS validee_drh_nom, dc.validee_drh_le,
               ip.first_name || ' ' || ip.last_name AS interrompue_par_nom, dc.interrompue_le,
               dc.date_reprise, dc.jours_recredites, dc.motif_interruption
          FROM drh_demande_conge dc
          JOIN users u ON u.user_id = dc.user_id
          JOIN drh_departement d ON d.departement_id = dc.departement_id
          LEFT JOIN drh_departement_membre m ON m.user_id = dc.user_id AND m.actif
          LEFT JOIN users tr ON tr.user_id = dc.traitee_resp_par
          LEFT JOIN users vd ON vd.user_id = dc.validee_drh_par
          LEFT JOIN users ip ON ip.user_id = dc.interrompue_par
        """;

    public static final String DEMANDE_BY_ID = DEMANDE_SELECT + " WHERE dc.demande_id = :demande_id";

    public static final String DEMANDES_DE_USER =
            DEMANDE_SELECT + """
             WHERE dc.user_id = :user_id AND dc.exercice = :exercice
             ORDER BY dc.date_debut DESC
            """;

    public static final String DEMANDES_DU_DEPARTEMENT =
            DEMANDE_SELECT + """
             WHERE dc.departement_id = :departement_id AND dc.exercice = :exercice
             ORDER BY dc.statut, dc.date_debut
            """;

    public static final String DEMANDES_A_VALIDER_DRH =
            DEMANDE_SELECT + """
             WHERE dc.statut = 'ACCEPTEE_RESP' AND dc.exercice = :exercice
             ORDER BY dc.traitee_resp_le
            """;

    public static final String INSERT_DEMANDE = """
        INSERT INTO drh_demande_conge (user_id, departement_id, exercice, periode_id,
                                       date_debut, date_fin, nb_jours, deja_pris, solde_apres, commentaire)
        VALUES (:user_id, :departement_id, :exercice, :periode_id,
                :date_debut, :date_fin, :nb_jours, :deja_pris, :solde_apres, :commentaire)
        RETURNING demande_id
        """;

    public static final String UPDATE_DEMANDE_STATUT = """
        UPDATE drh_demande_conge
           SET statut = :statut, motif_rejet = :motif_rejet,
               traitee_resp_par = COALESCE(:traitee_resp_par, traitee_resp_par),
               traitee_resp_le  = COALESCE(:traitee_resp_le, traitee_resp_le),
               validee_drh_par  = COALESCE(:validee_drh_par, validee_drh_par),
               validee_drh_le   = COALESCE(:validee_drh_le, validee_drh_le),
               updated_at = CURRENT_TIMESTAMP
         WHERE demande_id = :demande_id
        """;

    public static final String INTERROMPRE_DEMANDE = """
        UPDATE drh_demande_conge
           SET statut = :statut,
               interrompue_par = :interrompue_par, interrompue_le = CURRENT_TIMESTAMP,
               date_reprise = :date_reprise, jours_recredites = :jours_recredites,
               motif_interruption = :motif_interruption, updated_at = CURRENT_TIMESTAMP
         WHERE demande_id = :demande_id
        """;

    /** Jours consommés sur l'exercice : congés validés (nb_jours) et interrompus (nb_jours - recrédités). */
    public static final String JOURS_CONSOMMES = """
        SELECT COALESCE(SUM(CASE
                   WHEN statut = 'VALIDEE_DRH'  THEN nb_jours
                   WHEN statut = 'INTERROMPUE'  THEN nb_jours - COALESCE(jours_recredites, 0)
                   ELSE 0 END), 0)
          FROM drh_demande_conge
         WHERE user_id = :user_id AND exercice = :exercice
        """;

    /** Demandes actives (en circuit ou validées) qui chevauchent une plage. */
    public static final String DEMANDES_ACTIVES_CHEVAUCHANTES = """
        SELECT COUNT(*) FROM drh_demande_conge
         WHERE user_id = :user_id
           AND statut IN ('SOUMISE','ACCEPTEE_RESP','VALIDEE_DRH')
           AND NOT (date_fin < :date_debut OR date_debut > :date_fin)
        """;

    // ===== Alertes J-14 / J-7 =====

    /** Tranches de prévisions validées démarrant à la date cible, sans demande active adossée
     *  et sans alerte du même type déjà envoyée. */
    public static final String TRANCHES_A_RAPPELER = """
        SELECT pp.periode_id, pp.date_debut, pp.date_fin, pp.nb_jours,
               p.user_id, u.first_name || ' ' || u.last_name AS nom_complet, u.phone,
               p.departement_id
          FROM drh_prevision_periode pp
          JOIN drh_prevision_conge p ON p.prevision_id = pp.prevision_id
          JOIN users u ON u.user_id = p.user_id
         WHERE p.statut = 'VALIDEE_DRH'
           AND pp.date_debut = :date_cible
           AND NOT EXISTS (SELECT 1 FROM drh_demande_conge dcx
                            WHERE dcx.periode_id = pp.periode_id
                              AND dcx.statut IN ('SOUMISE','ACCEPTEE_RESP','VALIDEE_DRH'))
           AND NOT EXISTS (SELECT 1 FROM drh_alerte a
                            WHERE a.type = :type AND a.user_id = p.user_id
                              AND a.reference_id = pp.periode_id)
        """;

    public static final String INSERT_ALERTE = """
        INSERT INTO drh_alerte (type, user_id, reference_id)
        VALUES (:type, :user_id, :reference_id)
        ON CONFLICT (type, user_id, reference_id) DO NOTHING
        """;
}
