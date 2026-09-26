package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Ligne de synthese de l'etat TT1 a un niveau de la hierarchie : point de service
 * (code agence SAF), agence digi ou delegation digi. Ebanking produit les lignes de
 * niveau PS ; ecreditservice les agrege aux niveaux superieurs.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EcheancesSyntheseDto {

    /** PS, AGENCE ou DELEGATION. */
    private String niveau;
    /** Identifiant digi (agence ou delegation) ; null au niveau PS. */
    private Long id;
    /** Code agence SAF (COD_AGENCIA) au niveau PS ; null au-dessus. */
    private String code;
    private String libelle;
    /** Niveau parent : agence du PS, delegation de l'agence ; null pour la delegation. */
    private String rattachement;
    private int nbPointsService;
    private EcheancesIndicateursDto indicateurs;
}
