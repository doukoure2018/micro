package io.digiservices.notificationservice.service;

import io.digiservices.notificationservice.domain.StockNotificationData;

public interface EmailService {
    void sendNewAccountHtmlEmail(String name, String to, String token);
    void sendPasswordResetHtmlEmail(String name, String to, String token);
    void sendStockValidationEmail(StockNotificationData data);
    void sendStockRejectionEmail(StockNotificationData data);
    void sendNewTicketHtmlEmail(String name, String email, String ticketTitle, String ticketNumber, String priority);
    void sendNewFilesHtmlEmail(String name, String email, String files, String ticketTitle, String ticketNumber, String priority, String date);
}
