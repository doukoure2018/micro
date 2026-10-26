package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
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
            return VerificationMembreDto.builder()
                    .numero(numero).etat(VerificationMembreDto.SAF_INDISPONIBLE)
                    .message("SAF ne répond pas : la saisie est acceptée sous réserve, le numéro sera revérifié.")
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
