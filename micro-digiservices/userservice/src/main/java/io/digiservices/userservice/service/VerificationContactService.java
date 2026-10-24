package io.digiservices.userservice.service;

import io.digiservices.userservice.event.Event;
import io.digiservices.userservice.dto.ContactVerifieDtos.ConfirmationDto;
import io.digiservices.userservice.dto.ContactVerifieDtos.DemandeCodeDto;
import io.digiservices.userservice.dto.ContactVerifieDtos.DemandeEnCoursDto;
import io.digiservices.userservice.dto.ContactVerifieDtos.ProfilContactDto;
import io.digiservices.userservice.enumeration.EventType;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.repository.VerificationContactRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

import static io.digiservices.userservice.dto.ContactVerifieDtos.CANAL_EMAIL;
import static io.digiservices.userservice.dto.ContactVerifieDtos.CANAL_SMS;

/**
 * Verification des contacts d'un utilisateur (V172, lot 1 du chantier contacts verifies).
 *
 * <p>Une modification de contact n'est enregistree qu'apres la saisie d'un code a six
 * chiffres recu a la NOUVELLE adresse ou au NOUVEAU numero. Le code prouve deux choses a
 * la fois : la boite (ou la ligne) existe, et c'est bien l'agent qui la tient. Remplacer
 * une adresse inventee par une adresse mal tapee devient impossible.</p>
 *
 * <p>L'adresse e-mail etant l'identifiant de connexion, un changement d'adresse change
 * l'identifiant : l'ancien reste accepte trente jours, c'est le filet de securite.</p>
 */
@Service
@Slf4j
public class VerificationContactService {

    private static final Pattern FORMAT_EMAIL =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final SecureRandom ALEA = new SecureRandom();

    private final VerificationContactRepository repository;
    private final BCryptPasswordEncoder encoder;
    private final SayeleSmsService smsService;
    private final ApplicationEventPublisher publisher;
    private final TransactionTemplate transactions;

    public VerificationContactService(VerificationContactRepository repository, BCryptPasswordEncoder encoder,
                                      SayeleSmsService smsService, ApplicationEventPublisher publisher,
                                      PlatformTransactionManager transactionManager) {
        this.repository = repository;
        this.encoder = encoder;
        this.smsService = smsService;
        this.publisher = publisher;
        this.transactions = new TransactionTemplate(transactionManager);
    }

    @Value("${verification.contact.validite.minutes:10}")
    private int validiteMinutes;
    @Value("${verification.contact.essais.max:5}")
    private int essaisMax;
    @Value("${verification.contact.grace.jours:30}")
    private int graceJours;

    // ───────────────────────── Lecture ─────────────────────────

    public ProfilContactDto profil(String userUuid) {
        Long userId = userId(userUuid);
        ProfilContactDto profil = repository.profil(userId)
                .orElseThrow(() -> new ApiException("Profil introuvable"));
        repository.demandeOuverte(userId, CANAL_EMAIL)
                .filter(d -> !d.expiree())
                .ifPresent(d -> profil.setDemandeEmail(enCours(d.canal(), d.destination(), d.expireAt(), d.essais())));
        repository.demandeOuverte(userId, CANAL_SMS)
                .filter(d -> !d.expiree())
                .ifPresent(d -> profil.setDemandeTelephone(enCours(d.canal(), d.destination(), d.expireAt(), d.essais())));
        return profil;
    }

    private DemandeEnCoursDto enCours(String canal, String destination, OffsetDateTime expireAt, int essais) {
        return DemandeEnCoursDto.builder()
                .canal(canal).destinationMasquee(masquer(canal, destination))
                .expireAt(expireAt).essais(essais).essaisMax(essaisMax)
                .build();
    }

    // ───────────────────────── Demande d'un code ─────────────────────────

    /**
     * Demande d'un code. L'ecriture en base est validee AVANT l'envoi : un appel au
     * fournisseur de SMS peut durer une vingtaine de secondes, et tenir une transaction
     * ouverte pendant ce temps a fait echouer la validation le 24/10/2026 — l'agent recevait
     * son code et voyait quand meme une erreur. L'envoi se fait donc hors transaction ; s'il
     * echoue, la demande ouverte est annulee pour que l'agent puisse recommencer proprement.
     */
    public DemandeCodeDto demanderCode(String userUuid, String canal, String destinationSaisie) {
        Long userId = userId(userUuid);
        ProfilContactDto profil = repository.profil(userId)
                .orElseThrow(() -> new ApiException("Profil introuvable"));

        String destination = CANAL_EMAIL.equals(canal)
                ? destinationEmail(destinationSaisie, profil, userId)
                : destinationTelephone(destinationSaisie, profil);

        String code = String.format("%06d", ALEA.nextInt(1_000_000));
        OffsetDateTime expireAt = transactions.execute(statut -> {
            // Une seule demande ouverte par canal : la precedente tombe.
            repository.annulerOuvertes(userId, canal, "remplacee par une nouvelle demande");
            return repository.creer(userId, canal, destination, encoder.encode(code), validiteMinutes);
        });

        try {
            envoyer(canal, destination, code, profil);
        } catch (RuntimeException e) {
            repository.annulerOuvertes(userId, canal, "envoi du code impossible");
            throw e;
        }

        log.info("[CONTACT] code {} envoye a l'utilisateur {} ({})", canal, userId, masquer(canal, destination));
        return DemandeCodeDto.builder()
                .canal(canal).destinationMasquee(masquer(canal, destination))
                .expireAt(expireAt).essaisMax(essaisMax)
                .message(CANAL_EMAIL.equals(canal)
                        ? "Un code à six chiffres vient d'être envoyé à cette adresse. "
                          + "Il est valable " + validiteMinutes + " minutes."
                        : "Un code à six chiffres vient d'être envoyé par SMS à ce numéro. "
                          + "Il est valable " + validiteMinutes + " minutes.")
                .build();
    }

    /**
     * Nouvelle adresse : format correct, et pas deja prise. Reprendre l'adresse actuelle est
     * permis quand elle n'a jamais ete prouvee — c'est le cas d'une adresse saisie par le
     * directeur d'agence, que l'agent confirme a sa prochaine connexion (V173).
     */
    private String destinationEmail(String saisie, ProfilContactDto profil, Long userId) {
        String email = saisie == null ? "" : saisie.trim().toLowerCase();
        if (!FORMAT_EMAIL.matcher(email).matches()) {
            throw new ApiException("Cette adresse e-mail n'est pas valide");
        }
        if (email.equalsIgnoreCase(profil.getEmail())) {
            if (profil.getEmailVerifieAt() != null) {
                throw new ApiException("C'est déjà votre adresse actuelle, et elle est vérifiée");
            }
            return email;                 // confirmation de l'adresse en place
        }
        if (repository.emailDejaPris(email, userId)) {
            throw new ApiException("Cette adresse est déjà utilisée par un autre compte");
        }
        return email;
    }

    /** Nouveau numero : neuf chiffres commencant par 6, indicatif et separateurs retires. */
    private String destinationTelephone(String saisie, ProfilContactDto profil) {
        String numero = normaliserTelephone(saisie);
        if (numero.equals(profil.getTelephone()) && profil.getTelephoneVerifieAt() != null) {
            throw new ApiException("C'est déjà votre numéro actuel, et il est vérifié");
        }
        return numero;
    }

    /** « +224 622 00 11 22 », « 00224622001122 » ou « 622-00-11-22 » donnent 622001122. */
    public static String normaliserTelephone(String saisie) {
        String chiffres = saisie == null ? "" : saisie.replaceAll("\\D", "");
        if (chiffres.startsWith("00224")) {
            chiffres = chiffres.substring(5);
        } else if (chiffres.startsWith("224") && chiffres.length() > 9) {
            chiffres = chiffres.substring(3);
        }
        if (chiffres.length() != 9 || !chiffres.startsWith("6")) {
            throw new ApiException("Le numéro doit comporter neuf chiffres et commencer par 6");
        }
        return chiffres;
    }

    private void envoyer(String canal, String destination, String code, ProfilContactDto profil) {
        if (CANAL_SMS.equals(canal)) {
            SayeleSmsService.SendResult resultat = smsService.send(destination,
                    "Credit Rural de Guinee : votre code de verification est " + code
                            + ". Il expire dans " + validiteMinutes + " minutes.");
            if (!resultat.success()) {
                throw new ApiException("Le SMS n'a pas pu être envoyé, réessayez dans un instant");
            }
            return;
        }
        // Courriel : canal generique du notificationservice (destinataire, sujet, corps HTML).
        publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                "email", destination,
                "sujet", "Votre code de vérification — Crédit Rural de Guinée",
                "corpsHtml", corpsCourriel(profil.getNom(), code))));
    }

    private String corpsCourriel(String nom, String code) {
        return """
                <p>Bonjour %s,</p>
                <p>Vous avez demandé à utiliser cette adresse dans la plateforme digi du Crédit Rural
                de Guinée. Votre code de vérification est :</p>
                <p style="font-size:26px;font-weight:bold;letter-spacing:6px;margin:18px 0">%s</p>
                <p>Ce code est valable %d minutes. Saisissez-le dans la page « Mon profil » pour
                confirmer votre adresse.</p>
                <p><strong>À retenir :</strong> une fois confirmée, c'est avec cette adresse que vous
                vous connecterez. Votre ancienne adresse restera acceptée %d jours.</p>
                <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : rien ne sera
                modifié.</p>
                """.formatted(nom == null || nom.isBlank() ? "" : nom, code, validiteMinutes, graceJours);
    }

    // ───────────────────────── Confirmation ─────────────────────────

    @Transactional
    public ConfirmationDto confirmer(String userUuid, String canal, String code) {
        Long userId = userId(userUuid);
        VerificationContactRepository.Demande demande = repository.demandeOuverte(userId, canal)
                .orElseThrow(() -> new ApiException("Aucune demande en cours : demandez un nouveau code"));

        if (demande.expiree()) {
            repository.annuler(demande.id(), "code expire");
            throw new ApiException("Ce code a expiré, demandez-en un nouveau");
        }
        int essais = repository.incrementerEssais(demande.id());
        if (!encoder.matches(code, demande.codeHash())) {
            if (essais >= essaisMax) {
                repository.annuler(demande.id(), "trop d'essais");
                throw new ApiException("Code refusé " + essaisMax + " fois : demandez un nouveau code");
            }
            throw new ApiException("Code incorrect, il vous reste "
                    + (essaisMax - essais) + " essai(s)");
        }

        ProfilContactDto avant = repository.profil(userId)
                .orElseThrow(() -> new ApiException("Profil introuvable"));
        boolean memeValeur = CANAL_EMAIL.equals(canal)
                ? demande.destination().equalsIgnoreCase(avant.getEmail())
                : demande.destination().equals(avant.getTelephone());
        boolean identifiantChange = CANAL_EMAIL.equals(canal) && !memeValeur;

        if (CANAL_EMAIL.equals(canal)) {
            if (memeValeur) {
                // L'adresse ne bouge pas : l'agent prouve celle que son directeur a saisie.
                repository.marquerEmailVerifie(userId);
            } else {
                // Garde-fou : l'adresse a pu etre prise entre la demande et la confirmation.
                if (repository.emailDejaPris(demande.destination(), userId)) {
                    repository.annuler(demande.id(), "adresse prise entre-temps");
                    throw new ApiException("Cette adresse vient d'être utilisée par un autre compte");
                }
                repository.appliquerNouvelEmail(userId, demande.destination(), graceJours);
            }
        } else if (memeValeur) {
            repository.marquerTelephoneVerifie(userId);
        } else {
            repository.appliquerNouveauTelephone(userId, demande.destination());
        }
        repository.marquerVerifiee(demande.id());
        // L'obligation tombe d'elle-meme quand l'adresse et le numero sont tous deux prouves.
        repository.leverObligationSiComplet(userId);
        log.info("[CONTACT] utilisateur {} : {} verifie", userId, canal);

        ProfilContactDto profil = profil(userUuid);
        return ConfirmationDto.builder()
                .profil(profil)
                .identifiantChange(identifiantChange)
                .message(identifiantChange
                        ? "Votre adresse est confirmée. C'est désormais votre identifiant de "
                          + "connexion ; l'ancienne reste acceptée " + graceJours + " jours."
                        : CANAL_EMAIL.equals(canal)
                          ? "Votre adresse est confirmée."
                          : "Votre numéro est confirmé.")
                .build();
    }

    // ───────────────────────── Utilitaires ─────────────────────────

    private Long userId(String userUuid) {
        return Optional.ofNullable(repository.userIdParUuid(userUuid))
                .orElseThrow(() -> new ApiException("Utilisateur non identifié"));
    }

    /** « rkamano322@gmail.com » devient « rk*******@gmail.com », « 622001122 » devient « 62*****22 ». */
    static String masquer(String canal, String destination) {
        if (destination == null || destination.isBlank()) {
            return "";
        }
        if (CANAL_SMS.equals(canal)) {
            return destination.length() <= 4 ? destination
                    : destination.substring(0, 2) + "*".repeat(destination.length() - 4)
                      + destination.substring(destination.length() - 2);
        }
        int arobase = destination.indexOf('@');
        if (arobase <= 1) {
            return destination;
        }
        String debut = destination.substring(0, Math.min(2, arobase));
        return debut + "*".repeat(Math.max(1, arobase - debut.length())) + destination.substring(arobase);
    }
}
