package io.digiservices.userservice.dto;

import java.util.List;

/**
 * Profil d'un utilisateur dans l'outil « Rapprochement des encours » (endpoint
 * {@code /agents/{id}/rapprochement}), identique aux claims du scope {@code rapprochement}
 * du fournisseur d'identite. Sert au support DSIG et au futur service central de calcul.
 *
 * @param agentId  identifiant stable de l'agent (ex. "CR-42")
 * @param profil   AGENT_CREDIT, RA, DELEGATION, DR, DE, INSPECTION, DIRECTION, DSIG ;
 *                 {@code null} si l'utilisateur n'est pas habilite a l'outil
 * @param niveau   POINT_DE_SERVICE, AGENCE, DELEGATION, NATIONAL ; {@code null} si hors outil
 * @param points   codes de points de service SAF ({@code COD_AGENCIA}) du perimetre ;
 *                 vide au niveau NATIONAL (tout le reseau) et pour une fiche sans rattachement
 * @param recalcul droit de relancer le calcul de l'etat consolide de tout le reseau
 * @param active   meme regle que {@code /agents/{id}/status}
 */
public record RapprochementProfilResponse(
        String agentId,
        String profil,
        String niveau,
        List<String> points,
        boolean recalcul,
        boolean active
) {}
