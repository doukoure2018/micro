package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.NotificationStockDto;

import java.util.List;

public interface NotificationStockService {
    NotificationStockDto marquerVue(Long notificationId);
    NotificationStockDto marquerNonVue(Long notificationId);
    List<NotificationStockDto> getNotificationsByUser(Long userId);
    List<NotificationStockDto> getNotificationsByDelegation(Long delegationId);
    int countUnreadByUser(Long userId);
    void envoyerNotificationValidation(String delegation, Long createdBy);
    void envoyerNotificationRejet(String delegation, Long createdBy, String motif);
}
