package io.digiservices.notificationservice.service.impl;

import io.digiservices.notificationservice.domain.StockNotificationData;
import io.digiservices.notificationservice.exception.ApiException;
import io.digiservices.notificationservice.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

import static io.digiservices.notificationservice.utils.EmailUtils.getResetPasswordUrl;
import static io.digiservices.notificationservice.utils.EmailUtils.getVerificationUrl;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    public static final String NEW_USER_ACCOUNT_VERIFICATION = "New Account Verification";
    public static final String ACCOUNT_VERIFICATION_TEMPLATE = "newaccount";
    public static final String PASSWORD_RESET_TEMPLATE = "resetpassword";
    public static final String PASSWORD_RESET_REQUEST = "Reset Password Request";
    public static final String NEW_TICKET_TEMPLATE = "newticket";
    public static final String NEW_COMMENT_TEMPLATE = "newcomment";
    public static final String NEW_FILE_TEMPLATE = "newfile";
    public static final String NEW_TICKET_REQUEST = "New Support Ticket";

    public static final String STOCK_VALIDATION_TEMPLATE = "stock_validation";
    public static final String STOCK_REJECTION_TEMPLATE = "stock_rejection";

    private final TemplateEngine templateEngine;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.from-name:Digi-CRG}")
    private String fromName;

    @Value("${verify.email.host}")
    private String host;

    @Override
    @Async
    public void sendNewAccountHtmlEmail(String name, String to, String token) {
        try {
            var context = new Context();
            context.setVariables(Map.of(
                    "name", name,
                    "url", getVerificationUrl(host, token)
            ));
            var htmlContent = templateEngine.process(ACCOUNT_VERIFICATION_TEMPLATE, context);

            sendEmail(to, NEW_USER_ACCOUNT_VERIFICATION, htmlContent);
            log.info("Account verification email sent to: {}", to);
        } catch (Exception exception) {
            log.error("Error sending account verification email: {}", exception.getMessage(), exception);
            throw new ApiException("Unable to send email");
        }
    }

    @Override
    @Async
    public void sendPasswordResetHtmlEmail(String name, String to, String token) {
        try {
            var context = new Context();
            context.setVariables(Map.of(
                    "name", name,
                    "url", getResetPasswordUrl(host, token)
            ));
            var htmlContent = templateEngine.process(PASSWORD_RESET_TEMPLATE, context);

            sendEmail(to, PASSWORD_RESET_REQUEST, htmlContent);
            log.info("Password reset email sent to: {}", to);
        } catch (Exception exception) {
            log.error("Error sending password reset email: {}", exception.getMessage(), exception);
            throw new ApiException("Unable to send email");
        }
    }

    @Override
    @Async
    public void sendStockValidationEmail(StockNotificationData data) {
        try {
            var context = new Context();
            context.setVariables(Map.of(
                    "nomDR", data.getNomDR(),
                    "delegation", data.getDelegation(),
                    "nombreCommandes", data.getNombreCommandes(),
                    "detailsCommandes", data.getDetailsCommandes()
            ));
            var htmlContent = templateEngine.process(STOCK_VALIDATION_TEMPLATE, context);

            sendEmail(data.getEmailDR(), "Validation des Bons de Commande - " + data.getDelegation(), htmlContent);
            log.info("Stock validation email sent to: {}", data.getEmailDR());
        } catch (Exception exception) {
            log.error("Error sending stock validation email: {}", exception.getMessage(), exception);
        }
    }

    @Override
    @Async
    public void sendStockRejectionEmail(StockNotificationData data) {
        try {
            var context = new Context();
            context.setVariables(Map.of(
                    "nomDR", data.getNomDR(),
                    "delegation", data.getDelegation(),
                    "nombreCommandes", data.getNombreCommandes(),
                    "detailsCommandes", data.getDetailsCommandes(),
                    "motif", data.getMotif()
            ));
            var htmlContent = templateEngine.process(STOCK_REJECTION_TEMPLATE, context);

            sendEmail(data.getEmailDR(), "Rejet des Bons de Commande - " + data.getDelegation(), htmlContent);
            log.info("Stock rejection email sent to: {}", data.getEmailDR());
        } catch (Exception exception) {
            log.error("Error sending stock rejection email: {}", exception.getMessage(), exception);
        }
    }

    @Override
    public void sendNewTicketHtmlEmail(String name, String email, String ticketTitle, String ticketNumber, String priority) {
        // TODO: Implement when needed
    }

    @Override
    public void sendNewFilesHtmlEmail(String name, String email, String files, String ticketTitle, String ticketNumber, String priority, String date) {
        // TODO: Implement when needed
    }

    /**
     * Core method to send email using SMTP (JavaMailSender)
     */
    private void sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email sent successfully to {} via SMTP", toEmail);
        } catch (Exception ex) {
            log.error("Error sending email via SMTP to {}: {}", toEmail, ex.getMessage(), ex);
            throw new ApiException("Failed to send email via SMTP");
        }
    }
}
