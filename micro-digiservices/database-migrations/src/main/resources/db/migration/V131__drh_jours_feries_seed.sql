-- V131 : jours fériés fixes de Guinée pour 2026 et 2027 (affichage calendrier + comptage).
-- Les fêtes mobiles (Pâques, Aïd el-Fitr, Aïd el-Kébir/Tabaski, Maouloud) sont ajoutées
-- par la DRH au fil de l'eau (dates fixées par décret chaque année).
INSERT INTO drh_jour_ferie (jour, libelle) VALUES
    ('2026-01-01', 'Nouvel An'),
    ('2026-05-01', 'Fête du Travail'),
    ('2026-05-25', 'Journée de l''Afrique'),
    ('2026-08-15', 'Assomption'),
    ('2026-10-02', 'Fête de l''Indépendance'),
    ('2026-12-25', 'Noël'),
    ('2027-01-01', 'Nouvel An'),
    ('2027-05-01', 'Fête du Travail'),
    ('2027-05-25', 'Journée de l''Afrique'),
    ('2027-08-15', 'Assomption'),
    ('2027-10-02', 'Fête de l''Indépendance'),
    ('2027-12-25', 'Noël')
ON CONFLICT (jour) DO NOTHING;
