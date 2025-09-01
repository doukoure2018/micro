INSERT INTO categorie_bon_commande (libele, description) VALUES
                         ('MATERIEL', 'Commande de matériel et équipements'),
                         ('SERVICE', 'Demande de service'),
                         ('FOURNITURE', 'Commande de fournitures de bureau'),
                         ('MAINTENANCE', 'Demande de maintenance'),
                         ('TRANSPORT', 'Demande de transport'),
                         ('IMPRIME', 'Ram affiche carte visa'),
                         ('AUTRE', 'Autres types de commandes')
    ON CONFLICT (libele) DO NOTHING;