package io.digiservices.userservice.resource;

import io.digiservices.userservice.dto.ContactVerifieDtos.ConfirmationCodeRequest;
import io.digiservices.userservice.dto.ContactVerifieDtos.DemandeCodeRequest;
import io.digiservices.userservice.dto.ContactVerifieDtos.SaisieContactRequest;
import io.digiservices.userservice.service.ContactEquipeService;
import io.digiservices.userservice.service.VerificationContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.userservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

/**
 * Page « Mon profil » : l'utilisateur connecte voit ses contacts et les corrige lui-meme,
 * un code de verification a l'appui (V172, lot 1 du chantier contacts verifies).
 *
 * <p>Tout passe par l'utilisateur connecte : aucune de ces routes ne prend d'identifiant
 * en parametre, on ne peut donc pas modifier le contact de quelqu'un d'autre.</p>
 */
@RestController
@RequestMapping("/user/profil")
@RequiredArgsConstructor
public class ProfilContactResource {

    private final VerificationContactService verificationContactService;
    private final ContactEquipeService contactEquipeService;

    /** Identite, contacts, etat de verification et demande en cours s'il y en a une. */
    @GetMapping("/contacts")
    public ResponseEntity<io.digiservices.userservice.domain.Response> contacts(
            @NotNull Authentication authentication, HttpServletRequest request) {
        var profil = verificationContactService.profil(authentication.getName());
        return ok(getResponse(request, Map.of("profil", profil), "Profil recupere", OK));
    }

    /** Demande un code a six chiffres pour une nouvelle adresse ou un nouveau numero. */
    @PostMapping("/contacts/code")
    public ResponseEntity<io.digiservices.userservice.domain.Response> demanderCode(
            @NotNull Authentication authentication,
            @RequestBody @Valid DemandeCodeRequest requete,
            HttpServletRequest request) {
        var resultat = verificationContactService.demanderCode(
                authentication.getName(), requete.getCanal(), requete.getDestination());
        return ok(getResponse(request, Map.of("demande", resultat), resultat.getMessage(), OK));
    }

    /**
     * Suivi des contacts de l'equipe : decompte, liste, et synthese par delegation au
     * niveau reseau (V173). Le perimetre est impose par le serveur selon le role.
     */
    @GetMapping("/contacts/equipe")
    public ResponseEntity<io.digiservices.userservice.domain.Response> equipe(
            @NotNull Authentication authentication, HttpServletRequest request) {
        var equipe = contactEquipeService.equipe(authentication.getName());
        return ok(getResponse(request, Map.of("equipe", equipe), "Contacts de l'equipe", OK));
    }

    /**
     * Le directeur d'agence saisit le contact d'un agent qui n'y arrive pas. La valeur est
     * enregistree mais non verifiee : l'agent devra la confirmer par un code.
     */
    @PostMapping("/contacts/equipe/saisie")
    public ResponseEntity<io.digiservices.userservice.domain.Response> saisir(
            @NotNull Authentication authentication,
            @RequestBody @Valid SaisieContactRequest requete,
            HttpServletRequest request) {
        var equipe = contactEquipeService.saisir(authentication.getName(), requete.getAgentUserId(),
                requete.getCanal(), requete.getValeur());
        return ok(getResponse(request, Map.of("equipe", equipe),
                "Contact enregistre : l'agent doit le confirmer par un code", OK));
    }

    /** Saisie du code recu : la modification n'est appliquee que si le code est juste. */
    @PostMapping("/contacts/confirmation")
    public ResponseEntity<io.digiservices.userservice.domain.Response> confirmer(
            @NotNull Authentication authentication,
            @RequestBody @Valid ConfirmationCodeRequest requete,
            HttpServletRequest request) {
        var resultat = verificationContactService.confirmer(
                authentication.getName(), requete.getCanal(), requete.getCode());
        return ok(getResponse(request, Map.of("confirmation", resultat), resultat.getMessage(), OK));
    }
}
