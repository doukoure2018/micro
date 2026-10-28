package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agent de credit rattache a un point de vente, tel que digi le connait (point 8 de la
 * demande KUMY : « la liste des agents par agence »).
 *
 * <p>Seule l'identite professionnelle est exposee au partenaire : matricule, nom, point de
 * vente et etat du compte. Ni courriel ni telephone : ce sont des donnees personnelles qui
 * n'ont pas d'usage dans un tableau de bord de pilotage.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentCreditDto {

    /** Identifiant digi de l'agent, celui que porte l'affectation du portefeuille. */
    private Long id;
    /**
     * Identifiant de connexion, en majuscules. Il suit <b>la meme convention</b> que le code
     * gestionnaire de SAF (COD_EJECUTIVO), sans que la correspondance soit garantie : on releve
     * par exemple MLSIDIBE323 dans SAF pour MLSIDIBE dans digi. Le rapprochement sur lequel on
     * peut compter est l'affectation digi, pas ce code.
     */
    private String identifiant;
    /** Matricule RH, renseigne pour une minorite de comptes a ce jour : souvent null. */
    private String matricule;
    /**
     * Nom complet tel que digi l'affiche, nom de famille d'abord. Les deux colonnes d'origine
     * ne distinguent pas de facon fiable le nom du prenom : elles ne sont donc pas exposees
     * separement, pour ne pas presenter une structure que les donnees ne portent pas.
     */
    private String nom;
    /** Code SAF du point de vente (le meme que codeAgence du portefeuille). */
    private String codeAgence;
    private String libelleAgence;
    /** Compte actif : ni desactive ni bloque. Un agent bloque garde ses dossiers. */
    private boolean actif;
    /** Nombre de credits SAF actuellement affectes a cet agent dans digi. */
    private long creditsAffectes;
}
