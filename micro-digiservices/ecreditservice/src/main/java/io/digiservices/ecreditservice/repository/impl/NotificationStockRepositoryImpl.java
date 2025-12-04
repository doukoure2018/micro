package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.NotificationStockDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.NotificationStockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static io.digiservices.ecreditservice.query.NotificationQuery.*;


@Repository
@RequiredArgsConstructor
@Slf4j
public class NotificationStockRepositoryImpl implements NotificationStockRepository {

    private final JdbcClient jdbcClient;
    @Override
    public NotificationStockDto createNotification(Long idUser, Long idStock, Long delegationId,
                                                   String typeNotification, String message, Long createdBy) {
        try {
            return jdbcClient.sql(INSERT_NOTIFICATION)
                    .param("idUser", idUser)
                    .param("idStock", idStock)
                    .param("delegationId", delegationId)
                    .param("typeNotification", typeNotification)
                    .param("message", message)
                    .param("createdBy", createdBy)
                    .query(NotificationStockDto.class)
                    .single();
        } catch (Exception e) {
            log.error("Erreur lors de la création de la notification: {}", e.getMessage());
            throw new ApiException("Erreur lors de la création de la notification");
        }
    }

    @Override
    public NotificationStockDto updateVue(Long notificationId, boolean vue) {
        try {
            String sql = vue ? UPDATE_VUE_TRUE : UPDATE_VUE_FALSE;
            return jdbcClient.sql(sql)
                    .param("notificationId", notificationId)
                    .query(NotificationStockDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            log.error("Notification non trouvée: {}", notificationId);
            throw new ApiException("Notification non trouvée");
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour de la notification: {}", e.getMessage());
            throw new ApiException("Erreur lors de la mise à jour de la notification");
        }
    }


    @Override
    public List<NotificationStockDto> getNotificationsByUser(Long userId) {
        try {
            return jdbcClient.sql(SELECT_BY_USER)
                    .param("userId", userId)
                    .query(NotificationStockDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des notifications: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<NotificationStockDto> getNotificationsByDelegation(Long delegationId) {
        try {
            return jdbcClient.sql(SELECT_BY_DELEGATION)
                    .param("delegationId", delegationId)
                    .query(NotificationStockDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des notifications: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public NotificationStockDto getById(Long notificationId) {
        try {
            return jdbcClient.sql(SELECT_BY_ID)
                    .param("notificationId", notificationId)
                    .query(NotificationStockDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Notification non trouvée");
        }
    }

    @Override
    public int countUnreadByUser(Long userId) {
        try {
            return jdbcClient.sql(COUNT_UNREAD)
                    .param("userId", userId)
                    .query(Integer.class)
                    .single();
        } catch (Exception e) {
            return 0;
        }
    }
}
