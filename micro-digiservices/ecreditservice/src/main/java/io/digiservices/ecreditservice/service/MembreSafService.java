package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.MembreSafRepriseRepository;
import io.digiservices.clients.portefeuille.MembreSafDto;
import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.dto.MembreGroupe;
import io.digiservices.ecreditservice.dto.VerificationMembreDto;
import io.digiservices.ecreditservice.exception.ValidationException;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Verification d'un numero de membre dans SAF, a la saisie d'une demande de credit.
 *
 * <p>Avant ce controle, aucun des trois formulaires qui recoivent un numero de membre ne
 * demandait a SAF si le client existait ; seul l'historique des credits etait lu, et une liste
 * vide ne distinguait pas « membre inconnu » de « membre sans credit ». Le 26/10/2026, 322
 * dossiers sur 9 800 portaient un numero que SAF ne connaissait pas.</p>
 *
 * <p>La lecture se fait dans la base de PRODUCTION, jamais dans la sauvegarde : un client ouvert
 * ce matin n'existe que la. Deux regles de decision : un numero inconnu ou mal forme est
 * refuse, par l'ecran et par le serveur ; SAF indisponible laisse passer la saisie avec un
 * marquage, pour qu'une coupure n'arrete pas le credit sur tout le reseau.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MembreSafService {

    /** SAF compte 905 637 clients a onze chiffres ; les 1 598 codes a six chiffres sont des reliques jamais saisies dans digi. */
    private static final Pattern ONZE_CHIFFRES = Pattern.compile("^\\d{11}$");

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final JdbcClient jdbcClient;
    private final UserClient userClient;
    private final MembreSafRepriseRepository reprise;
    private final ClotureSaf cloture;

    /** Enleve espaces et separateurs : un numero copie d'un tableur arrive souvent avec. */
    public static String normaliser(String numero) {
        return numero == null ? "" : numero.replaceAll("[\\s.\\-]", "").trim();
    }

    public VerificationMembreDto verifier(String numeroBrut) {
        String numero = normaliser(numeroBrut);
        if (!ONZE_CHIFFRES.matcher(numero).matches()) {
            return VerificationMembreDto.builder()
                    .numero(numero).etat(VerificationMembreDto.FORME_INVALIDE)
                    .message(numero.isEmpty() ? "Le numéro de membre est obligatoire"
                            : "Le numéro de membre doit comporter exactement 11 chiffres (" + numero.length() + " saisis)")
                    .build();
        }
        try {
            MembreSafDto m = portefeuilleClient.getMembre(numero);
            return VerificationMembreDto.builder()
                    .numero(numero).etat(VerificationMembreDto.TROUVE)
                    .message("Membre reconnu dans SAF")
                    .nomClient(m.getNomCliente()).codAgencia(m.getCodAgencia()).agence(m.getDesAgencia())
                    .typePersonne(m.getIndPersona()).dateAdhesion(m.getFecIngreso()).telephone(m.getTelPrincipal())
                    .build();
        } catch (FeignException.NotFound e) {
            return VerificationMembreDto.builder()
                    .numero(numero).etat(VerificationMembreDto.INCONNU)
                    .message("Ce numéro de membre n'existe pas dans SAF. Vérifiez le numéro avec le client ; "
                            + "s'il est nouveau, il doit d'abord être créé dans SAF.")
                    .build();
        } catch (Exception e) {
            log.warn("[MEMBRE SAF] Verification impossible pour {} : {}", numero, e.getMessage());
            // Pendant la cloture SAF du soir, nommer la cause : l'agent n'a pas a se demander si
            // son numero est en cause. La suite est la meme (saisie sous reserve, reverification).
            String message = cloture.dansLaFenetre()
                    ? "Clôture SAF en cours : le numéro ne peut pas être vérifié ce soir. "
                      + "La saisie est acceptée sous réserve, le numéro sera vérifié demain matin."
                    : "SAF ne répond pas : la saisie est acceptée sous réserve, le numéro sera revérifié.";
            return VerificationMembreDto.builder()
                    .numero(numero).etat(VerificationMembreDto.SAF_INDISPONIBLE)
                    .message(message)
                    .build();
        }
    }

    /**
     * Controle serveur d'une demande avant insertion : le numero principal et, pour un groupe,
     * chacun des membres. Refuse si un numero est inconnu ou mal forme ; laisse passer si SAF
     * est indisponible. Le resultat est garde dans la demande pour le marquage apres insertion.
     */
    public Verifications controler(DemandeIndividuel demande) {
        VerificationMembreDto principal = verifier(demande.getNumeroMembre());
        if (principal.bloquant()) {
            throw new ValidationException("Numéro de membre " + principal.getNumero() + " : " + principal.getMessage());
        }
        List<VerificationMembreDto> membres = new ArrayList<>();
        if (demande.getMembresGroupe() != null) {
            for (MembreGroupe m : demande.getMembresGroupe()) {
                VerificationMembreDto v = verifier(m.getNumeroMembre());
                if (v.bloquant()) {
                    throw new ValidationException("Membre du groupe " + v.getNumero()
                            + (m.getNomPrenom() == null ? "" : " (" + m.getNomPrenom() + ")") + " : " + v.getMessage());
                }
                membres.add(v);
            }
        }
        return new Verifications(principal, membres);
    }

    public record Verifications(VerificationMembreDto principal, List<VerificationMembreDto> membres) {
        public boolean toutTrouve() {
            return principal.trouve() && membres.stream().allMatch(VerificationMembreDto::trouve);
        }
    }

    /**
     * Les dossiers inconnus de SAF dans le perimetre du compte : son agence pour le DA et le RA,
     * sa delegation pour le DR, ses propres dossiers pour l'agent, tout le reseau pour la
     * direction. La meme liste que le courriel de la reprise, mais a jour en permanence.
     */
    public java.util.Map<String, Object> inconnus(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        String role = user.getRole() == null ? "" : user.getRole();
        String service = user.getService() == null ? "" : user.getService().trim().toUpperCase();
        Long agence = null;
        Long delegation = null;
        Long agent = null;
        String perimetre;
        if ("DA".equals(role) || "RA".equals(role)) {
            if (user.getAgenceId() == null) {
                throw new ApiException("Votre compte n'est rattache a aucune agence");
            }
            agence = user.getAgenceId();
            perimetre = "Votre agence";
        } else if ("DR".equals(role)) {
            if (user.getDelegationId() == null) {
                throw new ApiException("Votre compte n'est rattache a aucune delegation");
            }
            delegation = user.getDelegationId();
            perimetre = "Votre délégation";
        } else if ("AGENT_CREDIT".equals(role) || "AGENT_ACCUEIL".equals(role)) {
            agent = user.getUserId();
            perimetre = "Vos dossiers";
        } else if ("DG".equals(role) || "SUPER_ADMIN".equals(role)
                || ("MANAGER".equals(role) && (service.equals("DE") || service.equals("DSIG") || service.equals("DI")))) {
            perimetre = "Réseau";
        } else {
            throw new ApiException("Cette liste n'est pas ouverte à votre profil");
        }
        int[] c = reprise.compteurs(agence, delegation, agent);
        java.util.Map<String, Object> r = new java.util.LinkedHashMap<>();
        r.put("perimetre", perimetre);
        r.put("trouves", c[0]);
        r.put("inconnus", c[1]);
        r.put("aVerifier", c[2]);
        r.put("dossiers", reprise.inconnus(agence, delegation, agent));
        return r;
    }

    /** Marquage apres insertion : la fonction d'insertion en base a une liste de colonnes figee. */
    public void marquer(Long demandeId, Verifications v) {
        if (demandeId == null || v == null) {
            return;
        }
        VerificationMembreDto p = v.principal();
        jdbcClient.sql("""
                UPDATE demandeindividuel
                SET membre_verifie_saf = :verifie, membre_verifie_at = CURRENT_TIMESTAMP,
                    membre_nom_saf = :nom, membre_agence_saf = :agence
                WHERE demandeindividuel_id = :id
                """)
                .param("verifie", p.trouve())
                .param("nom", p.getNomClient())
                .param("agence", p.getCodAgencia())
                .param("id", demandeId)
                .update();
        for (VerificationMembreDto m : v.membres()) {
            jdbcClient.sql("""
                    UPDATE membre_groupe
                    SET membre_verifie_saf = :verifie, membre_nom_saf = :nom
                    WHERE demandeindividuel_id = :id AND numero_membre = :numero
                    """)
                    .param("verifie", m.trouve())
                    .param("nom", m.getNomClient())
                    .param("id", demandeId)
                    .param("numero", m.getNumero())
                    .update();
        }
        if (!v.toutTrouve()) {
            log.warn("[MEMBRE SAF] Demande {} enregistree sans verification complete : SAF indisponible", demandeId);
        }
    }
}
