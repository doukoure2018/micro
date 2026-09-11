package io.digiservices.authorizationserver.model;

import java.util.List;

/**
 * Photographie du réseau Crédit Rural (délégations, agences, points de service) telle que
 * lue dans PostgreSQL. Sert de source unique pour élaguer le périmètre d'un agent.
 */
public record StructureReseau(
        List<DelegationRow> delegations,
        List<AgenceRow> agences,
        List<PointVenteRow> pointsDeService
) {
    public record DelegationRow(Long id, String libele) {}

    public record AgenceRow(Long id, String libele, Long delegationId) {}

    public record PointVenteRow(Long id, String libele, String code, Long agenceId, Long delegationId) {}
}
