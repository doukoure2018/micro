package io.digiservices.ecreditservice.query;

public class ChangementTelephoneQuery {

    public static final String INSERT_DEMANDE = """
            INSERT INTO demande_changement_telephone (
                cod_cliente, nom_client, prenom_client,
                ancien_telephone, nouveau_telephone,
                raison_modification, date_modification_souhaitee,
                demande_par_user_id,
                delegation_id, agence_id, point_vente_id
            ) VALUES (
                :codCliente, :nomClient, :prenomClient,
                :ancienTelephone, :nouveauTelephone,
                :raisonModification, :dateModificationSouhaitee,
                :demandeParUserId,
                :delegationId, :agenceId, :pointVenteId
            )
            RETURNING id
            """;

    public static final String APPROUVER = """
            UPDATE demande_changement_telephone
               SET statut = 'APPROUVE',
                   approuve_par_user_id = :daUserId,
                   approuve_at = NOW(),
                   motif_rejet_courant = NULL
             WHERE id = :id
               AND statut = 'EN_ATTENTE_DA'
            """;

    public static final String CALL_REJETER = """
            SELECT fn_rejeter_changement_telephone(:id, :daUserId, :motif, :definitif)
            """;

    public static final String CALL_RESOUMETTRE = """
            SELECT fn_resoumettre_changement_telephone(:id, :userId, :nouveauTelephone, :raisonModification)
            """;

    public static final String VALIDER_SAF = """
            UPDATE demande_changement_telephone
               SET statut = 'VALIDE_SAF',
                   valide_saf_par_user_id = :userId,
                   valide_saf_at = NOW(),
                   saf_result_code = :resultCode,
                   saf_result_message = :resultMessage
             WHERE id = :id
               AND statut = 'APPROUVE'
            """;

    public static final String UPDATE_SAF_RESULT_ECHEC = """
            UPDATE demande_changement_telephone
               SET saf_result_code = :resultCode,
                   saf_result_message = :resultMessage
             WHERE id = :id
            """;

    private static final String SELECT_BASE = """
            SELECT id AS "id",
                   cod_cliente AS "codCliente",
                   nom_client AS "nomClient",
                   prenom_client AS "prenomClient",
                   ancien_telephone AS "ancienTelephone",
                   nouveau_telephone AS "nouveauTelephone",
                   raison_modification AS "raisonModification",
                   date_modification_souhaitee AS "dateModificationSouhaitee",
                   statut AS "statut",
                   nombre_rejets AS "nombreRejets",
                   motif_rejet_courant AS "motifRejetCourant",
                   demande_par_user_id AS "demandeParUserId",
                   demande_at AS "demandeAt",
                   approuve_par_user_id AS "approuveParUserId",
                   approuve_at AS "approuveAt",
                   rejete_par_user_id AS "rejeteParUserId",
                   rejete_at AS "rejeteAt",
                   valide_saf_par_user_id AS "valideSafParUserId",
                   valide_saf_at AS "valideSafAt",
                   saf_result_code AS "safResultCode",
                   saf_result_message AS "safResultMessage",
                   delegation_id AS "delegationId",
                   agence_id AS "agenceId",
                   point_vente_id AS "pointVenteId",
                   created_at AS "createdAt",
                   updated_at AS "updatedAt"
              FROM demande_changement_telephone
            """;

    public static final String SELECT_BY_ID = SELECT_BASE + " WHERE id = :id";

    public static final String SELECT_ATTENTE_DA_BY_AGENCE = SELECT_BASE + """
             WHERE statut = 'EN_ATTENTE_DA'
               AND (:agenceId IS NULL OR agence_id = :agenceId)
             ORDER BY demande_at ASC
            """;

    public static final String SELECT_BY_DEMANDEUR = SELECT_BASE + """
             WHERE demande_par_user_id = :userId
             ORDER BY demande_at DESC
            """;

    public static final String SELECT_INSPECTION_FILTERED = SELECT_BASE + """
             WHERE (:delegationId IS NULL OR delegation_id = :delegationId)
               AND (:agenceId     IS NULL OR agence_id = :agenceId)
               AND (:pointVenteId IS NULL OR point_vente_id = :pointVenteId)
               AND (:statut       IS NULL OR statut = :statut)
             ORDER BY demande_at DESC
            """;

    public static final String SELECT_HISTORIQUE_BY_DEMANDE = """
            SELECT id AS "id",
                   demande_id AS "demandeId",
                   cycle_numero AS "cycleNumero",
                   action AS "action",
                   motif AS "motif",
                   ancien_telephone_cycle AS "ancienTelephoneCycle",
                   nouveau_telephone_cycle AS "nouveauTelephoneCycle",
                   par_user_id AS "parUserId",
                   par_role AS "parRole",
                   at AS "at"
              FROM demande_changement_telephone_historique
             WHERE demande_id = :demandeId
             ORDER BY cycle_numero ASC, at ASC
            """;

    public static final String COUNT_BY_STATUT_INSPECTION = """
            SELECT statut AS "statut",
                   COUNT(*) AS "total"
              FROM demande_changement_telephone
             WHERE (:delegationId IS NULL OR delegation_id = :delegationId)
               AND (:agenceId     IS NULL OR agence_id = :agenceId)
               AND (:pointVenteId IS NULL OR point_vente_id = :pointVenteId)
             GROUP BY statut
            """;

    private ChangementTelephoneQuery() {}
}
