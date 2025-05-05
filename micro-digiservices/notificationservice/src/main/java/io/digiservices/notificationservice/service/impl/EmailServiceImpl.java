package io.digiservices.notificationservice.service.impl;

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
    public static final String UTF_8_ENCODING = "UTF-8";
    public static final String ACCOUNT_VERIFICATION_TEMPLATE = "newaccount";
    public static final String PASSWORD_RESET_TEMPLATE = "resetpassword";
    public static final String NEW_TICKET_TEMPLATE = "newticket";
    public static final String NEW_COMMENT_TEMPLATE = "newcomment";
    public static final String NEW_FILE_TEMPLATE = "newfile";
    public static final String NEW_TICKET_REQUEST = "New Support Ticket";
    public static final String PASSWORD_RESET_REQUEST = "Password Reset Request";
    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;
    @Value("${verify.email.host}")
    private String host;
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Async
    public void sendNewAccountHtmlEmail(String name, String to, String token) {
        try {
            var context = new Context();
            context.setVariables(Map.of(
                    "name", name,
                    "url", getVerificationUrl(host, token)
            ));
            var text = templateEngine.process(ACCOUNT_VERIFICATION_TEMPLATE, context);
            MimeMessage message = getMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setSubject(NEW_USER_ACCOUNT_VERIFICATION);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setText(text, true);
            emailSender.send(message);
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
            throw new ApiException("Unable to send email");
        }
    }

    @Override
    public void sendPasswordResetHtmlEmail(String name, String to, String token) {
        try {
            var context = new Context();
            context.setVariables(Map.of(
                    "name", name,
                    "url", getResetPasswordUrl(host, token)
            ));
            var text = templateEngine.process(PASSWORD_RESET_TEMPLATE, context);
            MimeMessage message = getMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setSubject(PASSWORD_RESET_REQUEST);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setText(text, true);
            emailSender.send(message);
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
            throw new ApiException("Unable to send email");
        }
    }

    @Override
    public void sendNewTicketHtmlEmail(String name, String email, String ticketTitle, String ticketNumber, String priority) {

    }

    @Override
    public void sendNewFilesHtmlEmail(String name, String email, String files, String ticketTitle, String ticketNumber, String priority, String date) {

    }

    private MimeMessage getMimeMessage(){
        return emailSender.createMimeMessage();
    }
}
