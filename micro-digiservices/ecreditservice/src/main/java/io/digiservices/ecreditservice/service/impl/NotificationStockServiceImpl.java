package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.BonCommandeDelegationDto;
import io.digiservices.ecreditservice.dto.NotificationStockDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.NotificationStockRepository;
import io.digiservices.ecreditservice.repository.StockRepository;
import io.digiservices.ecreditservice.service.NotificationStockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationStockServiceImpl  implements NotificationStockService {

    private final NotificationStockRepository notificationStockRepository;
    private final StockRepository stockRepository;
    private final ApplicationEventPublisher publisher;

    @Override
    @Transactional
    public NotificationStockDto marquerVue(Long notificationId) {
        log.info("Marquage de la notification {} comme vue", notificationId);

        NotificationStockDto notification = notificationStockRepository.updateVue(notificationId, true);

        // Envoyer un email de confirmation si la notification est marquée comme vue
        if (notification != null && notification.getVue()) {
            envoyerEmailConfirmationLecture(notification);
        }

        return notification;
    }

    @Override
    @Transactional
    public NotificationStockDto marquerNonVue(Long notificationId) {
        log.info("Marquage de la notification {} comme non vue", notificationId);
        return notificationStockRepository.updateVue(notificationId, false);
    }

    @Override
    public List<NotificationStockDto> getNotificationsByUser(Long userId) {
        return notificationStockRepository.getNotificationsByUser(userId);
    }
    @Override
    public List<NotificationStockDto> getNotificationsByDelegation(Long delegationId) {
        return notificationStockRepository.getNotificationsByDelegation(delegationId);
    }

    @Override
    public int countUnreadByUser(Long userId) {
        return notificationStockRepository.countUnreadByUser(userId);
    }

    @Override
    @Transactional
    public void envoyerNotificationValidation(String delegation, Long createdBy) {
        log.info("Envoi de notification de validation pour la délégation: {}", delegation);

        // Récupérer les bons de commande de la délégation
        List<BonCommandeDelegationDto> bonsCommande = stockRepository.getBonsCommandeParDelegation(delegation);

        if (bonsCommande.isEmpty()) {
            log.warn("Aucun bon de commande trouvé pour la délégation: {}", delegation);
            return;
        }

        // Regrouper par DR (traite_par)
        Map<Long, List<BonCommandeDelegationDto>> commandesParDR = bonsCommande.stream()
                .filter(bc -> bc.getIdTraitant() != null)
                .collect(Collectors.groupingBy(BonCommandeDelegationDto::getIdTraitant));

        for (Map.Entry<Long, List<BonCommandeDelegationDto>> entry : commandesParDR.entrySet()) {
            Long drUserId = entry.getKey();
            List<BonCommandeDelegationDto> commandes = entry.getValue();

            // Créer les notifications pour chaque commande
            for (BonCommandeDelegationDto commande : commandes) {
                String message = String.format("Validation des bons de commande de la délégation %s", delegation);

                notificationStockRepository.createNotification(
                        drUserId,
                        commande.getIdCmd(),
                        commande.getDelegationId(),
                        "VALIDATION",
                        message,
                        createdBy
                );
            }

            // Envoyer l'email au DR
            envoyerEmailValidation(drUserId, delegation, commandes, createdBy);
        }
    }

    @Override
    @Transactional
    public void envoyerNotificationRejet(String delegation, Long createdBy, String motif) {
        log.info("Envoi de notification de rejet pour la délégation: {}", delegation);

        List<BonCommandeDelegationDto> bonsCommande = stockRepository.getBonsCommandeParDelegation(delegation);

        if (bonsCommande.isEmpty()) {
            log.warn("Aucun bon de commande trouvé pour la délégation: {}", delegation);
            return;
        }

        Map<Long, List<BonCommandeDelegationDto>> commandesParDR = bonsCommande.stream()
                .filter(bc -> bc.getIdTraitant() != null)
                .collect(Collectors.groupingBy(BonCommandeDelegationDto::getIdTraitant));

        for (Map.Entry<Long, List<BonCommandeDelegationDto>> entry : commandesParDR.entrySet()) {
            Long drUserId = entry.getKey();
            List<BonCommandeDelegationDto> commandes = entry.getValue();

            for (BonCommandeDelegationDto commande : commandes) {
                String message = String.format("Rejet des bons de commande de la délégation %s. Motif: %s",
                        delegation, motif);

                notificationStockRepository.createNotification(
                        drUserId,
                        commande.getIdCmd(),
                        commande.getDelegationId(),
                        "REJET",
                        message,
                        createdBy
                );
            }

            envoyerEmailRejet(drUserId, delegation, commandes, createdBy, motif);
        }
    }

    private void envoyerEmailValidation(Long drUserId, String delegation,
                                        List<BonCommandeDelegationDto> commandes, Long createdBy) {
        // Construire le contenu de l'email
        StringBuilder detailsCommandes = new StringBuilder();
        for (BonCommandeDelegationDto cmd : commandes) {
            detailsCommandes.append(String.format("- %s: %s (Créé le: %s)\n",
                    cmd.getNumeroCommande(),
                    cmd.getService(),
                    cmd.getDateCreation()));
        }

        // Publier l'événement pour Kafka
        publisher.publishEvent(new Event(EventType.STOCK_VALIDATED, Map.of(
                "drUserId", drUserId.toString(),
                "delegation", delegation,
                "nombreCommandes", String.valueOf(commandes.size()),
                "detailsCommandes", detailsCommandes.toString(),
                "createdBy", createdBy.toString(),
                "emailDR", commandes.get(0).getEmailUtilisateur(),
                "nomDR", commandes.get(0).getNomCompletTraitant()
        )));

        log.info("Email de validation envoyé au DR {} pour {} commandes", drUserId, commandes.size());
    }

    private void envoyerEmailRejet(Long drUserId, String delegation,
                                   List<BonCommandeDelegationDto> commandes, Long createdBy, String motif) {
        StringBuilder detailsCommandes = new StringBuilder();
        for (BonCommandeDelegationDto cmd : commandes) {
            detailsCommandes.append(String.format("- %s: %s\n",
                    cmd.getNumeroCommande(),
                    cmd.getService()));
        }

        publisher.publishEvent(new Event(EventType.STOCK_REJECTED, Map.of(
                "drUserId", drUserId.toString(),
                "delegation", delegation,
                "nombreCommandes", String.valueOf(commandes.size()),
                "detailsCommandes", detailsCommandes.toString(),
                "motif", motif,
                "createdBy", createdBy.toString(),
                "emailDR", commandes.get(0).getEmailUtilisateur(),
                "nomDR", commandes.get(0).getNomCompletTraitant()
        )));

        log.info("Email de rejet envoyé au DR {} pour {} commandes", drUserId, commandes.size());
    }

    private void envoyerEmailConfirmationLecture(NotificationStockDto notification) {
        log.info("Envoi de l'email de confirmation de lecture pour la notification {}", notification.getId());
        // Logique supplémentaire si nécessaire
    }
}
