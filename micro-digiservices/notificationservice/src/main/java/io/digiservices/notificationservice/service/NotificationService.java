package io.digiservices.notificationservice.service;


import io.digiservices.notificationservice.model.Message;

import java.util.List;

public interface NotificationService {

    Message sendModel(String fromUserUuid, String toEmail, String subject, String message);
    List<Message> getMessages(String userUuid);

    List<Message> getConversations(String userUuid, String conversationId);

}
