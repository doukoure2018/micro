package io.digiservices.userservice.service;

import io.digiservices.userservice.dto.ContactVerifieDtos.EquipeContactDto;
import io.digiservices.userservice.dto.ContactVerifieDtos.EquipeContactsDto;
import io.digiservices.userservice.dto.ContactVerifieDtos.IndicateursContactsDto;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.repository.VerificationContactRepository;
import io.digiservices.userservice.repository.VerificationContactRepository.Contexte;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

import static io.digiservices.userservice.dto.ContactVerifieDtos.CANAL_EMAIL;

/**
 * Suivi des contacts de l'equipe (V173, lot 2 du chantier contacts verifies).
 *
 * <p>Le directeur d'agence voit ou en sont les contacts de ses agents et relance de vive
 * voix, ce qui vaut tous les courriels — surtout quand le courriel n'arrive pas. Il peut
 * aussi saisir le contact d'un agent qui n'y arrive pas, mais cette saisie n'est jamais
 * une verification : l'agent devra la confirmer par un code.</p>
 *
 * <p>Le perimetre suit la meme regle que partout ailleurs dans digi : agence pour le
 * directeur d'agence et le responsable d'agence, delegation pour le directeur regional,
 * reseau pour la Direction de l'exploitation, la direction generale et la DSIG.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContactEquipeService {

    public static final String NIVEAU_AGENCE = "AGENCE";
    public static final String NIVEAU_DELEGATION = "DELEGATION";
    public static final String NIVEAU_RESEAU = "RESEAU";

    private final VerificationContactRepository repository;

    @Value("${verification.contact.grace.jours:30}")
    private int graceJours;

    /** Ce que le demandeur a le droit de voir, et ce qu'il peut y faire. */
    private record Perimetre(Contexte contexte, String niveau, Long agenceId, Long delegationId,
                             boolean peutSaisir) {}

    private Perimetre perimetre(String userUuid) {
        Long userId = repository.userIdParUuid(userUuid);
        if (userId == null) {
            throw new ApiException("Utilisateur non identifié");
        }
        Contexte c = repository.contexte(userId)
                .orElseThrow(() -> new ApiException("Utilisateur non identifié"));
        String niveau = niveauDe(c.role(), c.service());
        boolean peutSaisir = peutSaisir(c.role(), c.service());
        if (niveau == null) {
            throw new ApiException("Accès réservé aux responsables d'agence et aux niveaux de direction");
        }
        return switch (niveau) {
            case NIVEAU_RESEAU -> new Perimetre(c, NIVEAU_RESEAU, null, null, peutSaisir);
            case NIVEAU_DELEGATION -> {
                exigerRattachement(c.delegationId(), "votre délégation");
                yield new Perimetre(c, NIVEAU_DELEGATION, null, c.delegationId(), peutSaisir);
            }
            default -> {
                exigerRattachement(c.agenceId(), "votre agence");
                yield new Perimetre(c, NIVEAU_AGENCE, c.agenceId(), null, peutSaisir);
            }
        };
    }

    /**
     * Jusqu'ou chacun voit : agence pour le directeur et le responsable d'agence, delegation
     * pour le directeur regional, reseau pour la Direction de l'exploitation, la direction
     * generale et la DSIG. {@code null} pour tous les autres : la page ne s'ouvre pas.
     */
    public static String niveauDe(String roleBrut, String serviceBrut) {
        String role = roleBrut == null ? "" : roleBrut.trim().toUpperCase();
        String service = serviceBrut == null ? "" : serviceBrut.trim().toUpperCase();
        if ("DG".equals(role) || "SUPER_ADMIN".equals(role)
                || ("MANAGER".equals(role) && ("DE".equals(service) || "DSIG".equals(service)))) {
            return NIVEAU_RESEAU;
        }
        if ("DR".equals(role)) {
            return NIVEAU_DELEGATION;
        }
        if ("DA".equals(role) || "RA".equals(role)) {
            return NIVEAU_AGENCE;
        }
        return null;
    }

    /**
     * Qui saisit a la place d'un agent : le directeur d'agence, qui l'a au telephone ou en
     * face de lui, et la DSIG pour le support. Le responsable d'agence et le directeur
     * regional regardent, ils ne saisissent pas.
     */
    public static boolean peutSaisir(String roleBrut, String serviceBrut) {
        String role = roleBrut == null ? "" : roleBrut.trim().toUpperCase();
        String service = serviceBrut == null ? "" : serviceBrut.trim().toUpperCase();
        return "DA".equals(role) || "SUPER_ADMIN".equals(role)
                || ("MANAGER".equals(role) && "DSIG".equals(service));
    }

    private void exigerRattachement(Long id, String quoi) {
        if (id == null) {
            throw new ApiException("Votre fiche n'est rattachée à aucune structure : "
                    + "impossible de déterminer " + quoi + ". Contactez la DSIG.");
        }
    }

    /** La liste des contacts du perimetre, avec son decompte. */
    public EquipeContactsDto equipe(String userUuid) {
        Perimetre p = perimetre(userUuid);
        List<EquipeContactDto> lignes = repository.equipe(p.agenceId(), p.delegationId());
        return EquipeContactsDto.builder()
                .niveau(p.niveau())
                .peutSaisir(p.peutSaisir())
                .indicateurs(decompte(lignes, null))
                .synthese(NIVEAU_RESEAU.equals(p.niveau()) ? repository.syntheseParDelegation() : List.of())
                .lignes(lignes)
                .build();
    }

    private IndicateursContactsDto decompte(List<EquipeContactDto> lignes, String libelle) {
        return IndicateursContactsDto.builder()
                .libelle(libelle)
                .nbAgents(lignes.size())
                .nbEmailEnEchec(lignes.stream().filter(EquipeContactDto::isEmailEnEchec).count())
                .nbSansTelephone(lignes.stream()
                        .filter(l -> l.getTelephone() == null || l.getTelephone().isBlank()).count())
                .nbAconfirmer(lignes.stream()
                        .filter(l -> (l.getEmailSaisiPar() != null && !l.isEmailVerifie())
                                || (l.getTelephoneSaisiPar() != null && !l.isTelephoneVerifie()))
                        .count())
                .nbContactsVerifies(lignes.stream()
                        .filter(l -> l.isEmailVerifie() && l.isTelephoneVerifie()).count())
                .build();
    }

    /**
     * Le directeur d'agence saisit le contact d'un agent de son agence. La valeur est
     * enregistree mais marquee non verifiee : l'agent la confirmera par un code.
     */
    @Transactional
    public EquipeContactsDto saisir(String userUuid, Long agentUserId, String canal, String valeur) {
        Perimetre p = perimetre(userUuid);
        if (!p.peutSaisir()) {
            throw new ApiException("Seul le directeur d'agence saisit le contact d'un agent");
        }
        Contexte agent = repository.rattachement(agentUserId)
                .orElseThrow(() -> new ApiException("Agent introuvable"));
        if (!dansLePerimetre(p, agent)) {
            throw new ApiException("Cet agent n'est pas dans votre agence");
        }
        if (Objects.equals(agentUserId, p.contexte().userId())) {
            throw new ApiException("Pour votre propre contact, passez par « Mon profil » : "
                    + "vous devez le vérifier par un code");
        }

        if (CANAL_EMAIL.equals(canal)) {
            String email = valeur == null ? "" : valeur.trim().toLowerCase();
            if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                throw new ApiException("Cette adresse e-mail n'est pas valide");
            }
            if (repository.emailDejaPris(email, agentUserId)) {
                throw new ApiException("Cette adresse est déjà utilisée par un autre compte");
            }
            repository.saisirEmailParDa(agentUserId, email, graceJours, p.contexte().userId());
            log.info("[CONTACT] adresse de l'agent {} saisie par {}", agentUserId, p.contexte().userId());
        } else {
            String numero = VerificationContactService.normaliserTelephone(valeur);
            repository.saisirTelephoneParDa(agentUserId, numero, p.contexte().userId());
            log.info("[CONTACT] numero de l'agent {} saisi par {}", agentUserId, p.contexte().userId());
        }
        return equipe(userUuid);
    }

    private boolean dansLePerimetre(Perimetre p, Contexte agent) {
        return switch (p.niveau()) {
            case NIVEAU_RESEAU -> true;
            case NIVEAU_DELEGATION -> Objects.equals(agent.delegationId(), p.delegationId());
            default -> Objects.equals(agent.agenceId(), p.agenceId());
        };
    }
}
