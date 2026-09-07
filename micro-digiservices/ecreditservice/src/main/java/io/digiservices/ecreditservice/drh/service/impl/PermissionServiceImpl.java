package io.digiservices.ecreditservice.drh.service.impl;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.DrhDtos.MembreDto;
import io.digiservices.ecreditservice.drh.dto.PermissionDtos.*;
import io.digiservices.ecreditservice.drh.repository.DrhRepository;
import io.digiservices.ecreditservice.drh.repository.PermissionRepository;
import io.digiservices.ecreditservice.drh.service.DrhService;
import io.digiservices.ecreditservice.drh.service.PermissionService;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Phase 3 du chantier Congés & Présences DRH : permission sociale.
 * Sans prévision ; même circuit que le congé (agent -> responsable -> DRH).
 * Préavis J-2 paramétrable (levé pour un DÉCÈS), quota annuel paramétrable,
 * ne touche pas au droit de congé annuel de 30 jours.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionServiceImpl implements PermissionService {

    private static final String PARAM_QUOTA = "PERMISSION_QUOTA_ANNUEL_JOURS";
    private static final String PARAM_PREAVIS = "PERMISSION_DELAI_PREAVIS_JOURS";
    private static final Set<String> MOTIFS =
            Set.of("NAISSANCE", "BAPTEME", "MALADIE", "MARIAGE", "DECES", "AUTRE");

    private final PermissionRepository permissionRepository;
    private final DrhRepository drhRepository;
    private final DrhService drhService;
    private final SmsService smsService;

    // ==================== Agent ====================

    @Override
    public QuotaPermissionDto monQuota(User user, int exercice) {
        int quota = drhRepository.parametreInt(PARAM_QUOTA, 10);
        int pris = permissionRepository.joursConsommes(user.getUserId(), exercice);
        return QuotaPermissionDto.builder()
                .exercice(exercice)
                .quota(quota)
                .pris(pris)
                .restant(Math.max(0, quota - pris))
                .delaiPreavisJours(drhRepository.parametreInt(PARAM_PREAVIS, 2))
                .build();
    }

    @Override
    public List<PermissionDto> mesPermissions(User user, int exercice) {
        return permissionRepository.permissionsDeUser(user.getUserId(), exercice);
    }

    @Override
    @Transactional
    public PermissionDto creerPermission(User user, PermissionRequest request) {
        if (request.getDateDebut() == null || request.getDateFin() == null) {
            throw new ValidationException("Les dates de début et de fin sont obligatoires");
        }
        if (request.getDateFin().isBefore(request.getDateDebut())) {
            throw new ValidationException("La date de fin doit être après la date de début");
        }
        if (request.getMotif() == null || !MOTIFS.contains(request.getMotif())) {
            throw new ValidationException("Motif invalide — valeurs possibles : " + String.join(", ", MOTIFS));
        }
        if ("AUTRE".equals(request.getMotif())
                && (request.getPrecisionMotif() == null || request.getPrecisionMotif().isBlank())) {
            throw new ValidationException("Précisez le motif pour une permission « Autre »");
        }

        MembreDto membre = drhRepository.membreActifDeUser(user.getUserId())
                .orElseThrow(() -> new ValidationException(
                        "Vous n'êtes affecté à aucun département — contactez la DRH"));

        // Préavis : saisie au plus tard J-N avant le départ, sauf décès (urgence)
        int preavis = drhRepository.parametreInt(PARAM_PREAVIS, 2);
        if (!"DECES".equals(request.getMotif())
                && request.getDateDebut().isBefore(LocalDate.now().plusDays(preavis))) {
            throw new ValidationException("La permission sociale doit être demandée au moins "
                    + preavis + " jours avant la date de départ (sauf décès)");
        }
        if (request.getDateDebut().isBefore(LocalDate.now().minusDays(7))) {
            throw new ValidationException("La date de départ est trop ancienne");
        }

        int exercice = request.getDateDebut().getYear();
        Set<LocalDate> feries = new HashSet<>(drhRepository.joursFeries(
                LocalDate.of(exercice, 1, 1), LocalDate.of(exercice, 12, 31)));
        int nbJours = DrhServiceImpl.joursOuvrables(request.getDateDebut(), request.getDateFin(), feries);
        if (nbJours == 0) {
            throw new ValidationException("La période choisie ne contient aucun jour ouvrable");
        }
        if (permissionRepository.chevauchePermissionActive(user.getUserId(),
                request.getDateDebut(), request.getDateFin())) {
            throw new ValidationException("Vous avez déjà une permission active sur cette période");
        }

        int quota = drhRepository.parametreInt(PARAM_QUOTA, 10);
        int pris = permissionRepository.joursConsommes(user.getUserId(), exercice);
        if (nbJours > quota - pris) {
            throw new ValidationException("Cette permission de " + nbJours
                    + " jours dépasse votre quota annuel restant (" + (quota - pris) + " j sur " + quota + ")");
        }

        Long permissionId = permissionRepository.creerPermission(user.getUserId(),
                membre.getDepartementId(), exercice, request, nbJours);
        notifier(drhRepository.telephonesResponsables(membre.getDepartementId()),
                "CRG Permissions : " + user.getFirstName() + " " + user.getLastName()
                        + " a déposé une permission sociale (" + libelleMotif(request.getMotif()) + ", "
                        + nbJours + " j du " + request.getDateDebut() + "). Merci de la traiter.");
        return permissionRepository.permissionById(permissionId).orElseThrow();
    }

    @Override
    @Transactional
    public PermissionDto annuler(User acteur, Long permissionId, String motif) {
        exigerMotif(motif);
        PermissionDto p = permissionRepository.permissionById(permissionId)
                .orElseThrow(() -> new ValidationException("Permission introuvable"));
        boolean proprietaire = p.getUserId().equals(acteur.getUserId());
        Set<String> statutsAutorises = proprietaire
                ? Set.of("SOUMISE")
                : Set.of("SOUMISE", "ACCEPTEE_RESP", "VALIDEE_DRH");
        if (!statutsAutorises.contains(p.getStatut())) {
            throw new ValidationException("La permission est au statut " + p.getStatut() + " — annulation impossible");
        }
        if (!proprietaire) {
            exigerDuMemeDepartementOuDrh(acteur, p);
        }
        permissionRepository.majStatut(permissionId, "ANNULEE", motif.trim(), null, null, acteur.getUserId());
        if (!proprietaire) {
            notifierUser(p.getUserId(), "CRG Permissions : votre permission du " + p.getDateDebut()
                    + " a été annulée — " + motif.trim());
        }
        return permissionRepository.permissionById(permissionId).orElseThrow();
    }

    // ==================== Responsable ====================

    @Override
    public List<PermissionDto> permissionsDeMonDepartement(User responsable, int exercice) {
        MembreDto membre = exigerResponsable(responsable);
        return permissionRepository.permissionsDuDepartement(membre.getDepartementId(), exercice);
    }

    @Override
    @Transactional
    public PermissionDto accepter(User responsable, Long permissionId) {
        PermissionDto p = exigerStatut(permissionId, Set.of("SOUMISE"));
        exigerDuMemeDepartementOuDrh(responsable, p);
        permissionRepository.majStatut(permissionId, "ACCEPTEE_RESP", null, responsable.getUserId(), null, null);
        notifier(drhRepository.telephonesDrh(),
                "CRG Permissions : permission de " + p.getNomComplet() + " ("
                        + libelleMotif(p.getMotif()) + ", " + p.getNbJours()
                        + " j) acceptée par le responsable — en attente de validation DRH.");
        notifierUser(p.getUserId(), "CRG Permissions : votre permission du " + p.getDateDebut()
                + " a été acceptée par votre responsable. Elle attend la validation DRH.");
        return permissionRepository.permissionById(permissionId).orElseThrow();
    }

    @Override
    @Transactional
    public PermissionDto rejeter(User responsable, Long permissionId, String motif) {
        exigerMotif(motif);
        PermissionDto p = exigerStatut(permissionId, Set.of("SOUMISE"));
        exigerDuMemeDepartementOuDrh(responsable, p);
        permissionRepository.majStatut(permissionId, "REJETEE_RESP", motif, responsable.getUserId(), null, null);
        notifierUser(p.getUserId(), "CRG Permissions : votre permission du " + p.getDateDebut()
                + " a été rejetée — " + motif);
        return permissionRepository.permissionById(permissionId).orElseThrow();
    }

    // ==================== DRH ====================

    @Override
    public List<PermissionDto> permissionsAValider(User drh, int exercice) {
        exigerDrh(drh);
        return permissionRepository.permissionsAValiderDrh(exercice);
    }

    @Override
    @Transactional
    public PermissionDto validerDrh(User drh, Long permissionId) {
        exigerDrh(drh);
        PermissionDto p = exigerStatut(permissionId, Set.of("ACCEPTEE_RESP"));
        permissionRepository.majStatut(permissionId, "VALIDEE_DRH", null, null, drh.getUserId(), null);
        notifierUser(p.getUserId(), "CRG Permissions : votre permission sociale du " + p.getDateDebut()
                + " au " + p.getDateFin() + " (" + p.getNbJours() + " j) est accordée.");
        return permissionRepository.permissionById(permissionId).orElseThrow();
    }

    @Override
    @Transactional
    public PermissionDto renvoyerDrh(User drh, Long permissionId, String motif) {
        exigerDrh(drh);
        exigerMotif(motif);
        PermissionDto p = exigerStatut(permissionId, Set.of("ACCEPTEE_RESP"));
        permissionRepository.majStatut(permissionId, "REJETEE_DRH", motif, null, drh.getUserId(), null);
        notifierUser(p.getUserId(), "CRG Permissions : votre permission du " + p.getDateDebut()
                + " a été renvoyée par la DRH — " + motif);
        return permissionRepository.permissionById(permissionId).orElseThrow();
    }

    // ==================== Garde-fous ====================

    static String libelleMotif(String motif) {
        return switch (motif) {
            case "NAISSANCE" -> "Naissance";
            case "BAPTEME" -> "Baptême";
            case "MALADIE" -> "Maladie";
            case "MARIAGE" -> "Mariage";
            case "DECES" -> "Décès";
            default -> "Autre";
        };
    }

    private void exigerDrh(User user) {
        if (!drhService.estHabiliteDrh(user)) {
            throw new ValidationException("Action réservée à la DRH");
        }
    }

    private static void exigerMotif(String motif) {
        if (motif == null || motif.isBlank()) {
            throw new ValidationException("Le motif est obligatoire");
        }
    }

    private MembreDto exigerResponsable(User user) {
        MembreDto membre = drhRepository.membreActifDeUser(user.getUserId())
                .orElseThrow(() -> new ValidationException("Vous n'êtes affecté à aucun département"));
        if (!Boolean.TRUE.equals(membre.getEstResponsable())) {
            throw new ValidationException("Action réservée au responsable du département");
        }
        return membre;
    }

    private void exigerDuMemeDepartementOuDrh(User acteur, PermissionDto p) {
        if (drhService.estHabiliteDrh(acteur)) {
            return;
        }
        MembreDto membre = exigerResponsable(acteur);
        if (!membre.getDepartementId().equals(p.getDepartementId())) {
            throw new ValidationException("Cette permission n'appartient pas à votre département");
        }
    }

    private PermissionDto exigerStatut(Long permissionId, Set<String> statutsAttendus) {
        PermissionDto p = permissionRepository.permissionById(permissionId)
                .orElseThrow(() -> new ValidationException("Permission introuvable"));
        if (!statutsAttendus.contains(p.getStatut())) {
            throw new ValidationException("La permission est au statut " + p.getStatut() + " — action impossible");
        }
        return p;
    }

    private void notifier(List<String> telephones, String message) {
        for (String phone : telephones) {
            try {
                smsService.send(phone, message);
            } catch (Exception e) {
                log.warn("Notification permission non envoyée à {} : {}", phone, e.getMessage());
            }
        }
    }

    private void notifierUser(Long userId, String message) {
        drhRepository.telephoneUser(userId).ifPresent(phone -> notifier(List.of(phone), message));
    }
}
