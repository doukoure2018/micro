-- Table de référence pour les catégories d'encaissement
CREATE TABLE ref_categories_encaissement (
                                             id SERIAL PRIMARY KEY,
                                             code VARCHAR(50) UNIQUE NOT NULL,
                                             libelle VARCHAR(100) NOT NULL,
                                             ordre_affichage INTEGER
);

-- Table de référence pour les catégories de décaissement
CREATE TABLE ref_categories_decaissement (
                                             id SERIAL PRIMARY KEY,
                                             code VARCHAR(50) UNIQUE NOT NULL,
                                             libelle VARCHAR(100) NOT NULL,
                                             ordre_affichage INTEGER
);

-- Insertion des catégories par défaut
INSERT INTO ref_categories_encaissement (code, libelle, ordre_affichage) VALUES
                                                                             ('VENTES', 'Ventes', 1),
                                                                             ('AUTRES_REVENUS', 'Autres revenus', 2),
                                                                             ('PRET', 'Prêt', 3);

INSERT INTO ref_categories_decaissement (code, libelle, ordre_affichage) VALUES
                                                                             ('ACHAT_MARCHANDISES', 'Achat marchandises', 1),
                                                                             ('MAIN_OEUVRE', 'Coût de main d''œuvre', 2),
                                                                             ('INVESTISSEMENT', 'Investissement', 3),
                                                                             ('IMPOTS_TAXES', 'Impôts et taxes', 4),
                                                                             ('LOYER', 'Loyers', 5),
                                                                             ('UTILITIES', 'Eau, Électricité, téléphone', 6),
                                                                             ('TRANSPORT', 'Transport', 7),
                                                                             ('SALAIRES', 'Salaire personnel', 8),
                                                                             ('FRAIS_TELEPHONE', 'Frais de téléphone', 9),
                                                                             ('CHARGES_FINANCIERES', 'Charges Financières', 10),
                                                                             ('ENTRETIEN', 'Entretien et réparation', 11),
                                                                             ('AUTRES_DEPENSES', 'Autres dépenses', 12);