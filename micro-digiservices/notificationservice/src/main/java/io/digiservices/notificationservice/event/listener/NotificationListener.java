package io.digiservices.notificationservice.event.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.notificationservice.domain.Data;
import io.digiservices.notificationservice.domain.Notification;
import io.digiservices.notificationservice.domain.StockNotificationData;
import io.digiservices.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationListener {
    private static final String NOTIFICATION_TOPIC = "NOTIFICATION_TOPIC";
    private final EmailService emailService;

    @KafkaListener(topics = NOTIFICATION_TOPIC)
    public void handleNotification(Notification notification) {
        log.info("Received notification: {}", notification.toString());
        var mapper = new ObjectMapper();
        mapper.configure(FAIL_ON_UNKNOWN_PROPERTIES, false);

        switch (notification.getPayload().getEventType()) {
            case RESETPASSWORD -> {
                var data = mapper.convertValue(notification.getPayload().getData(), Data.class);
                emailService.sendPasswordResetHtmlEmail(data.getName(), data.getEmail(), data.getToken());
            }
            case USER_CREATED -> {
                var data = mapper.convertValue(notification.getPayload().getData(), Data.class);
                emailService.sendNewAccountHtmlEmail(data.getName(), data.getEmail(), data.getToken());
            }
            case STOCK_VALIDATED -> {
                var data = mapper.convertValue(notification.getPayload().getData(), StockNotificationData.class);
                emailService.sendStockValidationEmail(data);
            }
            case STOCK_REJECTED -> {
                var data = mapper.convertValue(notification.getPayload().getData(), StockNotificationData.class);
                emailService.sendStockRejectionEmail(data);
            }
        }
    }
}
