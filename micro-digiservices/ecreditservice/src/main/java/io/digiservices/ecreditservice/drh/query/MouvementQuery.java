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
}
