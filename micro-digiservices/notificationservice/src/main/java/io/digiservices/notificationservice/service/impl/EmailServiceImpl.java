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

    @Value("${spring.mail.from-name:DIGI-CRG}")
    private String fromName;

    @Value("${verify.email.host}")
    private String host;

    @Override
    @Async
    public void sendPortefeuilleAlerteEmailAvecPiece(String to, String sujet, String corpsHtml,
                                                     String nomFichier, String contenuBase64, String typeMime) {
        if (contenuBase64 == null || contenuBase64.isBlank()) {
            sendPortefeuilleAlerteEmail(to, sujet, corpsHtml);
            return;
        }
        try {
            var message = mailSender.createMimeMessage();
            var helper = new org.springframework.mail.javamail.MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(sujet);
            helper.setText(corpsHtml, true);
            byte[] contenu = java.util.Base64.getDecoder().decode(contenuBase64);
            String type = typeMime == null || typeMime.isBlank()
                    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : typeMime;
            helper.addAttachment(nomFichier == null || nomFichier.isBlank() ? "etat.xlsx" : nomFichier,
                    new org.springframework.core.io.ByteArrayResource(contenu), type);
            envoyerEnSerie(message);
            log.info("Etat portefeuille envoye a {} : {} ({} octets joints)", to, sujet, contenu.length);
        } catch (Exception e) {
            log.error("Echec envoi etat portefeuille a {} : {}", to, e.getMessage());
        }
    }

    @Override
    public void sendPortefeuilleAlerteEmail(String to, String sujet, String corpsHtml) {
        try {
            var message = mailSender.createMimeMessage();
            var helper = new org.springframework.mail.javamail.MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(sujet);
            helper.setText(corpsHtml, true);
            envoyerEnSerie(message);
            log.info("Alerte portefeuille envoyee a {} : {}", to, sujet);
        } catch (Exception e) {
            log.error("Echec envoi alerte portefeuille a {} : {}", to, e.getMessage());
        }
    }

    // Les digests du matin partent par centaines (244 le 23/10/2026) : une session SMTP par
    // message, et Gmail a coupe au 80e (« 454 4.7.0 Too many login attempts »). On espace donc
    // les envois en serie et, sur ce refus temporaire, on attend avant de reessayer.
    private static final long ESPACEMENT_MS = 1200;
    private static final long PAUSE_REFUS_MS = 90_000;
    private static final int ESSAIS_MAX = 4;
    private static final Object VERROU_SERIE = new Object();
    private static long dernierEnvoiMs = 0;

    private void envoyerEnSerie(MimeMessage message) throws InterruptedException {
        synchronized (VERROU_SERIE) {
            for (int essai = 1; ; essai++) {
                long attente = dernierEnvoiMs + ESPACEMENT_MS - System.currentTimeMillis();
                if (attente > 0) Thread.sleep(attente);
                try {
                    mailSender.send(message);
                    dernierEnvoiMs = System.currentTimeMillis();
                    return;
                } catch (Exception e) {
                    String m = e.getMessage() == null ? "" : e.getMessage();
                    boolean refusTemporaire = m.contains("Too many login attempts") || m.contains("4.7.0")
                            || m.contains("Authentication failed") || m.contains("Try again later");
                    if (!refusTemporaire || essai >= ESSAIS_MAX) throw e;
                    log.warn("SMTP : refus temporaire (essai {}/{}), pause de {} s avant nouvel essai : {}",
                            essai, ESSAIS_MAX, PAUSE_REFUS_MS / 1000, m.split("\\R")[0]);
                    Thread.sleep(PAUSE_REFUS_MS);
                    dernierEnvoiMs = System.currentTimeMillis();
                }
            }
        }
    }

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
