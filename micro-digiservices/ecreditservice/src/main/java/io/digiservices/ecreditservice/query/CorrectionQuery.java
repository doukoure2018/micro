package io.digiservices.ecreditservice.query;

public class CorrectionQuery {

    public static final String CREATE_INDIVIDUEL_QUERY = """
        INSERT INTO personne_physique (
            cod_cliente, num_id, type_piece,
            nom_cliente, nom_client, prenom_client,
            tel_principal, tel_otro,
            fec_vencim, fech_nacimiento, date_attente,
            lieux_naiss, nationalite, pays,
            nom_beneficiario, relac_beneficiario,
            det_direccion, cod_provincia, cod_canton, district, agence, code_agence,
            cod_actividad, cod_profesion, cod_sector, type_entre, nbr_annee2,
            ind_sexo, est_civil, conjoint, nbr_enfant,
            type_habit, nbr_annee,
            statut_clt, nature, prov_serv_destino,
            id_user, id_manager_agent, correction_statut
        ) VALUES (
            :codCliente, :numId, :typePiece,
            :nomCliente, :nomClient, :prenomClient,
            :telPrincipal, :telOtro,
            :fecVencim, :fechNacimiento, :dateAttente,
            :lieuxNaiss, :nationalite, :pays,
            :nomBeneficiario, :relacBeneficiario,
            :detDireccion, :codProvincia, :codCanton, :district, :agence, :codeAgence,
            :codActividad, :codProfesion, :codSector, :typeEntre, :nbrAnnee2,
            :indSexo, :estCivil, :conjoint, :nbrEnfant,
            :typeHabit, :nbrAnnee,
            :statutClt, :nature, :provServDestino,
            :idUser, :idManagerAgent, :correctionStatut
        ) RETURNING *
        """;

    public static final String FIND_BY_COD_CLIENTES = """
        SELECT * FROM personne_physique WHERE cod_cliente = :codCliente
        """;

    public static final String UPDATE_BY_COD_CLIENTES = """
        UPDATE personne_physique SET
            num_id = :numId,
            type_piece = :typePiece,
            nom_cliente = :nomCliente,
            nom_client = :nomClient,
            prenom_client = :prenomClient,
            tel_principal = :telPrincipal,
            tel_otro = :telOtro,
            fec_vencim = :fecVencim,
            fech_nacimiento = :fechNacimiento,
            date_attente = :dateAttente,
            lieux_naiss = :lieuxNaiss,
            nationalite = :nationalite,
            pays = :pays,
            nom_beneficiario = :nomBeneficiario,
            relac_beneficiario = :relacBeneficiario,
            det_direccion = :detDireccion,
            cod_provincia = :codProvincia,
            district = :district,
            agence = :agence,
            code_agence = :codeAgence,
            cod_actividad = :codActividad,
            cod_profesion = :codProfesion,
            cod_sector = :codSector,
            type_entre = :typeEntre,
            nbr_annee2 = :nbrAnnee2,
            ind_sexo = :indSexo,
            est_civil = :estCivil,
            conjoint = :conjoint,
            nbr_enfant = :nbrEnfant,
            type_habit = :typeHabit,
            nbr_annee = :nbrAnnee,
            statut_clt = :statutClt,
            nature = :nature,
            prov_serv_destino = :provServDestino,
            correction_statut = :correctionStatut
        WHERE cod_cliente = :codCliente
        RETURNING *
        """;

    public static final String DELETE_BY_COD_CLIENTES = """
        DELETE FROM personne_physique WHERE cod_cliente = :codCliente
        """;


    public static final String GET_ALL_DEMANDE_CORRECTION_ATTENTE_BY_COD_AGENCIA =
            """
               SELECT id, cod_cliente, num_id, type_piece, nom_cliente, nom_client, prenom_client, tel_principal, tel_otro,
                      fec_vencim, fech_nacimiento, date_attente, lieux_naiss, nationalite, pays, nom_beneficiario,
                      relac_beneficiario, det_direccion, cod_provincia,cod_canton, district, agence, code_agence, cod_actividad,
                      cod_profesion, cod_sector, type_entre, nbr_annee2, ind_sexo, est_civil, conjoint, nbr_enfant,
                      type_habit, nbr_annee, statut_clt, nature, prov_serv_destino, id_user, id_manager_agent, created_at,
                      updated_at, correction_statut 
               FROM public.personne_physique 
               WHERE code_agence = :codAgencia 
            """;

    public static final String GET_ALL_DEMANDE_CORRECTION_ATTENTE_BY_COD_AGENCIA_REJET =
            """
               SELECT id, cod_cliente, num_id, type_piece, nom_cliente, nom_client, prenom_client, tel_principal, tel_otro,
                      fec_vencim, fech_nacimiento, date_attente, lieux_naiss, nationalite, pays, nom_beneficiario,
                      relac_beneficiario, det_direccion, cod_provincia,cod_canton, district, agence, code_agence, cod_actividad,
                      cod_profesion, cod_sector, type_entre, nbr_annee2, ind_sexo, est_civil, conjoint, nbr_enfant, 
                      type_habit, nbr_annee, statut_clt, nature, prov_serv_destino, id_user, id_manager_agent, created_at, 
                      updated_at, correction_statut 
               FROM public.personne_physique 
               WHERE code_agence = :codAgencia AND correction_statut='REJETE'
            """;


    // Add these queries to your existing CorrectionQuery class

    // MotifCorrection Queries
    public static final String CREATE_MOTIF_CORRECTION_QUERY = """
        INSERT INTO motif_correction (
            user_id, libele, cod_cliente, cod_agence,
            statut, date_annulation, personne_physique_id
        ) VALUES (
            :userId, :libele, :codCliente, :codAgence,
            :statut, :dateAnnulation, :personnePhysiqueId
        ) RETURNING *
        """;

    public static final String FIND_MOTIF_BY_ID = """
        SELECT * FROM motif_correction WHERE id = :id
        """;

    public static final String FIND_MOTIFS_BY_CLIENT = """
        SELECT * FROM motif_correction
        WHERE cod_cliente = :codCliente
        ORDER BY created_at DESC
        """;

    public static final String FIND_MOTIFS_BY_PERSONNE = """
        SELECT * FROM motif_correction
        WHERE personne_physique_id = :personnePhysiqueId
        ORDER BY created_at DESC 
        """;

    public static final String FIND_MOTIFS_BY_PERSONNE_LAST = """
        SELECT * FROM motif_correction
        WHERE personne_physique_id = :personnePhysiqueId
        ORDER BY created_at DESC LIMIT 1
        """;

    public static final String FIND_MOTIFS_BY_AGENCE = """
        SELECT * FROM motif_correction
        WHERE cod_agence = :codAgence
        ORDER BY created_at DESC
        """;

    public static final String UPDATE_MOTIF_CORRECTION = """
        UPDATE motif_correction SET
            user_id = :userId,
            libele = :libele,
            cod_cliente = :codCliente,
            cod_agence = :codAgence,
            statut = :statut,
            date_annulation = :dateAnnulation,
            personne_physique_id = :personnePhysiqueId
        WHERE id = :id
        RETURNING *
        """;

    public static final String UPDATE_MOTIF_STATUT = """
        UPDATE motif_correction SET
            statut = :statut,
            date_annulation = :dateAnnulation
        WHERE id = :id
        RETURNING *
        """;

    public static final String DELETE_MOTIF_CORRECTION = """
        DELETE FROM motif_correction WHERE id = :id
        """;

    public static final String FIND_MOTIFS_BY_STATUT = """
        SELECT * FROM motif_correction
        WHERE statut = :statut
        ORDER BY created_at DESC
        """;

    public static final String FIND_MOTIFS_BY_USER = """
        SELECT * FROM motif_correction
        WHERE user_id = :userId 
        ORDER BY created_at DESC
        """;

    public static final String FIND_ACTIVE_MOTIFS = """
        SELECT * FROM motif_correction
        WHERE statut = 'EN_COURS' 
        ORDER BY created_at DESC
        """;

    public static final String FIND_MOTIFS_WITH_PERSONNE = """
        SELECT
            mc.*,
            pp.nom_cliente,
            pp.nom_client,
            pp.prenom_client,
            pp.tel_principal
        FROM motif_correction mc
        LEFT JOIN personne_physique pp ON mc.personne_physique_id = pp.id
        WHERE mc.cod_cliente = :codCliente
        ORDER BY mc.created_at DESC
        """;

    public static final String FIND_BY_ID = """
    SELECT * FROM personne_physique WHERE id = :id
    """;

    public static final String UPDATE_CORRECTION_STATUT = """
    UPDATE personne_physique
    SET correction_statut = :correctionStatut,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = :id
    """;

    public static final String CORRECTION_STATS_BY_DELEGATION = """
        SELECT
            d.id AS delegation_id,
            COALESCE(d.libele, 'Non renseignée') AS delegation_libele,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'EN_ATTENTE' THEN 1 ELSE 0 END), 0) AS en_attente,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'REJETE' THEN 1 ELSE 0 END), 0) AS rejete,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'VALIDE' THEN 1 ELSE 0 END), 0) AS valide,
            COUNT(pp.id) AS total
        FROM personne_physique pp
        LEFT JOIN pointvente pv ON pv.code = pp.code_agence
        LEFT JOIN delegation d ON d.id = pv.delegation_id
        GROUP BY d.id, d.libele
        ORDER BY delegation_libele NULLS LAST
        """;

    public static final String CORRECTION_STATS_BY_AGENCE = """
        SELECT
            a.id AS agence_id,
            a.libele AS agence_libele,
            pv.code AS agence_code,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'EN_ATTENTE' THEN 1 ELSE 0 END), 0) AS en_attente,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'REJETE' THEN 1 ELSE 0 END), 0) AS rejete,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'VALIDE' THEN 1 ELSE 0 END), 0) AS valide,
            COUNT(pp.id) AS total
        FROM personne_physique pp
        LEFT JOIN pointvente pv ON pv.code = pp.code_agence
        LEFT JOIN agence a ON a.id = pv.agence_id
        WHERE (pv.delegation_id = :delegationId OR a.delegation_id = :delegationId)
        GROUP BY a.id, a.libele, pv.code
        ORDER BY a.libele
        """;

    public static final String CORRECTION_STATS_BY_POINTVENTE = """
        SELECT
            pv.id AS pointvente_id,
            pv.code AS pointvente_code,
            pv.libele AS pointvente_libele,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'EN_ATTENTE' THEN 1 ELSE 0 END), 0) AS en_attente,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'REJETE' THEN 1 ELSE 0 END), 0) AS rejete,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'VALIDE' THEN 1 ELSE 0 END), 0) AS valide,
            COUNT(pp.id) AS total
        FROM personne_physique pp
        LEFT JOIN pointvente pv ON pv.code = pp.code_agence
        WHERE pv.agence_id = :agenceId
        GROUP BY pv.id, pv.code, pv.libele
        ORDER BY pv.libele
        """;

    public static final String CORRECTION_DETAIL_BY_POINTVENTE = """
        SELECT *
        FROM personne_physique pp
        WHERE pp.code_agence = :codeAgence
          AND (COALESCE(:statut, '') = '' OR pp.correction_statut = :statut)
        ORDER BY pp.created_at DESC
        """;

    /**
     * Évolution des corrections par jour (30 derniers jours)
     */
    public static final String CORRECTION_EVOLUTION_BY_DAY = """
        SELECT
            DATE(pp.created_at) AS date_jour,
            TO_CHAR(DATE(pp.created_at), 'YYYY-MM-DD') AS periode,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'EN_ATTENTE' THEN 1 ELSE 0 END), 0) AS en_attente,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'REJETE' THEN 1 ELSE 0 END), 0) AS rejete,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'VALIDE' THEN 1 ELSE 0 END), 0) AS valide,
            COUNT(pp.id) AS total
        FROM personne_physique pp
        WHERE pp.created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(pp.created_at)
        ORDER BY date_jour ASC
        """;

    /**
     * Évolution des corrections par semaine (12 dernières semaines)
     */
    public static final String CORRECTION_EVOLUTION_BY_WEEK = """
        SELECT
            DATE_TRUNC('week', pp.created_at)::DATE AS date_jour,
            TO_CHAR(DATE_TRUNC('week', pp.created_at), 'IYYY-"S"IW') AS periode,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'EN_ATTENTE' THEN 1 ELSE 0 END), 0) AS en_attente,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'REJETE' THEN 1 ELSE 0 END), 0) AS rejete,
            COALESCE(SUM(CASE WHEN pp.correction_statut = 'VALIDE' THEN 1 ELSE 0 END), 0) AS valide,
            COUNT(pp.id) AS total
        FROM personne_physique pp
        WHERE pp.created_at >= CURRENT_DATE - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', pp.created_at)
        ORDER BY date_jour ASC
        """;
}