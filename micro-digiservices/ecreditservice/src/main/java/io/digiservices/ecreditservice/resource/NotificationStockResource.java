package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.NotificationStockDto;
import io.digiservices.ecreditservice.service.NotificationStockService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ecredit")
@RequiredArgsConstructor
@Slf4j
public class NotificationStockResource {

    private final NotificationStockService notificationStockService;

    /**
     * Marquer une notification comme vue (true)
     * Envoie un email de confirmation au DR
     */
    @PatchMapping("/notifications/{notificationId}/vue")
    public ResponseEntity<Response> marquerVue(
            @PathVariable Long notificationId,
            HttpServletRequest request) {
        log.info("API: Marquage de la notification {} comme vue", notificationId);

        NotificationStockDto notification = notificationStockService.marquerVue(notificationId);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "notification", notification
        ), "Notification marquée comme vue avec succès", HttpStatus.OK));
    }

    /**
     * Marquer une notification comme non vue (false)
     */
    @PatchMapping("/notifications/{notificationId}/non-vue")
    public ResponseEntity<Response> marquerNonVue(
            @PathVariable Long notificationId,
            HttpServletRequest request) {
        log.info("API: Marquage de la notification {} comme non vue", notificationId);

        NotificationStockDto notification = notificationStockService.marquerNonVue(notificationId);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "notification", notification
        ), "Notification marquée comme non vue avec succès", HttpStatus.OK));
    }

    /**
     * Récupérer les notifications d'un utilisateur
     */
    @GetMapping("/notifications/user/{userId}")
    public ResponseEntity<Response> getNotificationsByUser(
            @PathVariable Long userId,
            HttpServletRequest request) {
        log.info("API: Récupération des notifications pour l'utilisateur {}", userId);

        List<NotificationStockDto> notifications = notificationStockService.getNotificationsByUser(userId);
        int unreadCount = notificationStockService.countUnreadByUser(userId);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "notifications", notifications,
                "count", notifications.size(),
                "unreadCount", unreadCount
        ), "Notifications récupérées avec succès", HttpStatus.OK));
    }

    /**
     * Récupérer les notifications d'une délégation
     */
    @GetMapping("/notifications/delegation/{delegationId}")
    public ResponseEntity<Response> getNotificationsByDelegation(
            @PathVariable Long delegationId,
            HttpServletRequest request) {
        log.info("API: Récupération des notifications pour la délégation {}", delegationId);

        List<NotificationStockDto> notifications = notificationStockService.getNotificationsByDelegation(delegationId);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "notifications", notifications,
                "count", notifications.size()
        ), "Notifications de la délégation récupérées avec succès", HttpStatus.OK));
    }

    /**
     * Envoyer notification de validation pour une délégation
     */
    @PostMapping("/notifications/valider/{delegation}")
    public ResponseEntity<Response> envoyerNotificationValidation(
            @PathVariable String delegation,
            @RequestParam Long createdBy,
            HttpServletRequest request) {
        log.info("API: Envoi de notification de validation pour la délégation {}", delegation);

        notificationStockService.envoyerNotificationValidation(delegation, createdBy);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "delegation", delegation
        ), "Notifications de validation envoyées avec succès", HttpStatus.OK));
    }

    /**
     * Envoyer notification de rejet pour une délégation
     */
    @PostMapping("/notifications/rejeter/{delegation}")
    public ResponseEntity<Response> envoyerNotificationRejet(
            @PathVariable String delegation,
            @RequestParam Long createdBy,
            @RequestParam String motif,
            HttpServletRequest request) {
        log.info("API: Envoi de notification de rejet pour la délégation {}", delegation);

        notificationStockService.envoyerNotificationRejet(delegation, createdBy, motif);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "delegation", delegation,
                "motif", motif
        ), "Notifications de rejet envoyées avec succès", HttpStatus.OK));
    }

    /**
     * Compter les notifications non lues d'un utilisateur
     */
    @GetMapping("/notifications/user/{userId}/unread-count")
    public ResponseEntity<Response> countUnread(
            @PathVariable Long userId,
            HttpServletRequest request) {
        int count = notificationStockService.countUnreadByUser(userId);

        return ResponseEntity.ok(getResponse(request, Map.of(
                "unreadCount", count
        ), "Comptage effectué avec succès", HttpStatus.OK));
    }

    private Response getResponse(HttpServletRequest request, Map<String, ?> data, String message, org.springframework.http.HttpStatus status) {
        return Response.builder()
                .timeStamp(Long.valueOf(java.time.LocalDateTime.now().toString()))
                .path(request.getRequestURI())
                .status(status)
                .statusCode(status.value())
                .message(message)
                .data(data)
                .build();
    }
}
