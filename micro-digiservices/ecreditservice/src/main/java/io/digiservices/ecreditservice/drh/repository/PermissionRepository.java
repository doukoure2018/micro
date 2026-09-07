package io.digiservices.ecreditservice.drh.repository;

import io.digiservices.ecreditservice.drh.dto.PermissionDtos.PermissionDto;
import io.digiservices.ecreditservice.drh.dto.PermissionDtos.PermissionRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PermissionRepository {

    Optional<PermissionDto> permissionById(Long permissionId);
    List<PermissionDto> permissionsDeUser(Long userId, int exercice);
    List<PermissionDto> permissionsDuDepartement(Long departementId, int exercice);
    List<PermissionDto> permissionsAValiderDrh(int exercice);

    Long creerPermission(Long userId, Long departementId, int exercice,
                         PermissionRequest request, int nbJours);

    void majStatut(Long permissionId, String statut, String motifRejet,
                   Long traiteeRespPar, Long valideeDrhPar, Long annuleePar);

    int joursConsommes(Long userId, int exercice);
    boolean chevauchePermissionActive(Long userId, LocalDate dateDebut, LocalDate dateFin);
}
