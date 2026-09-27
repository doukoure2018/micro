package io.digiservices.ecreditservice.query;

/** SQL du signalement de numero de telephone (table signalement_telephone, V156). */
public class SignalementTelephoneQuery {

    /** Colonnes du signalement enrichies des libelles utilisateur et du statut de la demande liee. */
    private static final String SELECT_BASE = """
            SELECT s.*, pv.libele AS point_vente,
                   TRIM(COALESCE(us.first_name,'') || ' ' || COALESCE(us.last_name,'')) AS signale_par,
                   TRIM(COALESCE(up.first_name,'') || ' ' || COALESCE(up.last_name,'')) AS pris_par,
                   d.statut AS demande_statut
            FROM signalement_telephone s
            LEFT JOIN pointvente pv ON pv.id = s.point_vente_id
            LEFT JOIN users us ON us.user_id = s.signale_par_user_id
            LEFT JOIN users up ON up.user_id = s.pris_par_user_id
            LEFT JOIN demande_changement_telephone d ON d.id = s.demande_id
            """;

    public static final String INSERT_SIGNALEMENT = """
            INSERT INTO signalement_telephone (
                cod_cliente, nom_client, num_credito, cod_agencia, point_vente_id, agence_id, delegation_id,
                tel_principal_constate, tel_secundario_constate, tel_otro_constate,
                motif, commentaire, signale_par_user_id, signale_par_role)
            VALUES (:codCliente, :nomClient, :numCredito, :codAgencia, :pointVenteId, :agenceId, :delegationId,
                :telPrincipal, :telSecundario, :telOtro,
                :motif, :commentaire, :userId, :role)
            RETURNING id
            """;

    public static final String FIND_BY_ID = SELECT_BASE + " WHERE s.id = :id";

    /** Signalement ouvert (NOUVEAU ou PRIS_EN_CHARGE) d'un client, s'il existe. */
    public static final String FIND_OUVERT_PAR_CLIENT = SELECT_BASE + """
             WHERE s.cod_cliente = :codCliente AND s.statut IN ('NOUVEAU', 'PRIS_EN_CHARGE')
            """;

    /** Signalements ouverts sur une liste de codes agence SAF : alimente les etiquettes du TT1. */
    public static final String FIND_OUVERTS_PAR_CODES = SELECT_BASE + """
             WHERE s.cod_agencia IN (:codes) AND s.statut IN ('NOUVEAU', 'PRIS_EN_CHARGE')
             ORDER BY s.signale_at DESC
            """;

    /** Boite de reception d'un point de service (agent de credit) ; statut 'TOUS' = tout l'historique. */
    public static final String FIND_POUR_POINT_SERVICE = SELECT_BASE + """
             WHERE s.cod_agencia = :codAgencia
               AND (:statut = 'TOUS' OR s.statut = :statut)
             ORDER BY CASE s.statut WHEN 'NOUVEAU' THEN 0 WHEN 'PRIS_EN_CHARGE' THEN 1 ELSE 2 END,
                      s.signale_at DESC
            """;

    /** Signalements emis par un utilisateur (suivi du signaleur). */
    public static final String FIND_PAR_SIGNALEUR = SELECT_BASE + """
             WHERE s.signale_par_user_id = :userId
             ORDER BY s.signale_at DESC
            """;

    /** Signalements sur un perimetre de codes SAF, tous statuts (liste du directeur, inspection DI). */
    public static final String FIND_PAR_CODES = SELECT_BASE + """
             WHERE s.cod_agencia IN (:codes)
             ORDER BY CASE s.statut WHEN 'NOUVEAU' THEN 0 WHEN 'PRIS_EN_CHARGE' THEN 1 ELSE 2 END,
                      s.signale_at DESC
            """;

    public static final String COUNT_NOUVEAUX_POINT_SERVICE = """
            SELECT COUNT(*) FROM signalement_telephone
            WHERE cod_agencia = :codAgencia AND statut = 'NOUVEAU'
            """;

    /** Prise en charge : passage NOUVEAU -> PRIS_EN_CHARGE avec la demande creee. */
    public static final String PRENDRE_EN_CHARGE = """
            UPDATE signalement_telephone
            SET statut = 'PRIS_EN_CHARGE', pris_par_user_id = :userId, pris_at = NOW(),
                demande_id = :demandeId, vu_at = COALESCE(vu_at, NOW()), updated_at = NOW()
            WHERE id = :id AND statut = 'NOUVEAU'
            """;

    public static final String CLASSER = """
            UPDATE signalement_telephone
            SET statut = 'CLASSE', classe_at = NOW(), motif_classement = :motif,
                pris_par_user_id = :userId, vu_at = COALESCE(vu_at, NOW()), updated_at = NOW()
            WHERE id = :id AND statut IN ('NOUVEAU', 'PRIS_EN_CHARGE')
            """;

    /** Demande liee validee dans SAF : le signalement est traite. */
    public static final String MARQUER_TRAITE_PAR_DEMANDE = """
            UPDATE signalement_telephone
            SET statut = 'TRAITE', traite_at = NOW(), updated_at = NOW()
            WHERE demande_id = :demandeId AND statut = 'PRIS_EN_CHARGE'
            """;

    /** Demande liee rejetee definitivement : le signalement revient a traiter. */
    public static final String REOUVRIR_PAR_DEMANDE = """
            UPDATE signalement_telephone
            SET statut = 'NOUVEAU', pris_par_user_id = NULL, pris_at = NULL, demande_id = NULL,
                vu_at = NULL, updated_at = NOW()
            WHERE demande_id = :demandeId AND statut = 'PRIS_EN_CHARGE'
            """;

    public static final String MARQUER_VUS_POINT_SERVICE = """
            UPDATE signalement_telephone SET vu_at = NOW(), updated_at = NOW()
            WHERE cod_agencia = :codAgencia AND statut = 'NOUVEAU' AND vu_at IS NULL
            """;

    /** Signalements restes NOUVEAU au-dela du delai, pour la relance courriel (une par jour maximum). */
    public static final String FIND_A_RELANCER = SELECT_BASE + """
             WHERE s.statut = 'NOUVEAU'
               AND s.signale_at < NOW() - make_interval(days => :jours)
               AND (s.derniere_relance_at IS NULL OR s.derniere_relance_at < NOW() - INTERVAL '1 day')
             ORDER BY s.cod_agencia, s.signale_at
            """;

    public static final String MARQUER_RELANCE = """
            UPDATE signalement_telephone
            SET derniere_relance_at = NOW(), nb_relances = nb_relances + 1, updated_at = NOW()
            WHERE id IN (:ids)
            """;
}
