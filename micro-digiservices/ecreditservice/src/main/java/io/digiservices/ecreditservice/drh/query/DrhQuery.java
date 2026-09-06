package io.digiservices.ecreditservice.drh.query;

public final class DrhQuery {

    private DrhQuery() {
    }

    // ===== Départements =====
    public static final String LISTE_DEPARTEMENTS = """
        SELECT d.departement_id, d.code, d.libelle, d.type, d.delegation_id, d.actif,
               (SELECT COUNT(*) FROM drh_departement_membre m
                 WHERE m.departement_id = d.departement_id AND m.actif) AS nb_membres,
               (SELECT STRING_AGG(u.first_name || ' ' || u.last_name, ', ')
                  FROM drh_departement_membre m JOIN users u ON u.user_id = m.user_id
                 WHERE m.departement_id = d.departement_id AND m.actif AND m.est_responsable) AS responsables
          FROM drh_departement d
         ORDER BY d.code
        """;

    public static final String INSERT_DEPARTEMENT = """
        INSERT INTO drh_departement (code, libelle, type, delegation_id)
        VALUES (:code, :libelle, :type, :delegation_id)
        RETURNING departement_id
        """;

    public static final String UPDATE_DEPARTEMENT = """
        UPDATE drh_departement
           SET code = :code, libelle = :libelle, type = :type,
               delegation_id = :delegation_id, actif = :actif, updated_at = CURRENT_TIMESTAMP
         WHERE departement_id = :departement_id
        """;

    // ===== Membres =====
    public static final String LISTE_MEMBRES = """
        SELECT m.membre_id, m.departement_id, d.code AS departement_code, m.user_id,
               u.first_name || ' ' || u.last_name AS nom_complet, u.username,
               m.matricule, m.fonction, m.est_responsable, m.actif, m.date_affectation
          FROM drh_departement_membre m
          JOIN users u ON u.user_id = m.user_id
          JOIN drh_departement d ON d.departement_id = m.departement_id
         WHERE m.departement_id = :departement_id AND m.actif
         ORDER BY m.est_responsable DESC, nom_complet
        """;

    public static final String DESACTIVER_AFFECTATIONS_USER = """
        UPDATE drh_departement_membre SET actif = FALSE, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = :user_id AND actif
        """;

    public static final String INSERT_MEMBRE = """
        INSERT INTO drh_departement_membre (departement_id, user_id, matricule, fonction, est_responsable)
        VALUES (:departement_id, :user_id, :matricule, :fonction, :est_responsable)
        RETURNING membre_id
        """;

    public static final String RETIRER_MEMBRE = """
        UPDATE drh_departement_membre SET actif = FALSE, updated_at = CURRENT_TIMESTAMP
         WHERE membre_id = :membre_id
        """;

    /** Affectation active de l'utilisateur (contexte, contrôles workflow). */
    public static final String MEMBRE_ACTIF_DE_USER = """
        SELECT m.membre_id, m.departement_id, d.code AS departement_code, m.user_id,
               u.first_name || ' ' || u.last_name AS nom_complet, u.username,
               m.matricule, m.fonction, m.est_responsable, m.actif, m.date_affectation
          FROM drh_departement_membre m
          JOIN users u ON u.user_id = m.user_id
          JOIN drh_departement d ON d.departement_id = m.departement_id
         WHERE m.user_id = :user_id AND m.actif
        """;

    public static final String USERS_NON_AFFECTES = """
        SELECT u.user_id, u.first_name || ' ' || u.last_name AS nom_complet, u.username,
               u.service, u.matricule
          FROM users u
         WHERE u.enabled
           AND NOT EXISTS (SELECT 1 FROM drh_departement_membre m
                            WHERE m.user_id = u.user_id AND m.actif)
         ORDER BY nom_complet
        """;

    public static final String LIBELLE_DEPARTEMENT = """
        SELECT libelle FROM drh_departement WHERE departement_id = :departement_id
        """;

    /** Vérification du matricule dans le fichier du personnel (référentiel des salaires). */
    public static final String PERSONNEL_PAR_MATRICULE = """
        SELECT matricule, nom, prenom, statut
          FROM info_personnel
         WHERE matricule = :matricule
        """;

    // ===== Prévisions =====
    public static final String PREVISION_SELECT = """
        SELECT p.prevision_id, p.user_id, u.first_name || ' ' || u.last_name AS nom_complet,
               m.matricule, m.fonction,
               p.departement_id, d.code AS departement_code, p.exercice, p.statut,
               p.commentaire, p.motif_rejet, p.soumise_le,
               tr.first_name || ' ' || tr.last_name AS traitee_resp_nom, p.traitee_resp_le,
               vd.first_name || ' ' || vd.last_name AS validee_drh_nom, p.validee_drh_le,
               (SELECT COALESCE(SUM(pp.nb_jours),0) FROM drh_prevision_periode pp
                 WHERE pp.prevision_id = p.prevision_id) AS total_jours
          FROM drh_prevision_conge p
          JOIN users u ON u.user_id = p.user_id
          JOIN drh_departement d ON d.departement_id = p.departement_id
          LEFT JOIN drh_departement_membre m ON m.user_id = p.user_id AND m.actif
          LEFT JOIN users tr ON tr.user_id = p.traitee_resp_par
          LEFT JOIN users vd ON vd.user_id = p.validee_drh_par
        """;

    public static final String PREVISION_BY_USER_EXERCICE =
            PREVISION_SELECT + " WHERE p.user_id = :user_id AND p.exercice = :exercice";

    public static final String PREVISION_BY_ID =
            PREVISION_SELECT + " WHERE p.prevision_id = :prevision_id";

    public static final String PREVISIONS_DU_DEPARTEMENT =
            PREVISION_SELECT + """
             WHERE p.departement_id = :departement_id AND p.exercice = :exercice
             ORDER BY nom_complet
            """;

    public static final String PREVISIONS_A_VALIDER_DRH =
            PREVISION_SELECT + """
             WHERE p.statut IN ('ACCEPTEE_RESP','REAJUSTEE_RESP') AND p.exercice = :exercice
             ORDER BY p.traitee_resp_le
            """;

    public static final String INSERT_PREVISION = """
        INSERT INTO drh_prevision_conge (user_id, departement_id, exercice, commentaire)
        VALUES (:user_id, :departement_id, :exercice, :commentaire)
        RETURNING prevision_id
        """;

    public static final String UPDATE_PREVISION_CONTENU = """
        UPDATE drh_prevision_conge
           SET commentaire = :commentaire, updated_at = CURRENT_TIMESTAMP
         WHERE prevision_id = :prevision_id
        """;

    public static final String UPDATE_PREVISION_STATUT = """
        UPDATE drh_prevision_conge
           SET statut = :statut, motif_rejet = :motif_rejet,
               soumise_le = COALESCE(:soumise_le, soumise_le),
               traitee_resp_par = COALESCE(:traitee_resp_par, traitee_resp_par),
               traitee_resp_le = COALESCE(:traitee_resp_le, traitee_resp_le),
               validee_drh_par = COALESCE(:validee_drh_par, validee_drh_par),
               validee_drh_le = COALESCE(:validee_drh_le, validee_drh_le),
               updated_at = CURRENT_TIMESTAMP
         WHERE prevision_id = :prevision_id
        """;

    public static final String DELETE_PERIODES = """
        DELETE FROM drh_prevision_periode WHERE prevision_id = :prevision_id
        """;

    public static final String INSERT_PERIODE = """
        INSERT INTO drh_prevision_periode (prevision_id, date_debut, date_fin, nb_jours)
        VALUES (:prevision_id, :date_debut, :date_fin, :nb_jours)
        """;

    public static final String PERIODES_DE_PREVISION = """
        SELECT periode_id, date_debut, date_fin, nb_jours
          FROM drh_prevision_periode
         WHERE prevision_id = :prevision_id
         ORDER BY date_debut
        """;

    public static final String JOURS_FERIES = """
        SELECT jour FROM drh_jour_ferie WHERE jour BETWEEN :debut AND :fin
        """;

    public static final String JOURS_FERIES_EXERCICE = """
        SELECT jour, libelle FROM drh_jour_ferie
         WHERE EXTRACT(YEAR FROM jour) = :exercice
         ORDER BY jour
        """;

    public static final String PARAMETRE = """
        SELECT valeur FROM drh_parametre WHERE cle = :cle
        """;

    public static final String TELEPHONES_RESPONSABLES = """
        SELECT u.phone FROM drh_departement_membre m
          JOIN users u ON u.user_id = m.user_id
         WHERE m.departement_id = :departement_id AND m.actif AND m.est_responsable
           AND u.phone IS NOT NULL AND u.phone <> ''
        """;

    public static final String TELEPHONES_DRH = """
        SELECT u.phone FROM users u
          JOIN user_roles ur ON ur.user_id = u.user_id
          JOIN roles r ON r.role_id = ur.role_id
         WHERE r.name = 'DRH' AND u.phone IS NOT NULL AND u.phone <> ''
        """;

    public static final String TELEPHONE_USER = """
        SELECT phone FROM users WHERE user_id = :user_id AND phone IS NOT NULL AND phone <> ''
        """;
}
