package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.SignalementTelephoneDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.DestinatairePointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Notification d'un signalement de numero de telephone aux agents de credit du point de
 * service, avec copie au directeur d'agence. Courriel par Kafka (canal PORTEFEUILLE_ALERTE,
 * deja en production) ; SMS possible par la passerelle existante mais <b>desactive par
 * defaut</b> (signalement.telephone.sms-actif=true pour l'ouvrir).
 *
 * <p>La cloche de l'agent de credit lit directement la table, elle ne depend pas d'un envoi.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SignalementTelephoneNotifier {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm");

    private final AlerteDestinatairesRepository destinataires;
    private final ApplicationEventPublisher publisher;
    private final SmsService smsService;

    @Value("${signalement.telephone.sms.actif:false}")
    private boolean smsActif;

    /** Nouveau signalement : courriel aux agents du point de service, copie au DA. */
    public void notifierPointService(SignalementTelephoneDto s, User signaleur) {
        List<DestinatairePointService> cibles = destinataires.agentsEtDaDuPointService(s.getCodAgencia());
        if (cibles.isEmpty()) {
            log.warn("[SIGNALEMENT TEL] aucun destinataire pour le PS {} — signalement {} visible uniquement à l'écran",
                    s.getCodAgencia(), s.getId());
            return;
        }
        String sujet = "Numéro à vérifier — " + nvl(s.getNomClient(), s.getCodCliente());
        String corps = corpsHtml(s, signaleur);
        for (DestinatairePointService d : cibles) {
            publier(d.email(), sujet, corps);
        }
        if (smsActif) {
            String texte = "CRG : numero a verifier, client " + nvl(s.getNomClient(), s.getCodCliente())
                    + " (" + libelleMotif(s.getMotif()) + "). Voir Changement telephone dans digi.";
            cibles.stream()
                    .filter(d -> "AGENT_CREDIT".equals(d.role()))
                    .filter(d -> d.phone() != null && !d.phone().isBlank())
                    .forEach(d -> {
                        try {
                            smsService.send(d.phone(), texte);
                        } catch (Exception e) {
                            log.warn("[SIGNALEMENT TEL] SMS non envoyé à {} : {}", d.phone(), e.getMessage());
                        }
                    });
        }
        log.info("[SIGNALEMENT TEL] signalement {} notifié à {} destinataire(s) du PS {}",
                s.getId(), cibles.size(), s.getCodAgencia());
    }

    /** Classement sans suite : information du signaleur. */
    public void notifierClassement(SignalementTelephoneDto s) {
        if (s.getSignaleParUserId() == null) return;
        destinataires.agentsEtDaDuPointService(s.getCodAgencia()).stream()
                .filter(d -> d.userId().equals(s.getSignaleParUserId()))
                .findFirst()
                .ifPresent(d -> publier(d.email(),
                        "Signalement classé — " + nvl(s.getNomClient(), s.getCodCliente()),
                        "<p>Votre signalement du " + s.getSignaleAt().format(FMT) + " sur le client <b>"
                                + nvl(s.getNomClient(), s.getCodCliente()) + "</b> a été classé sans suite par le point de service.</p>"
                                + "<p><b>Motif :</b> " + echapper(s.getMotifClassement()) + "</p>"));
    }

    /** Relance : le signalement est resté sans prise en charge. */
    public void notifierRelance(SignalementTelephoneDto s, int jours) {
        List<DestinatairePointService> cibles = destinataires.agentsEtDaDuPointService(s.getCodAgencia());
        String sujet = "Rappel : numéro à vérifier depuis " + jours + " jours — " + nvl(s.getNomClient(), s.getCodCliente());
        String corps = "<p>Ce signalement attend une prise en charge depuis " + jours + " jours.</p>" + corpsHtml(s, null);
        cibles.forEach(d -> publier(d.email(), sujet, corps));
    }

    private void publier(String email, String sujet, String corpsHtml) {
        if (email == null || email.isBlank()) return;
        publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE,
                Map.of("email", email, "sujet", sujet, "corpsHtml", corpsHtml)));
    }

    private String corpsHtml(SignalementTelephoneDto s, User signaleur) {
        String auteur = signaleur != null
                ? nvl(trim(signaleur.getFirstName() + " " + signaleur.getLastName()), "la hiérarchie")
                  + " (" + nvl(s.getSignaleParRole(), "direction") + ")"
                : nvl(s.getSignalePar(), "la hiérarchie") + " (" + nvl(s.getSignaleParRole(), "direction") + ")";
        return "<p>Un numéro de téléphone client est signalé pour votre point de service"
                + (s.getPointVente() != null ? " <b>" + echapper(s.getPointVente()) + "</b>" : "") + ".</p>"
                + "<table cellpadding=\"6\" style=\"border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px\">"
                + ligne("Client", nvl(s.getNomClient(), "—") + " (" + s.getCodCliente() + ")")
                + ligne("Crédit", s.getNumCredito() == null ? "—" : String.valueOf(s.getNumCredito()))
                + ligne("Motif", libelleMotif(s.getMotif()))
                + ligne("Commentaire", nvl(s.getCommentaire(), "—"))
                + ligne("Numéros constatés", tel(s.getTelPrincipalConstate()) + " / " + tel(s.getTelSecundarioConstate())
                        + " / " + tel(s.getTelOtroConstate()))
                + ligne("Signalé par", auteur)
                + ligne("Signalé le", s.getSignaleAt() == null ? "—" : s.getSignaleAt().format(FMT))
                + "</table>"
                + "<p>Ouvrez <b>Changement téléphone</b> dans digi, onglet <b>Signalements reçus</b>, "
                + "pour créer la demande de modification ou classer le signalement.</p>";
    }

    private static String ligne(String cle, String valeur) {
        return "<tr><td style=\"color:#555\">" + cle + "</td><td><b>" + echapper(valeur) + "</b></td></tr>";
    }

    static String libelleMotif(String motif) {
        if (motif == null) return "—";
        return switch (motif) {
            case "INJOIGNABLE" -> "Numéro injoignable";
            case "ERRONE" -> "Numéro erroné";
            case "ABSENT" -> "Aucun numéro";
            case "CHANGE" -> "Le client a changé de numéro";
            default -> "Autre";
        };
    }

    private static String tel(String v) {
        return v == null || v.isBlank() ? "—" : v;
    }

    private static String nvl(String v, String defaut) {
        return v == null || v.isBlank() ? defaut : v;
    }

    private static String trim(String v) {
        return v == null ? null : v.trim();
    }

    private static String echapper(String v) {
        return v == null ? "—" : v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
