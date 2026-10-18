package io.digiservices.authorizationserver.perimetre;

import io.digiservices.authorizationserver.model.PerimetreNiveau;
import io.digiservices.authorizationserver.model.StructureReseau;

import java.util.List;
import java.util.Objects;

/**
 * Traduit le rattachement d'un agent en liste de codes de points de service SAF
 * ({@code pointvente.code} = {@code COD_AGENCIA}) : la seule cle commune a digi et a BDCRG,
 * donc le seul perimetre que l'outil de rapprochement sait appliquer.
 *
 * <p>Au niveau NATIONAL la liste est vide : l'outil lit tout le reseau, inutile d'envoyer
 * les 188 codes dans le jeton.</p>
 */
public final class RapprochementPerimetreBuilder {

    private RapprochementPerimetreBuilder() {
    }

    public static List<String> points(PerimetreNiveau niveau, Long delegationId, Long agenceId,
                                      Long pointventeId, StructureReseau reseau) {
        if (niveau == null || niveau == PerimetreNiveau.NATIONAL || reseau == null) {
            return List.of();
        }
        return reseau.pointsDeService().stream()
                .filter(p -> switch (niveau) {
                    case POINT_DE_SERVICE -> Objects.equals(p.id(), pointventeId);
                    case AGENCE -> Objects.equals(p.agenceId(), agenceId);
                    case DELEGATION -> Objects.equals(p.delegationId(), delegationId);
                    case NATIONAL -> false;
                })
                .map(StructureReseau.PointVenteRow::code)
                .filter(c -> c != null && !c.isBlank())
                .map(String::trim)
                .distinct()
                .sorted()
                .toList();
    }
}
