package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.DirectionSyntheseDtos.DelegationDto;
import io.digiservices.ecreditservice.dto.DirectionSyntheseDtos.SemaineDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Optional;

/**
 * Les cinq blocs de la synthese hebdomadaire de direction (V198), et la photo qui les garde.
 *
 * <p>Toutes les lectures se font dans la base de digi : aucune ne depend de SAF au moment de
 * l'envoi. C'est volontaire — la production SAF peut etre fermee le lundi matin, elle l'etait
 * des 13 h le 31 octobre pour la cloture de fin de mois — et c'est ce qui permet au courriel de
 * partir completement, tous les lundis.</p>
 *
 * <p>Les fragments de requete partages sont bordes d'espaces et jamais colles a la fin d'un bloc
 * de texte : Java retire les espaces de fin de ligne, et {@code WHERE """ + FRAGMENT} produirait
 * « WHEREetape ». Ce piege a deja coute deux mois de silence aux indicateurs du portefeuille.</p>
 */
@Repository
@RequiredArgsConstructor
public class DirectionSyntheseRepository {

    private final JdbcClient jdbcClient;

    // ==================== Bloc 1 : situation des credits ====================

    /**
     * Les seize etats du circuit ramenes aux cinq etapes, exactement comme pour le partenaire
     * AgriPilot : un seul vocabulaire des demandes dans toute la plateforme.
     */
    private static final String ETAPE = " CASE"
            + "   WHEN d.statut_demande = 'REJET'  THEN 'REFUSE'"
            + "   WHEN d.statut_demande = 'ANNULE' THEN 'ANNULE'"
            + "   WHEN d.validation_state = 'VALIDATED_FINAL' THEN 'ACCORDE'"
            + "   WHEN d.validation_state IN ('NOUVEAU', 'EN_ATTENTE_DA', 'CORRECTION_ACCUEIL') THEN 'RECU'"
            + "   ELSE 'EN_INSTRUCTION'"
            + " END ";

    /** Le stock par etape. La constante est verifiee par un test : voir {@link #ETAPE}. */
    static final String SQL_STOCK_DEMANDES = "SELECT"
            + " count(*) FILTER (WHERE etape = 'RECU')           AS recu,"
            + " count(*) FILTER (WHERE etape = 'EN_INSTRUCTION') AS instruction,"
            + " count(*) FILTER (WHERE etape = 'ACCORDE')        AS accorde,"
            + " count(*) FILTER (WHERE etape = 'REFUSE')         AS refuse,"
            + " count(*) FILTER (WHERE etape = 'ANNULE')         AS annule"
            + " FROM (SELECT" + ETAPE + "AS etape FROM demandeindividuel d) t";

    /** Le stock de dossiers par etape, a l'instant de l'envoi, et les flux de la semaine. */
    public Demandes demandes(LocalDate debut, LocalDate finExclue) {
        int[] stock = jdbcClient.sql(SQL_STOCK_DEMANDES)
                .query((rs, n) -> new int[]{rs.getInt("recu"), rs.getInt("instruction"),
                        rs.getInt("accorde"), rs.getInt("refuse"), rs.getInt("annule")})
                .single();
        return new Demandes(stock[0], stock[1], stock[2], stock[3], stock[4],
                nouveaux(debut, finExclue), arrivees("VALIDATED_FINAL", debut, finExclue),
                sorties("ANNULE", debut, finExclue));
    }

    public record Demandes(int recu, int instruction, int accorde, int refuse, int annule,
                           int nouveauxSemaine, int accordesSemaine, int annulesSemaine) {
    }

    private int nouveaux(LocalDate debut, LocalDate finExclue) {
        return jdbcClient.sql("SELECT count(*) FROM demandeindividuel"
                        + " WHERE createdat >= :debut AND createdat < :fin")
                .param("debut", debut).param("fin", finExclue).query(Integer.class).single();
    }

    /** Les dossiers entres dans un etat du circuit pendant la semaine, d'apres le journal. */
    private int arrivees(String etat, LocalDate debut, LocalDate finExclue) {
        return jdbcClient.sql("SELECT count(DISTINCT demandeindividuel_id) FROM demande_etat_historique"
                        + " WHERE nouvel_etat = :etat"
                        + "   AND date_evenement >= :debut AND date_evenement < :fin")
                .param("etat", etat).param("debut", debut).param("fin", finExclue)
                .query(Integer.class).single();
    }

    /**
     * Les dossiers sortis du circuit pendant la semaine. Mesurable pour les annulations, qui
     * passent par un ecran qui les journalise ; PAS pour les refus, dont le journal ne porte que
     * six evenements depuis le 19/09/2026 quand le stock en compte 237 — les sorties empruntent
     * une voie technique non gardee. Le flux des refus se lit donc dans la variation du stock
     * d'un lundi a l'autre, et le courriel le dit plutot que d'afficher un zero trompeur.
     */
    private int sorties(String statut, LocalDate debut, LocalDate finExclue) {
        return jdbcClient.sql("SELECT count(DISTINCT demandeindividuel_id) FROM demande_etat_historique"
                        + " WHERE nouveau_statut = :statut"
                        + "   AND date_evenement >= :debut AND date_evenement < :fin")
                .param("statut", statut).param("debut", debut).param("fin", finExclue)
                .query(Integer.class).single();
    }

    // ==================== Blocs 2 et 3 : portefeuille et PAR ====================

    /**
     * Le portefeuille du reseau et ses quatre tranches de risque, lus dans la photo quotidienne
     * du portefeuille a risque — la derniere prise au plus tard le jour demande.
     *
     * <p>La photo range un croisement agent x produit par ligne, et chaque credit n'appartient
     * qu'a un croisement : la somme nationale est donc juste. Elle couvrait 184 des 187 points
     * de service au 01/11/2026.</p>
     *
     * <p>Vide quand aucune photo n'a ete prise a cette date ou avant : la premiere date du
     * 29/10/2026, donc la variation hebdomadaire du portefeuille n'existe qu'a partir du
     * deuxieme envoi. Le courriel le dit au lieu de comparer a rien.</p>
     */
    public Optional<Portefeuille> portefeuille(LocalDate auPlusTard) {
        return jdbcClient.sql(SQL_PORTEFEUILLE)
                .param("auPlusTard", auPlusTard)
                .query((rs, n) -> new Portefeuille(
                        rs.getObject("date_photo", LocalDate.class),
                        rs.getInt("credits"), rs.getBigDecimal("encours"),
                        rs.getInt("nb_retard"), rs.getBigDecimal("impaye"), rs.getInt("contentieux"),
                        rs.getBigDecimal("par30_encours"), rs.getInt("par30_nb"),
                        rs.getBigDecimal("par60_encours"), rs.getInt("par60_nb"),
                        rs.getBigDecimal("par90_encours"), rs.getInt("par90_nb"),
                        rs.getBigDecimal("par120_encours"), rs.getInt("par120_nb")))
                .optional();
    }

    static final String SQL_PORTEFEUILLE = "SELECT p.date_photo,"
            + " sum(p.nb_credits)               AS credits,"
            + " sum(p.encours)                  AS encours,"
            + " sum(p.nb_en_retard)             AS nb_retard,"
            + " sum(p.impaye)                   AS impaye,"
            + " sum(p.nb_contentieux_declares)  AS contentieux,"
            + " sum(p.encours_par30)  AS par30_encours,  sum(p.nb_par30)  AS par30_nb,"
            + " sum(p.encours_par60)  AS par60_encours,  sum(p.nb_par60)  AS par60_nb,"
            + " sum(p.encours_par90)  AS par90_encours,  sum(p.nb_par90)  AS par90_nb,"
            + " sum(p.encours_par120) AS par120_encours, sum(p.nb_par120) AS par120_nb"
            + " FROM portefeuille_risque_photo p"
            + " WHERE p.date_photo = (SELECT max(date_photo) FROM portefeuille_risque_photo"
            + "                        WHERE date_photo <= :auPlusTard)"
            + " GROUP BY p.date_photo";

    public record Portefeuille(LocalDate datePhoto, int credits, BigDecimal encours,
                               int nbRetard, BigDecimal impaye, int contentieux,
                               BigDecimal par30Encours, int par30Nb,
                               BigDecimal par60Encours, int par60Nb,
                               BigDecimal par90Encours, int par90Nb,
                               BigDecimal par120Encours, int par120Nb) {
    }

    // ==================== Bloc 4 : assainissement ====================

    /**
     * Le stock des fiches par statut de correction, et ce qui a bouge dans la semaine.
     *
     * <p>La base ne porte aucune date de changement de statut : le flux est date par
     * {@code updated_at}. Mesure du 02/11/2026 qui justifie ce choix : 22 fiches sur 1 331 en
     * attente ont ete modifiees apres leur creation, contre 13 408 sur 15 655 validees — c'est
     * donc bien la decision de correction qui met cette date a jour. Le courriel nomme la
     * mesure, pour que personne ne la prenne pour autre chose.</p>
     */
    public Assainissement assainissement(LocalDate debut, LocalDate finExclue) {
        return jdbcClient.sql(SQL_ASSAINISSEMENT)
                .param("debut", debut).param("fin", finExclue)
                .query((rs, n) -> new Assainissement(rs.getInt("en_attente"), rs.getInt("valide"),
                        rs.getInt("rejete"), rs.getInt("valide_semaine"), rs.getInt("rejete_semaine")))
                .single();
    }

    static final String SQL_ASSAINISSEMENT = "SELECT"
            + " count(*) FILTER (WHERE correction_statut = 'EN_ATTENTE') AS en_attente,"
            + " count(*) FILTER (WHERE correction_statut = 'VALIDE')     AS valide,"
            + " count(*) FILTER (WHERE correction_statut = 'REJETE')     AS rejete,"
            + " count(*) FILTER (WHERE correction_statut = 'VALIDE'"
            + "        AND updated_at >= :debut AND updated_at < :fin)    AS valide_semaine,"
            + " count(*) FILTER (WHERE correction_statut = 'REJETE'"
            + "        AND updated_at >= :debut AND updated_at < :fin)    AS rejete_semaine"
            + " FROM personne_physique";

    public record Assainissement(int enAttente, int valide, int rejete,
                                 int valideSemaine, int rejeteSemaine) {
    }

    // ==================== Bloc 5 : arretes de caisse ====================

    /**
     * L'etat de chaque point de service au dernier jour ouvre tolere, repris de la regle de
     * l'ecran de suivi : jamais remonte, en retard, a valider, a jour.
     *
     * <p>Rien ne garde l'etat passe des arretes : la variation hebdomadaire viendra de la photo
     * de cette synthese, donc a partir du deuxieme envoi.</p>
     */
    static final String SQL_ARRETES = "WITH etats AS ("
                        + "  SELECT CASE"
                        + "           WHEN la.id IS NULL THEN 'JAMAIS_REMONTE'"
                        + "           WHEN la.date_arrete_caisse < :limite THEN 'EN_RETARD'"
                        + "           WHEN la.statut = 'VALIDE' THEN 'A_JOUR'"
                        + "           ELSE 'A_VALIDER'"
                        + "         END AS etat,"
                        + "         CASE WHEN la.date_arrete_caisse < :limite"
                        + "              THEN (:limite - la.date_arrete_caisse) END AS retard"
                        + "    FROM pointvente p"
                        + "    LEFT JOIN LATERAL ("
                        + "        SELECT ac.id, ac.statut, ac.date_arrete_caisse FROM arrete_caisse ac"
                        + "         WHERE ac.pointvente_id = p.id"
                        + "         ORDER BY ac.date_arrete_caisse DESC, ac.created_at DESC LIMIT 1"
                        + "    ) la ON TRUE"
                        + ")"
                        + " SELECT count(*) FILTER (WHERE etat = 'A_JOUR')         AS a_jour,"
                        + "        count(*) FILTER (WHERE etat = 'A_VALIDER')      AS a_valider,"
                        + "        count(*) FILTER (WHERE etat = 'EN_RETARD')      AS en_retard,"
                        + "        count(*) FILTER (WHERE etat = 'JAMAIS_REMONTE') AS jamais,"
                        + "        round(avg(retard), 1) AS retard_moyen"
                        + " FROM etats";

    public Arretes arretes(LocalDate dateLimite) {
        return jdbcClient.sql(SQL_ARRETES)
                .param("limite", dateLimite)
                .query((rs, n) -> new Arretes(rs.getInt("a_jour"), rs.getInt("a_valider"),
                        rs.getInt("en_retard"), rs.getInt("jamais"),
                        rs.getBigDecimal("retard_moyen")))
                .single();
    }

    public record Arretes(int aJour, int aValider, int enRetard, int jamaisRemonte,
                          BigDecimal retardMoyen) {
    }


    // ==================== Le detail par delegation (lot 2) ====================

    /** Le libelle retenu quand un point de service n'est rattache a aucune delegation. */
    public static final String NON_RATTACHE = "Non rattaché";

    /**
     * Le rattachement d'un code SAF a une delegation, UN SEUL point de vente par code.
     *
     * <p>Deux codes sont partages par deux points de vente : 337 (Balandougouba et Sidikila) et
     * 958 (tanene et tondon). Une jointure ordinaire sur {@code pointvente.code} duplique donc
     * leurs lignes — mesure du 02/11/2026 : 30 593 credits au lieu de 30 297, soit 296 de trop.
     * La somme des delegations ne retombait plus sur le national, ce qu'un directeur remarque et
     * qui ruine la confiance dans la synthese entiere. {@code DISTINCT ON} tranche en retenant le
     * plus petit identifiant, de facon stable d'une semaine a l'autre.</p>
     */
    private static final String RATTACHEMENT = "(SELECT DISTINCT ON (code) code, delegation_id"
            + " FROM pointvente WHERE code IS NOT NULL AND code <> '' ORDER BY code, id)";

    /** Les dossiers en instruction et accordes dans la semaine, par delegation. */
    public java.util.List<Object[]> demandesParDelegation(LocalDate debut, LocalDate finExclue) {
        return jdbcClient.sql(SQL_DEMANDES_DELEGATION)
                .param("debut", debut).param("fin", finExclue)
                .query((rs, n) -> new Object[]{versLong(rs.getObject("delegation_id")),
                        rs.getString("delegation"), rs.getInt("instruction"), rs.getInt("accordes")})
                .list();
    }

    static final String SQL_DEMANDES_DELEGATION = "SELECT d.delegation_id,"
            + " COALESCE(dl.libele, '" + NON_RATTACHE + "') AS delegation,"
            + " count(*) FILTER (WHERE etape = 'EN_INSTRUCTION') AS instruction,"
            + " count(*) FILTER (WHERE accorde_semaine) AS accordes"
            + " FROM (SELECT d.delegation AS delegation_id," + ETAPE + "AS etape,"
            + "              EXISTS (SELECT 1 FROM demande_etat_historique h"
            + "                       WHERE h.demandeindividuel_id = d.demandeindividuel_id"
            + "                         AND h.nouvel_etat = 'VALIDATED_FINAL'"
            + "                         AND h.date_evenement >= :debut AND h.date_evenement < :fin)"
            + "                AS accorde_semaine"
            + "         FROM demandeindividuel d) d"
            + " LEFT JOIN delegation dl ON dl.id = d.delegation_id"
            + " GROUP BY d.delegation_id, dl.libele"
            + " HAVING count(*) FILTER (WHERE etape = 'EN_INSTRUCTION') > 0"
            + "     OR count(*) FILTER (WHERE accorde_semaine) > 0"
            + " ORDER BY 4 DESC";

    /**
     * Le portefeuille et les deux tranches qui comptent, par delegation.
     *
     * <p>La photo range les lignes par code SAF de point de service : le rattachement a la
     * delegation passe donc par {@code pointvente.code}, qui est ce code. Un point de service
     * que la table ne connait pas tombe dans « Non rattache » plutot que de disparaitre — sinon
     * la somme des delegations ne retomberait pas sur le national.</p>
     */
    public java.util.List<Object[]> portefeuilleParDelegation(LocalDate datePhoto) {
        return jdbcClient.sql(SQL_PORTEFEUILLE_DELEGATION)
                .param("photo", datePhoto)
                .query((rs, n) -> new Object[]{versLong(rs.getObject("delegation_id")),
                        rs.getString("delegation"), rs.getInt("credits"),
                        rs.getBigDecimal("encours"), rs.getBigDecimal("impaye"),
                        rs.getBigDecimal("par30"), rs.getBigDecimal("par90")})
                .list();
    }

    static final String SQL_PORTEFEUILLE_DELEGATION = "SELECT pv.delegation_id,"
            + " COALESCE(dl.libele, '" + NON_RATTACHE + "') AS delegation,"
            + " sum(p.nb_credits) AS credits, sum(p.encours) AS encours, sum(p.impaye) AS impaye,"
            + " sum(p.encours_par30) AS par30, sum(p.encours_par90) AS par90"
            + " FROM portefeuille_risque_photo p"
            + " LEFT JOIN " + RATTACHEMENT + " pv ON pv.code = p.cod_agencia"
            + " LEFT JOIN delegation dl ON dl.id = pv.delegation_id"
            + " WHERE p.date_photo = :photo"
            + " GROUP BY pv.delegation_id, dl.libele"
            + " ORDER BY 4 DESC";

    /**
     * L'assainissement par delegation. Les fiches portent le code SAF du point de service dans
     * {@code code_agence} : verifie le 02/11/2026, les 17 319 fiches en portent un, et tous sont
     * connus de {@code pointvente}.
     */
    public java.util.List<Object[]> assainissementParDelegation(LocalDate debut, LocalDate finExclue) {
        return jdbcClient.sql(SQL_ASSAINISSEMENT_DELEGATION)
                .param("debut", debut).param("fin", finExclue)
                .query((rs, n) -> new Object[]{versLong(rs.getObject("delegation_id")),
                        rs.getString("delegation"), rs.getInt("en_attente"), rs.getInt("valide_semaine")})
                .list();
    }

    static final String SQL_ASSAINISSEMENT_DELEGATION = "SELECT pv.delegation_id,"
            + " COALESCE(dl.libele, '" + NON_RATTACHE + "') AS delegation,"
            + " count(*) FILTER (WHERE pp.correction_statut = 'EN_ATTENTE') AS en_attente,"
            + " count(*) FILTER (WHERE pp.correction_statut = 'VALIDE'"
            + "        AND pp.updated_at >= :debut AND pp.updated_at < :fin) AS valide_semaine"
            + " FROM personne_physique pp"
            + " LEFT JOIN " + RATTACHEMENT + " pv ON pv.code = pp.code_agence"
            + " LEFT JOIN delegation dl ON dl.id = pv.delegation_id"
            + " GROUP BY pv.delegation_id, dl.libele"
            + " HAVING count(*) FILTER (WHERE pp.correction_statut = 'EN_ATTENTE') > 0"
            + "     OR count(*) FILTER (WHERE pp.correction_statut = 'VALIDE'"
            + "            AND pp.updated_at >= :debut AND pp.updated_at < :fin) > 0"
            + " ORDER BY 3 DESC";

    /** Les points de service en retard ou n'ayant jamais remonte d'arrete, par delegation. */
    public java.util.List<Object[]> arretesParDelegation(LocalDate dateLimite) {
        return jdbcClient.sql(SQL_ARRETES_DELEGATION)
                .param("limite", dateLimite)
                .query((rs, n) -> new Object[]{versLong(rs.getObject("delegation_id")),
                        rs.getString("delegation"), rs.getInt("en_retard"), rs.getInt("jamais")})
                .list();
    }

    static final String SQL_ARRETES_DELEGATION = "SELECT p.delegation_id,"
            + " COALESCE(dl.libele, '" + NON_RATTACHE + "') AS delegation,"
            + " count(*) FILTER (WHERE la.id IS NOT NULL AND la.date_arrete_caisse < :limite) AS en_retard,"
            + " count(*) FILTER (WHERE la.id IS NULL) AS jamais"
            + " FROM pointvente p"
            + " LEFT JOIN delegation dl ON dl.id = p.delegation_id"
            + " LEFT JOIN LATERAL ("
            + "     SELECT ac.id, ac.date_arrete_caisse FROM arrete_caisse ac"
            + "      WHERE ac.pointvente_id = p.id"
            + "      ORDER BY ac.date_arrete_caisse DESC, ac.created_at DESC LIMIT 1"
            + " ) la ON TRUE"
            + " GROUP BY p.delegation_id, dl.libele"
            + " HAVING count(*) FILTER (WHERE la.id IS NOT NULL AND la.date_arrete_caisse < :limite) > 0"
            + "     OR count(*) FILTER (WHERE la.id IS NULL) > 0"
            + " ORDER BY 3 DESC";

    /**
     * Le rattachement de chaque code SAF de point de service a sa delegation, pour ventiler les
     * octrois que SAF rend par point de service.
     */
    public java.util.Map<String, String> delegationParCodeSaf() {
        java.util.Map<String, String> m = new java.util.LinkedHashMap<>();
        jdbcClient.sql("SELECT pv.code, COALESCE(dl.libele, '" + NON_RATTACHE + "') AS delegation"
                        + " FROM " + RATTACHEMENT + " pv"
                        + " LEFT JOIN delegation dl ON dl.id = pv.delegation_id")
                .query((rs, n) -> m.put(rs.getString("code"), rs.getString("delegation")))
                .list();
        return m;
    }

    /** Enregistre le detail par delegation d'une semaine, en remplacant ce qui s'y trouvait. */
    public void enregistrerDelegations(LocalDate semaineDu, java.util.List<DelegationDto> lignes) {
        jdbcClient.sql("DELETE FROM direction_synthese_delegation WHERE semaine_du = :semaine")
                .param("semaine", semaineDu).update();
        for (DelegationDto l : lignes) {
            jdbcClient.sql("INSERT INTO direction_synthese_delegation ("
                            + " semaine_du, delegation_id, delegation,"
                            + " dem_instruction, dem_accordes_semaine, oct_nb, oct_montant,"
                            + " pf_credits, pf_encours, pf_impaye, par30_encours, par90_encours,"
                            + " ass_en_attente, ass_valide_semaine, arr_en_retard, arr_jamais_remonte)"
                            + " VALUES (:semaine, :delegationId, :delegation,"
                            + " :demInstruction, :demAccordes, :octNb, :octMontant,"
                            + " :pfCredits, :pfEncours, :pfImpaye, :par30, :par90,"
                            + " :assEnAttente, :assValide, :arrEnRetard, :arrJamais)")
                    .param("semaine", semaineDu).param("delegationId", l.delegationId())
                    .param("delegation", l.delegation())
                    .param("demInstruction", l.demInstruction())
                    .param("demAccordes", l.demAccordesSemaine())
                    .param("octNb", l.octNb()).param("octMontant", l.octMontant())
                    .param("pfCredits", l.pfCredits()).param("pfEncours", l.pfEncours())
                    .param("pfImpaye", l.pfImpaye())
                    .param("par30", l.par30Encours()).param("par90", l.par90Encours())
                    .param("assEnAttente", l.assEnAttente()).param("assValide", l.assValideSemaine())
                    .param("arrEnRetard", l.arrEnRetard()).param("arrJamais", l.arrJamaisRemonte())
                    .update();
        }
    }

    /** Le detail par delegation d'une semaine deja photographiee. */
    public java.util.List<DelegationDto> delegations(LocalDate semaineDu) {
        return jdbcClient.sql("SELECT delegation_id, delegation,"
                        + " dem_instruction, dem_accordes_semaine, oct_nb, oct_montant,"
                        + " pf_credits, pf_encours, pf_impaye, par30_encours, par90_encours,"
                        + " ass_en_attente, ass_valide_semaine, arr_en_retard, arr_jamais_remonte"
                        + " FROM direction_synthese_delegation"
                        + " WHERE semaine_du = :semaine"
                        + " ORDER BY pf_encours DESC NULLS LAST, delegation")
                .param("semaine", semaineDu)
                .query((rs, n) -> new DelegationDto(versLong(rs.getObject("delegation_id")),
                        rs.getString("delegation"),
                        (Integer) rs.getObject("dem_instruction"),
                        (Integer) rs.getObject("dem_accordes_semaine"),
                        (Integer) rs.getObject("oct_nb"), rs.getBigDecimal("oct_montant"),
                        (Integer) rs.getObject("pf_credits"), rs.getBigDecimal("pf_encours"),
                        rs.getBigDecimal("pf_impaye"), rs.getBigDecimal("par30_encours"),
                        rs.getBigDecimal("par90_encours"),
                        (Integer) rs.getObject("ass_en_attente"),
                        (Integer) rs.getObject("ass_valide_semaine"),
                        (Integer) rs.getObject("arr_en_retard"),
                        (Integer) rs.getObject("arr_jamais_remonte")))
                .list();
    }

    // ==================== La photo hebdomadaire ====================

    /** La semaine demandee, si elle a deja ete photographiee. */
    public Optional<SemaineDto> photo(LocalDate semaineDu) {
        return jdbcClient.sql(SELECT_PHOTO + " WHERE semaine_du = :semaine AND NOT essai")
                .param("semaine", semaineDu).query(DirectionSyntheseRepository::versSemaine).optional();
    }

    /** Les dernieres semaines photographiees, pour la page de relecture du lot 3. */
    public java.util.List<SemaineDto> photos(int limite) {
        return jdbcClient.sql(SELECT_PHOTO + " WHERE NOT essai ORDER BY semaine_du DESC LIMIT :limite")
                .param("limite", limite).query(DirectionSyntheseRepository::versSemaine).list();
    }

    private static final String SELECT_PHOTO = "SELECT semaine_du, semaine_au,"
            + " dem_recu, dem_instruction, dem_accorde, dem_refuse, dem_annule,"
            + " dem_nouveaux_semaine, dem_accordes_semaine, dem_annules_semaine,"
            + " pf_date_photo, pf_credits, pf_encours, pf_nb_retard, pf_impaye, pf_contentieux,"
            + " par30_encours, par30_nb, par60_encours, par60_nb,"
            + " par90_encours, par90_nb, par120_encours, par120_nb,"
            + " ass_en_attente, ass_valide, ass_rejete, ass_valide_semaine, ass_rejete_semaine,"
            + " arr_date_limite, arr_a_jour, arr_a_valider, arr_en_retard, arr_jamais_remonte,"
            + " arr_retard_moyen, oct_nb, oct_montant, oct_indisponible,"
            + " envoye_at, nb_destinataires, essai"
            + " FROM direction_synthese_semaine";

    /**
     * Enregistre la semaine. Un deuxieme passage le meme lundi met la ligne a jour plutot que
     * d'en creer une seconde : c'est ce qui rend l'envoi rejouable sans fausser l'historique.
     */
    public void enregistrer(SemaineDto s, boolean essai) {
        jdbcClient.sql("INSERT INTO direction_synthese_semaine ("
                        + " semaine_du, semaine_au,"
                        + " dem_recu, dem_instruction, dem_accorde, dem_refuse, dem_annule,"
                        + " dem_nouveaux_semaine, dem_accordes_semaine, dem_annules_semaine,"
                        + " pf_date_photo, pf_credits, pf_encours, pf_nb_retard, pf_impaye, pf_contentieux,"
                        + " par30_encours, par30_nb, par60_encours, par60_nb,"
                        + " par90_encours, par90_nb, par120_encours, par120_nb,"
                        + " ass_en_attente, ass_valide, ass_rejete, ass_valide_semaine, ass_rejete_semaine,"
                        + " arr_date_limite, arr_a_jour, arr_a_valider, arr_en_retard, arr_jamais_remonte,"
                        + " arr_retard_moyen, oct_nb, oct_montant, oct_indisponible,"
                        + " envoye_at, nb_destinataires, essai)"
                        + " VALUES ("
                        + " :semaineDu, :semaineAu,"
                        + " :demRecu, :demInstruction, :demAccorde, :demRefuse, :demAnnule,"
                        + " :demNouveaux, :demAccordes, :demAnnules,"
                        + " :pfDatePhoto, :pfCredits, :pfEncours, :pfNbRetard, :pfImpaye, :pfContentieux,"
                        + " :par30Encours, :par30Nb, :par60Encours, :par60Nb,"
                        + " :par90Encours, :par90Nb, :par120Encours, :par120Nb,"
                        + " :assEnAttente, :assValide, :assRejete, :assValideSemaine, :assRejeteSemaine,"
                        + " :arrDateLimite, :arrAJour, :arrAValider, :arrEnRetard, :arrJamais,"
                        + " :arrRetardMoyen, :octNb, :octMontant, :octIndisponible,"
                        + " CURRENT_TIMESTAMP, :nbDestinataires, :essai)"
                        + " ON CONFLICT (semaine_du) DO UPDATE SET"
                        + " semaine_au = EXCLUDED.semaine_au,"
                        + " dem_recu = EXCLUDED.dem_recu, dem_instruction = EXCLUDED.dem_instruction,"
                        + " dem_accorde = EXCLUDED.dem_accorde, dem_refuse = EXCLUDED.dem_refuse,"
                        + " dem_annule = EXCLUDED.dem_annule,"
                        + " dem_nouveaux_semaine = EXCLUDED.dem_nouveaux_semaine,"
                        + " dem_accordes_semaine = EXCLUDED.dem_accordes_semaine,"
                        + " dem_annules_semaine = EXCLUDED.dem_annules_semaine,"
                        + " pf_date_photo = EXCLUDED.pf_date_photo, pf_credits = EXCLUDED.pf_credits,"
                        + " pf_encours = EXCLUDED.pf_encours, pf_nb_retard = EXCLUDED.pf_nb_retard,"
                        + " pf_impaye = EXCLUDED.pf_impaye, pf_contentieux = EXCLUDED.pf_contentieux,"
                        + " par30_encours = EXCLUDED.par30_encours, par30_nb = EXCLUDED.par30_nb,"
                        + " par60_encours = EXCLUDED.par60_encours, par60_nb = EXCLUDED.par60_nb,"
                        + " par90_encours = EXCLUDED.par90_encours, par90_nb = EXCLUDED.par90_nb,"
                        + " par120_encours = EXCLUDED.par120_encours, par120_nb = EXCLUDED.par120_nb,"
                        + " ass_en_attente = EXCLUDED.ass_en_attente, ass_valide = EXCLUDED.ass_valide,"
                        + " ass_rejete = EXCLUDED.ass_rejete,"
                        + " ass_valide_semaine = EXCLUDED.ass_valide_semaine,"
                        + " ass_rejete_semaine = EXCLUDED.ass_rejete_semaine,"
                        + " arr_date_limite = EXCLUDED.arr_date_limite, arr_a_jour = EXCLUDED.arr_a_jour,"
                        + " arr_a_valider = EXCLUDED.arr_a_valider, arr_en_retard = EXCLUDED.arr_en_retard,"
                        + " arr_jamais_remonte = EXCLUDED.arr_jamais_remonte,"
                        + " arr_retard_moyen = EXCLUDED.arr_retard_moyen,"
                        + " oct_nb = EXCLUDED.oct_nb, oct_montant = EXCLUDED.oct_montant,"
                        + " oct_indisponible = EXCLUDED.oct_indisponible,"
                        + " envoye_at = CURRENT_TIMESTAMP,"
                        + " nb_destinataires = EXCLUDED.nb_destinataires,"
                        + " essai = EXCLUDED.essai,"
                        + " calcule_at = CURRENT_TIMESTAMP")
                .param("semaineDu", s.semaineDu()).param("semaineAu", s.semaineAu())
                .param("demRecu", s.demRecu()).param("demInstruction", s.demInstruction())
                .param("demAccorde", s.demAccorde()).param("demRefuse", s.demRefuse())
                .param("demAnnule", s.demAnnule())
                .param("demNouveaux", s.demNouveauxSemaine())
                .param("demAccordes", s.demAccordesSemaine())
                .param("demAnnules", s.demAnnulesSemaine())
                .param("pfDatePhoto", s.pfDatePhoto()).param("pfCredits", s.pfCredits())
                .param("pfEncours", s.pfEncours()).param("pfNbRetard", s.pfNbRetard())
                .param("pfImpaye", s.pfImpaye()).param("pfContentieux", s.pfContentieux())
                .param("par30Encours", s.par30Encours()).param("par30Nb", s.par30Nb())
                .param("par60Encours", s.par60Encours()).param("par60Nb", s.par60Nb())
                .param("par90Encours", s.par90Encours()).param("par90Nb", s.par90Nb())
                .param("par120Encours", s.par120Encours()).param("par120Nb", s.par120Nb())
                .param("assEnAttente", s.assEnAttente()).param("assValide", s.assValide())
                .param("assRejete", s.assRejete())
                .param("assValideSemaine", s.assValideSemaine())
                .param("assRejeteSemaine", s.assRejeteSemaine())
                .param("arrDateLimite", s.arrDateLimite()).param("arrAJour", s.arrAJour())
                .param("arrAValider", s.arrAValider()).param("arrEnRetard", s.arrEnRetard())
                .param("arrJamais", s.arrJamaisRemonte())
                .param("arrRetardMoyen", s.arrRetardMoyen())
                .param("octNb", s.octNb()).param("octMontant", s.octMontant())
                .param("octIndisponible", s.octIndisponible())
                .param("nbDestinataires", s.nbDestinataires()).param("essai", essai)
                .update();
    }

    /**
     * Un identifiant de delegation, quel que soit le type que Postgres rend.
     *
     * <p>{@code delegation.id} et {@code pointvente.delegation_id} sont des {@code bigint}, mais
     * {@code demandeindividuel.delegation} est un {@code integer} : le MEME identifiant logique
     * arrive donc en {@code Long} ou en {@code Integer} selon la table lue. Un transtypage
     * direct echoue a l'execution et seulement la — c'est ce qui a fait tomber le premier envoi
     * du 02/11/2026 a 08 h 50, par « class java.lang.Integer cannot be cast to class
     * java.lang.Long ». Passer par {@code Number} est la regle du depot ; elle valait deja pour
     * les colonnes numeriques de SAF.</p>
     */
    private static Long versLong(Object valeur) {
        return valeur == null ? null : ((Number) valeur).longValue();
    }

    private static SemaineDto versSemaine(java.sql.ResultSet rs, int n) throws java.sql.SQLException {
        return new SemaineDto(
                rs.getObject("semaine_du", LocalDate.class), rs.getObject("semaine_au", LocalDate.class),
                (Integer) rs.getObject("dem_recu"), (Integer) rs.getObject("dem_instruction"),
                (Integer) rs.getObject("dem_accorde"), (Integer) rs.getObject("dem_refuse"),
                (Integer) rs.getObject("dem_annule"),
                (Integer) rs.getObject("dem_nouveaux_semaine"),
                (Integer) rs.getObject("dem_accordes_semaine"),
                (Integer) rs.getObject("dem_annules_semaine"),
                rs.getObject("pf_date_photo", LocalDate.class), (Integer) rs.getObject("pf_credits"),
                rs.getBigDecimal("pf_encours"), (Integer) rs.getObject("pf_nb_retard"),
                rs.getBigDecimal("pf_impaye"), (Integer) rs.getObject("pf_contentieux"),
                rs.getBigDecimal("par30_encours"), (Integer) rs.getObject("par30_nb"),
                rs.getBigDecimal("par60_encours"), (Integer) rs.getObject("par60_nb"),
                rs.getBigDecimal("par90_encours"), (Integer) rs.getObject("par90_nb"),
                rs.getBigDecimal("par120_encours"), (Integer) rs.getObject("par120_nb"),
                (Integer) rs.getObject("ass_en_attente"), (Integer) rs.getObject("ass_valide"),
                (Integer) rs.getObject("ass_rejete"), (Integer) rs.getObject("ass_valide_semaine"),
                (Integer) rs.getObject("ass_rejete_semaine"),
                rs.getObject("arr_date_limite", LocalDate.class), (Integer) rs.getObject("arr_a_jour"),
                (Integer) rs.getObject("arr_a_valider"), (Integer) rs.getObject("arr_en_retard"),
                (Integer) rs.getObject("arr_jamais_remonte"), rs.getBigDecimal("arr_retard_moyen"),
                (Integer) rs.getObject("oct_nb"), rs.getBigDecimal("oct_montant"),
                rs.getString("oct_indisponible"),
                rs.getObject("envoye_at", OffsetDateTime.class),
                (Integer) rs.getObject("nb_destinataires"), rs.getBoolean("essai"));
    }
}
