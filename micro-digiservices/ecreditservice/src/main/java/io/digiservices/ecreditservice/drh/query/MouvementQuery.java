package io.digiservices.ecreditservice.drh.query;

public final class MouvementQuery {

    private MouvementQuery() {
    }

    /** Insertion idempotente d'un événement de la porte : les réimports ne créent pas de doublon. */
    public static final String INSERT_MOUVEMENT = """
        INSERT INTO drh_mouvement (jour, heure, sens, matricule, nom_brut, badge_no, credential, resultat, visiteur, porte)
        VALUES (:jour, :heure, :sens, :matricule, :nom_brut, :badge_no, :credential, :resultat, :visiteur, :porte)
        ON CONFLICT (jour, heure, nom_brut, sens, resultat) DO NOTHING
        """;

    public static final String MOUVEMENTS_PERIODE = """
        SELECT m.mouvement_id, m.jour, m.heure, m.sens, m.matricule, m.nom_brut,
               m.badge_no, m.resultat, m.visiteur,
               TRIM(ip.prenom || ' ' || ip.nom) AS nom_personnel
          FROM drh_mouvement m
          LEFT JOIN info_personnel ip ON ip.matricule = m.matricule
         WHERE m.jour BETWEEN :du AND :au
           AND (CAST(:type AS VARCHAR) IS NULL
                OR (:type = 'PERSONNEL' AND m.matricule IS NOT NULL AND m.resultat = 'ACCESS')
                OR (:type = 'VISITEUR' AND m.visiteur AND m.resultat = 'ACCESS')
                OR (:type = 'NON_IDENTIFIE' AND m.matricule IS NULL AND NOT m.visiteur AND m.resultat = 'ACCESS')
                OR (:type = 'ANOMALIE' AND m.resultat <> 'ACCESS'))
         ORDER BY m.jour DESC, m.heure DESC
        """;

    public static final String BADGE_MATRICULE = """
        SELECT matricule FROM drh_badge_correspondance WHERE badge_no = :badge_no
        """;

    /** Apprentissage : n'écrase jamais une correspondance existante (notamment MANUEL). */
    public static final String INSERT_BADGE_AUTO = """
        INSERT INTO drh_badge_correspondance (badge_no, matricule, source)
        VALUES (:badge_no, :matricule, 'AUTO')
        ON CONFLICT (badge_no) DO NOTHING
        """;

    /** Tout le personnel ACTIVE (badgé ou non : la porte voit tout le monde) pour l'identification par nom. */
    public static final String PERSONNEL_ACTIF_NOMS = """
        SELECT matricule, nom, prenom FROM info_personnel WHERE statut = 'ACTIVE'
        """;

    /** Événements ACCESS du personnel identifié, ordonnés pour la reconstruction des intervalles. */
    public static final String MOUVEMENTS_IDENTIFIES_PERIODE = """
        SELECT m.matricule, TRIM(ip.prenom || ' ' || ip.nom) AS nom, m.jour, m.heure, m.sens
          FROM drh_mouvement m
          JOIN info_personnel ip ON ip.matricule = m.matricule
         WHERE m.resultat = 'ACCESS'
           AND m.jour BETWEEN :du AND :au
           AND (CAST(:matricule AS VARCHAR) IS NULL OR m.matricule = :matricule)
         ORDER BY m.matricule, m.jour, m.heure
        """;

    public static final String CORRESPONDANCES = """
        SELECT c.badge_no, c.matricule, c.source,
               TRIM(ip.prenom || ' ' || ip.nom) AS nom_personnel
          FROM drh_badge_correspondance c
          LEFT JOIN info_personnel ip ON ip.matricule = c.matricule
         ORDER BY nom_personnel NULLS LAST, c.badge_no
        """;

    /** Badges vus à la porte (ACCESS, non visiteur) jamais rattachés à un matricule. */
    public static final String BADGES_INCONNUS = """
        SELECT m.badge_no, m.nom_brut, COUNT(*) AS nb_mouvements, MAX(m.jour) AS dernier_jour
          FROM drh_mouvement m
         WHERE m.matricule IS NULL AND NOT m.visiteur AND m.resultat = 'ACCESS'
           AND m.badge_no IS NOT NULL
         GROUP BY m.badge_no, m.nom_brut
         ORDER BY nb_mouvements DESC, m.nom_brut
        """;

    /** Correction DRH : écrase l'apprentissage automatique et devient définitive. */
    public static final String UPSERT_BADGE_MANUEL = """
        INSERT INTO drh_badge_correspondance (badge_no, matricule, source)
        VALUES (:badge_no, :matricule, 'MANUEL')
        ON CONFLICT (badge_no)
        DO UPDATE SET matricule = EXCLUDED.matricule, source = 'MANUEL', updated_at = CURRENT_TIMESTAMP
        """;

    /** Ré-identifie a posteriori les mouvements déjà importés avec ce badge. */
    public static final String APPLIQUER_BADGE_AUX_MOUVEMENTS = """
        UPDATE drh_mouvement
           SET matricule = :matricule
         WHERE badge_no = :badge_no AND matricule IS NULL AND NOT visiteur AND resultat = 'ACCESS'
        """;

    public static final String PARAMETRE_TEXTE = """
        SELECT valeur FROM drh_parametre WHERE cle = :cle
        """;
}
