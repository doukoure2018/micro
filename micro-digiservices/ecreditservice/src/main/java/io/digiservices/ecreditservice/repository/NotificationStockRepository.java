package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.NotificationStockDto;
import java.util.List;

public interface NotificationStockRepository {
    NotificationStockDto createNotification(Long idUser, Long idStock, Long delegationId,
                                            String typeNotification, String message, Long createdBy);
    NotificationStockDto updateVue(Long notificationId, boolean vue);
    List<NotificationStockDto> getNotificationsByUser(Long userId);
    List<NotificationStockDto> getNotificationsByDelegation(Long delegationId);
    NotificationStockDto getById(Long notificationId);
    int countUnreadByUser(Long userId);
}
