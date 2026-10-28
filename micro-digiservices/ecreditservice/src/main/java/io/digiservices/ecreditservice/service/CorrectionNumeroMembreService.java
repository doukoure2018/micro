package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.VerificationMembreDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.CorrectionNumeroMembreRepository;
import io.digiservices.ecreditservice.repository.CorrectionNumeroMembreRepository.Dossier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Set;

/**
 * Correction du numero de membre d'un dossier de credit (V185, demande DSIG du 28/10/2026).
 *
 * <p>118 dossiers en cours portaient un numero que SAF ne connait pas, et personne ne
 * pouvait les corriger : le numero n'etait ecrit qu'a la creation du dossier. Restaient
 * l'annulation suivie d'une ressaisie, qui fausse le motif d'annulation, ou une correction
 * en base par la DSIG.</p>
 *
 * <p>Trois garde-fous : seuls l'agent qui porte le dossier et le directeur de son agence
 * corrigent, et tant que le dossier n'est pas valide definitivement ; le nouveau numero est
 * confronte a SAF avant d'etre ecrit, et un numero inconnu est refuse ; chaque correction
 * laisse une trace nominative avec l'ancien et le nouveau numero.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CorrectionNumeroMembreService {

    /**
     * Etats ou le dossier est encore en instruction. Au-dela, le credit est valide ou mis en
     * place : changer le client reviendrait a changer le beneficiaire apres coup.
     */
    private static final Set<String> ETATS_FERMES = Set.of("VALIDATED_FINAL", "VALIDATION");

    private final CorrectionNumeroMembreRepository repository;
    private final MembreSafService membreSaf;
    private final UserClient userClient;

    /** Ce que l'ecran a besoin de savoir avant de proposer le bouton. */
    public record Droit(boolean peutCorriger, String motifRefus) {}

    public Droit droit(String uuid, Long demandeId) {
        User user = utilisateur(uuid);
        Dossier dossier = repository.dossier(demandeId)
                .orElseThrow(() -> new ApiException("Dossier introuvable"));
        try {
            exiger(user, dossier);
            return new Droit(true, null);
        } catch (ApiException refus) {
            return new Droit(false, refus.getMessage());
        }
    }

    /**
     * Corrige le numero. Renvoie ce que SAF dit du nouveau client, pour que l'ecran puisse
     * l'afficher et que l'agent verifie qu'il s'agit bien de la bonne personne.
     */
    @Transactional
    public VerificationMembreDto corriger(String uuid, Long demandeId, String numeroBrut, String motif) {
        User user = utilisateur(uuid);
        Dossier dossier = repository.dossier(demandeId)
                .orElseThrow(() -> new ApiException("Dossier introuvable"));
        exiger(user, dossier);

        String nouveau = MembreSafService.normaliser(numeroBrut);
        if (nouveau.equals(MembreSafService.normaliser(dossier.numeroMembre()))) {
            throw new ApiException("C'est déjà le numéro enregistré sur ce dossier");
        }

        // Le nouveau numero doit exister dans SAF : remplacer un mauvais numero par un autre
        // mauvais numero ne corrigerait rien.
        VerificationMembreDto v = membreSaf.verifier(nouveau);
        if (VerificationMembreDto.SAF_INDISPONIBLE.equals(v.getEtat())) {
            throw new ApiException("SAF ne répond pas pour l'instant : la correction attend, "
                    + "pour ne pas enregistrer un numéro que personne n'a pu vérifier");
        }
        if (!v.trouve()) {
            throw new ApiException("Numéro " + nouveau + " : " + v.getMessage());
        }

        repository.corriger(demandeId, nouveau, v.getNomClient(), v.getCodAgencia());
        repository.tracer(demandeId, dossier.numeroMembre(), nouveau, v.getNomClient(),
                v.getCodAgencia(), motif, user.getUserId(), nom(user), user.getRole());
        log.warn("[MEMBRE] dossier {} : numero {} -> {} ({}) par {} ({})", demandeId,
                dossier.numeroMembre(), nouveau, v.getNomClient(), user.getUserId(), user.getRole());
        return v;
    }

    // ───────────────────────── Qui a le droit ─────────────────────────

    /**
     * L'agent qui porte le dossier, le directeur de son agence, et la DSIG pour le support.
     * Le RA et les niveaux au-dessus du DA consultent mais ne corrigent pas : le numero se
     * verifie aupres du client, c'est le travail du point de service.
     */
    private void exiger(User user, Dossier dossier) {
        if (ETATS_FERMES.contains(dossier.etat())) {
            throw new ApiException("Ce dossier est validé : son numéro de membre ne se corrige plus");
        }
        String role = user.getRole() == null ? "" : user.getRole();
        String service = user.getService() == null ? "" : user.getService().trim().toUpperCase();

        if ("SUPER_ADMIN".equals(role) || ("MANAGER".equals(role) && "DSIG".equals(service))) {
            return;
        }
        if ("DA".equals(role)) {
            if (Objects.equals(user.getAgenceId(), dossier.agenceId())) {
                return;
            }
            throw new ApiException("Ce dossier n'est pas dans votre agence");
        }
        if ("AGENT_CREDIT".equals(role) || "AGENT_ACCUEIL".equals(role)) {
            if (Objects.equals(user.getUserId(), dossier.agentId())
                    || Objects.equals(user.getUserId(), dossier.saisiPar())) {
                return;
            }
            throw new ApiException("Ce dossier n'est pas le vôtre : voyez avec votre directeur d'agence");
        }
        throw new ApiException("La correction du numéro revient à l'agent qui porte le dossier "
                + "ou à son directeur d'agence");
    }

    private User utilisateur(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifié");
        }
        return user;
    }

    private static String nom(User user) {
        String prenom = user.getFirstName() == null ? "" : user.getFirstName();
        String nom = user.getLastName() == null ? "" : user.getLastName();
        return (prenom + " " + nom).trim();
    }
}
