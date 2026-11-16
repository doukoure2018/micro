package io.digiservices.ecreditservice.query;

/**
 * Desinscription SMS (V208) : la liste de ceux a qui on n'ecrit plus.
 *
 * <p>Un enregistrement par numero, qu'on active et qu'on leve ; le journal garde la trace de
 * chaque geste. Une exclusion doit etre plus facile a poser qu'a lever — et les deux se
 * tracent, parce qu'il faudra pouvoir repondre « depuis quand, et sur quelle demande ? »
 * longtemps apres.</p>
 */
public final class SmsOptoutQuery {

    private SmsOptoutQuery() {
    }

    /** Pose ou repose une exclusion. Reposer apres une levee efface l'etat de levee, pas le journal. */
    public static final String UPSERT_EXCLUSION = """
            INSERT INTO sms_optout (telephone, actif, origine, motif, exclu_par, date_exclusion)
            VALUES (:telephone, TRUE, :origine, :motif, :parUser, CURRENT_TIMESTAMP)
            ON CONFLICT (telephone) DO UPDATE
               SET actif          = TRUE,
                   origine        = EXCLUDED.origine,
                   motif          = EXCLUDED.motif,
                   exclu_par      = EXCLUDED.exclu_par,
                   date_exclusion = CURRENT_TIMESTAMP,
                   leve_par       = NULL,
                   date_levee     = NULL,
                   motif_levee    = NULL
            """;

    public static final String LEVER_EXCLUSION = """
            UPDATE sms_optout
               SET actif       = FALSE,
                   leve_par    = :parUser,
                   date_levee  = CURRENT_TIMESTAMP,
                   motif_levee = :motif
             WHERE telephone = :telephone
               AND actif
            """;

    public static final String INSERT_JOURNAL = """
            INSERT INTO sms_optout_journal (telephone, action, origine, motif, par_user)
            VALUES (:telephone, :action, :origine, :motif, :parUser)
            """;

    /** La question posee a chaque envoi. */
    public static final String EST_EXCLU = """
            SELECT EXISTS (SELECT 1 FROM sms_optout WHERE telephone = :telephone AND actif)
            """;

    public static final String SELECT_PAR_TELEPHONE = """
            SELECT telephone,
                   actif,
                   origine,
                   motif,
                   exclu_par      AS "excluPar",
                   date_exclusion AS "dateExclusion",
                   leve_par       AS "levePar",
                   date_levee     AS "dateLevee",
                   motif_levee    AS "motifLevee"
            FROM sms_optout
            WHERE telephone = :telephone
            """;

    /** Le journal est LU : c'est tout l'interet de l'avoir ecrit. */
    public static final String SELECT_JOURNAL = """
            SELECT telephone, action, origine, motif,
                   par_user    AS "parUser",
                   date_action AS "dateAction"
            FROM sms_optout_journal
            WHERE telephone = :telephone
            ORDER BY date_action DESC
            LIMIT 20
            """;

    public static final String SELECT_EXCLUSIONS = """
            SELECT telephone,
                   actif,
                   origine,
                   motif,
                   exclu_par      AS "excluPar",
                   date_exclusion AS "dateExclusion",
                   leve_par       AS "levePar",
                   date_levee     AS "dateLevee",
                   motif_levee    AS "motifLevee"
            FROM sms_optout
            WHERE actif
              AND (:motif = '%' OR telephone LIKE :motif)
            ORDER BY date_exclusion DESC
            LIMIT :size OFFSET :offset
            """;

    public static final String COUNT_ACTIFS = """
            SELECT COUNT(*) FROM sms_optout WHERE actif
            """;

    /** Ventilation par origine, pour savoir d'ou viennent les demandes. */
    public static final String COUNT_PAR_ORIGINE = """
            SELECT origine, COUNT(*) AS nb
            FROM sms_optout
            WHERE actif
            GROUP BY origine
            ORDER BY nb DESC
            """;
}
