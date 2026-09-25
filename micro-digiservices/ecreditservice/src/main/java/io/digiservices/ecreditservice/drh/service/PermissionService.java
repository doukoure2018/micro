package io.digiservices.ecreditservice.drh.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.DrhDtos;
import io.digiservices.ecreditservice.drh.dto.PermissionDtos.*;

import java.util.List;

public interface PermissionService {

    // Agent
    QuotaPermissionDto monQuota(User user, int exercice);
    List<PermissionDto> mesPermissions(User user, int exercice);
    PermissionDto creerPermission(User user, PermissionRequest request);
    PermissionDto annuler(User acteur, Long permissionId, String motif);

    // Responsable
    List<PermissionDto> permissionsDeMonDepartement(User responsable, int exercice);
    PermissionDto accepter(User responsable, Long permissionId);
    PermissionDto rejeter(User responsable, Long permissionId, String motif);

    // DRH
    List<PermissionDto> permissionsAValider(User drh, int exercice);

    /** V154 : validation / acceptation groupées (un résultat par permission). */
    List<DrhDtos.ResultatLotDto> validerLot(User drh, List<Long> ids);
    List<DrhDtos.ResultatLotDto> accepterLot(User responsable, List<Long> ids);

    /** V153 : toutes les permissions accordées — DRH. */
    List<PermissionDto> permissionsValidees(User drh, int exercice, Long departementId, Integer mois);
    PermissionDto validerDrh(User drh, Long permissionId);
    PermissionDto renvoyerDrh(User drh, Long permissionId, String motif);
}
