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
            det_direccion, cod_provincia, district, agence, code_agence,
            cod_actividad, cod_profesion, cod_sector, type_entre, nbr_annee2,
            ind_sexo, est_civil, conjoint, nbr_enfant,
            type_habit, nbr_annee,
            statut_clt, nature, prov_serv_destino,
            id_user, id_manager_agent,correction_statut
        ) VALUES (
            :codCliente, :numId, :typePiece,
            :nomCliente, :nomClient, :prenomClient,
            :telPrincipal, :telOtro,
            :fecVencim, :fechNacimiento, :dateAttente,
            :lieuxNaiss, :nationalite, :pays,
            :nomBeneficiario, :relacBeneficiario,
            :detDireccion, :codProvincia, :district, :agence, :codeAgence,
            :codActividad, :codProfesion, :codSector, :typeEntre, :nbrAnnee2,
            :indSexo, :estCivil, :conjoint, :nbrEnfant,
            :typeHabit, :nbrAnnee,
            :statutClt, :nature, :provServDestino,
            :idUser, :idManagerAgent,:correctionStatut
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
            id_user = :idUser,
            id_manager_agent = :idManagerAgent
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
                      relac_beneficiario, det_direccion, cod_provincia, district, agence, code_agence, cod_actividad, 
                      cod_profesion, cod_sector, type_entre, nbr_annee2, ind_sexo, est_civil, conjoint, nbr_enfant, 
                      type_habit, nbr_annee, statut_clt, nature, prov_serv_destino, id_user, id_manager_agent, created_at, 
                      updated_at, correction_statut 
               FROM public.personne_physique 
               WHERE code_agence = :codAgencia 
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
}