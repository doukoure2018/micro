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
               dc.date_reprise, dc.jours_recredites, dc.motif_interruption,
               COALESCE(dc.jours_sur_report, 0) AS jours_sur_report
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

    /** V154 : demandes des responsables de département (étape « responsable » traitée par le DGA). */
    public static final String DEMANDES_DES_RESPONSABLES =
            DEMANDE_SELECT + """
             WHERE dc.exercice = :exercice
               AND EXISTS (SELECT 1 FROM drh_departement_membre r
                            WHERE r.user_id = dc.user_id AND r.actif AND r.est_responsable)
             ORDER BY dc.statut, dc.date_debut
            """;

    public static final String DEMANDES_A_VALIDER_DRH =
            DEMANDE_SELECT + """
             WHERE dc.statut = 'ACCEPTEE_RESP' AND dc.exercice = :exercice
             ORDER BY dc.traitee_resp_le
            """;

    /** V153 : congés accordés (validés DRH ou interrompus) — vue DRH « Congés et permissions validés ».
     *  Filtres optionnels : direction, mois (chevauchement avec le mois, l'interrompu s'arrête à la reprise). */
    public static final String DEMANDES_VALIDEES_DRH =
            DEMANDE_SELECT + """
             WHERE dc.statut IN ('VALIDEE_DRH','INTERROMPUE') AND dc.exercice = :exercice
               AND (CAST(:departement_id AS BIGINT) IS NULL OR dc.departement_id = CAST(:departement_id AS BIGINT))
               AND (CAST(:mois AS INTEGER) IS NULL
                    OR (EXTRACT(MONTH FROM dc.date_debut) <= CAST(:mois AS INTEGER)
                        AND EXTRACT(MONTH FROM COALESCE(dc.date_reprise - 1, dc.date_fin)) >= CAST(:mois AS INTEGER)))
             ORDER BY dc.date_debut DESC, dc.demande_id DESC
            """;

    /** V153 : congés accordés se terminant à la date cible, sans alerte de fin déjà envoyée (J-5). */
    public static final String CONGES_FIN_A_RAPPELER = """
        SELECT dc.demande_id, dc.user_id, u.first_name || ' ' || u.last_name AS nom_complet, u.phone,
               dc.departement_id, dc.date_debut, dc.date_fin
          FROM drh_demande_conge dc
          JOIN users u ON u.user_id = dc.user_id
         WHERE dc.statut = 'VALIDEE_DRH'
           AND dc.date_fin = :date_cible
           AND NOT EXISTS (SELECT 1 FROM drh_alerte a
                            WHERE a.type = :type AND a.user_id = dc.user_id
                              AND a.reference_id = dc.demande_id)
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

    // ===== V155 : interruptions déclarées =====

    public static final String INTERRUPTION_SELECT = """
        SELECT i.interruption_id, i.demande_id, i.declaree_par,
               dp.first_name || ' ' || dp.last_name AS declaree_par_nom, i.declaree_le,
               i.date_reprise_souhaitee, i.motif, i.statut, i.traitee_par,
               tp.first_name || ' ' || tp.last_name AS traitee_par_nom, i.traitee_le,
               i.date_reprise_retenue, i.motif_refus,
               dc.user_id, u.first_name || ' ' || u.last_name AS nom_complet, m.matricule,
               dc.departement_id, d.code AS departement_code, dc.exercice,
               dc.date_debut, dc.date_fin, dc.nb_jours, dc.statut AS statut_demande
          FROM drh_interruption i
          JOIN drh_demande_conge dc ON dc.demande_id = i.demande_id
          JOIN users u ON u.user_id = dc.user_id
          JOIN users dp ON dp.user_id = i.declaree_par
          LEFT JOIN users tp ON tp.user_id = i.traitee_par
          JOIN drh_departement d ON d.departement_id = dc.departement_id
          LEFT JOIN drh_departement_membre m ON m.user_id = dc.user_id AND m.actif
        """;

    public static final String INTERRUPTION_BY_ID = INTERRUPTION_SELECT + " WHERE i.interruption_id = :interruption_id";

    public static final String INTERRUPTIONS_A_TRAITER = INTERRUPTION_SELECT + """
         WHERE i.statut = 'DEMANDEE' AND dc.exercice = :exercice
         ORDER BY i.declaree_le
        """;

    public static final String INTERRUPTIONS_DU_DEPARTEMENT = INTERRUPTION_SELECT + """
         WHERE dc.departement_id = :departement_id AND dc.exercice = :exercice
         ORDER BY i.declaree_le DESC
        """;

    public static final String INTERRUPTION_DEMANDEE_EXISTE = """
        SELECT EXISTS (SELECT 1 FROM drh_interruption WHERE demande_id = :demande_id AND statut = 'DEMANDEE')
        """;

    public static final String INSERT_INTERRUPTION = """
        INSERT INTO drh_interruption (demande_id, declaree_par, date_reprise_souhaitee, motif)
        VALUES (:demande_id, :declaree_par, :date_reprise_souhaitee, :motif)
        RETURNING interruption_id
        """;

    public static final String TRAITER_INTERRUPTION = """
        UPDATE drh_interruption
           SET statut = :statut, traitee_par = :traitee_par, traitee_le = CURRENT_TIMESTAMP,
               date_reprise_retenue = :date_reprise_retenue, motif_refus = :motif_refus
         WHERE interruption_id = :interruption_id AND statut = 'DEMANDEE'
        """;

    // ===== V155 : report d'exercice =====

    public static final String REPORT_SELECT = """
        SELECT r.report_id, r.user_id, u.first_name || ' ' || u.last_name AS nom_complet, m.matricule,
               d.code AS departement_code,
               r.exercice_origine, r.exercice_cible, r.jours_reportes, r.jours_consommes, r.date_limite, r.created_at
          FROM drh_report_conge r
          JOIN users u ON u.user_id = r.user_id
          LEFT JOIN drh_departement_membre m ON m.user_id = r.user_id AND m.actif
          LEFT JOIN drh_departement d ON d.departement_id = m.departement_id
        """;

    /** Report utilisable par le salarié sur l'exercice cible (date limite non dépassée). */
    public static final String REPORT_ACTIF_DE_USER = REPORT_SELECT + """
         WHERE r.user_id = :user_id AND r.exercice_cible = :exercice AND r.date_limite >= CURRENT_DATE
        """;

    public static final String REPORTS_EXERCICE_CIBLE = REPORT_SELECT + """
         WHERE r.exercice_cible = :exercice
         ORDER BY d.code NULLS LAST, nom_complet
        """;

    public static final String INSERT_REPORT = """
        INSERT INTO drh_report_conge (user_id, exercice_origine, exercice_cible, jours_reportes, date_limite, cree_par)
        VALUES (:user_id, :exercice_origine, :exercice_cible, :jours_reportes, :date_limite, :cree_par)
        ON CONFLICT (user_id, exercice_origine) DO NOTHING
        """;

    public static final String MAJ_CONSOMMATION_REPORT = """
        UPDATE drh_report_conge
           SET jours_consommes = GREATEST(0, LEAST(jours_reportes, jours_consommes + :delta))
         WHERE user_id = :user_id AND exercice_cible = :exercice
        """;

    public static final String MAJ_JOURS_SUR_REPORT = """
        UPDATE drh_demande_conge SET jours_sur_report = :jours WHERE demande_id = :demande_id
        """;

    /** Salariés concernés par une clôture : membres actifs de l'organisation. */
    public static final String USERS_MEMBRES_ACTIFS = """
        SELECT DISTINCT m.user_id FROM drh_departement_membre m WHERE m.actif
        """;

    public static final String INSERT_ALERTE = """
        INSERT INTO drh_alerte (type, user_id, reference_id)
        VALUES (:type, :user_id, :reference_id)
        ON CONFLICT (type, user_id, reference_id) DO NOTHING
        """;
}
