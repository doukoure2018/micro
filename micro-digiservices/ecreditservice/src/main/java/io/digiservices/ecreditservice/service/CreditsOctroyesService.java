package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.clients.portefeuille.CreditMembreSafDto;
import io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.CreditOctroye;
import io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.LigneSynthese;
import io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.Synthese;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.ConsultationTransactionsRepository;
import io.digiservices.ecreditservice.repository.CreditsOctroyesRepository;
import io.digiservices.ecreditservice.repository.CreditsOctroyesRepository.Filtre;
import io.digiservices.ecreditservice.utils.CreditsOctroyesRapprochement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.NIVEAU_AGENCE;
import static io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.NIVEAU_DELEGATION;
import static io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.NIVEAU_PS;

/**
 * Qui voit quels credits octroyes, et jusqu'ou il peut descendre.
 *
 * <p>Le perimetre est deduit du compte connecte, jamais recu du client : un directeur d'agence
 * qui changerait l'identifiant d'agence dans l'adresse de la requete verrait sinon le
 * portefeuille du voisin. Les filtres de descente sont acceptes, mais verifies contre ce
 * perimetre a chaque appel.</p>
 *
 * <p>Les niveaux ouverts suivent la hierarchie : le reseau descend delegation → agence → point
 * de service, le DR part de ses agences, le DA de ses points de service. Un niveau plus large
 * que son perimetre n'aurait qu'une ligne — la sienne — et donnerait l'illusion d'une vue
 * nationale.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CreditsOctroyesService {

    /** Plafond de lignes par page : au-dela, l'ecran n'est plus lisible et l'export prend le relais. */
    private static final int TAILLE_MAX = 200;

    /**
     * Dossiers rapproches avec SAF en un seul appel.
     *
     * <p>Un plafond, et un refus net au-dela plutot qu'une troncature : un rapprochement qui
     * rendrait 3 000 dossiers sur 5 000 afficherait un encours faux sans le dire. L'ecran
     * demande alors de resserrer — une agence, un mois — ce qui est de toute facon la maille
     * ou l'on agit.</p>
     */
    private static final int DOSSIERS_MAX_RAPPROCHEMENT = 3000;

    /**
     * Membres par appel a ebanking. La liste voyage dans l'adresse de la requete : 300 numeros
     * font environ 4 ko, la ou le serveur en refuse 8. ebanking decoupe ensuite a 500 pour la
     * limite de parametres de SQL Server — les deux plafonds ne protegent pas la meme chose.
     */
    private static final int MEMBRES_PAR_APPEL = 300;

    private final UserClient userClient;
    private final CreditsOctroyesRepository repository;
    private final EbankingPortefeuilleClient portefeuilleClient;
    private final EbankingClient ebankingClient;
    private final ConsultationTransactionsRepository journalConsultations;

    /** Ce que le compte connecte a le droit de voir. */
    public record Perimetre(String niveau, Long delegationId, Long agenceId,
                            List<String> niveaux, User user) {

        public boolean toutReseau() {
            return "RESEAU".equals(niveau);
        }
    }

    public Perimetre perimetreDe(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        String role = user.getRole() == null ? "" : user.getRole().trim();

        if ("DG".equalsIgnoreCase(role) || "SUPER_ADMIN".equalsIgnoreCase(role)
                || PerimetreSafService.serviceReseau(user.getService())) {
            return new Perimetre("RESEAU", null, null,
                    List.of(NIVEAU_DELEGATION, NIVEAU_AGENCE, NIVEAU_PS), user);
        }
        if ("DR".equalsIgnoreCase(role) && user.getDelegationId() != null) {
            return new Perimetre("DELEGATION", user.getDelegationId(), null,
                    List.of(NIVEAU_AGENCE, NIVEAU_PS), user);
        }
        if (("DA".equalsIgnoreCase(role) || "RA".equalsIgnoreCase(role)) && user.getAgenceId() != null) {
            return new Perimetre("AGENCE", user.getDelegationId(), user.getAgenceId(),
                    List.of(NIVEAU_PS), user);
        }
        throw new ApiException("Acces reserve au directeur d'agence, au directeur regional "
                + "et aux directions du siege. Votre compte doit porter son rattachement.");
    }

    public Synthese synthese(String uuid, String niveauDemande, Long delegationId, Long agenceId,
                             Long posId, LocalDate du, LocalDate au, String recherche) {
        Perimetre p = perimetreDe(uuid);
        String niveau = niveau(p, niveauDemande);
        Filtre f = filtre(p, delegationId, agenceId, posId, du, au, recherche);
        List<LigneSynthese> lignes = repository.synthese(niveau, f);
        Object[] total = repository.total(f);
        return new Synthese(niveau, p.niveaux(), lignes,
                (Long) total[0], (BigDecimal) total[1]);
    }

    /** Le detail des dossiers du perimetre affiche, page par page. */
    public List<CreditOctroye> liste(String uuid, Long delegationId, Long agenceId, Long posId,
                                     LocalDate du, LocalDate au, String recherche,
                                     int page, int taille) {
        Perimetre p = perimetreDe(uuid);
        Filtre f = filtre(p, delegationId, agenceId, posId, du, au, recherche);
        int t = Math.min(Math.max(taille, 1), TAILLE_MAX);
        return repository.liste(f, Math.max(page, 0) * t, t);
    }

    public long compter(String uuid, Long delegationId, Long agenceId, Long posId,
                        LocalDate du, LocalDate au, String recherche) {
        return repository.compter(filtre(perimetreDe(uuid), delegationId, agenceId, posId, du, au, recherche));
    }


    /**
     * La situation dans SAF des credits octroyes du perimetre : chaque dossier valide est
     * apparie au credit que l'agence a mis en place, et ce qui ne s'apparie pas est dit.
     *
     * <p>C'est ici que la lecture SAF a lieu, et seulement ici : la synthese et la liste
     * n'interrogent que Postgres. Le rapprochement est donc une action, pas un effet de bord
     * de l'ouverture d'un ecran.</p>
     */
    public CreditsOctroyesRapprochement.Resultat situation(
            String uuid, Long delegationId, Long agenceId, Long posId,
            LocalDate du, LocalDate au, String recherche) {
        Perimetre p = perimetreDe(uuid);
        Filtre f = filtre(p, delegationId, agenceId, posId, du, au, recherche);

        long nombre = repository.compter(f);
        if (nombre > DOSSIERS_MAX_RAPPROCHEMENT) {
            throw new ApiException("Ce perimetre porte " + nombre + " credits octroyes : au-dela de "
                    + DOSSIERS_MAX_RAPPROCHEMENT + ", le rapprochement avec SAF n'est pas lance pour "
                    + "ne pas afficher un encours partiel. Choisissez une agence, un point de service "
                    + "ou une periode.");
        }
        var dossiers = repository.liste(f, 0, DOSSIERS_MAX_RAPPROCHEMENT);
        List<String> membres = repository.numerosMembre(f, DOSSIERS_MAX_RAPPROCHEMENT);

        List<CreditMembreSafDto> credits = new ArrayList<>();
        for (int i = 0; i < membres.size(); i += MEMBRES_PAR_APPEL) {
            List<String> paquet = membres.subList(i, Math.min(i + MEMBRES_PAR_APPEL, membres.size()));
            credits.addAll(portefeuilleClient.getCreditsDesMembres(paquet));
        }
        log.info("Credits octroyes : {} dossiers, {} membres, {} credits SAF lus (perimetre {})",
                dossiers.size(), membres.size(), credits.size(), p.niveau());
        return CreditsOctroyesRapprochement.rapprocher(dossiers, credits);
    }

    // ==================== situation financiere du membre ====================

    /**
     * Les comptes et les soldes du membre d'un dossier octroye.
     *
     * <p>Ouvert au directeur d'agence, au directeur regional et aux directions, mais BORNE au
     * dossier : l'acces part d'un credit que l'on a soi-meme fait accorder, jamais d'une
     * recherche libre dans la clientele. C'est ce qui separe cet ecran de la « verification
     * client » de la DSIG, qui cherche n'importe quel membre et releve d'une autre
     * habilitation.</p>
     */
    public Object situationFinanciere(String uuid, Long demandeIndividuelId) {
        Perimetre p = perimetreDe(uuid);
        String membre = membreDuDossier(p, demandeIndividuelId);
        log.info("Situation financiere - user {} dossier {} membre {}",
                p.user().getUserId(), demandeIndividuelId, membre);
        return ebankingClient.getFicheSignaletiqueWithSolde(membre).getBody();
    }

    /**
     * Les derniers mouvements d'un compte du membre, Production et Middleware cote a cote.
     *
     * <p>Journalise comme la consultation de la DSIG (V162) : ce sont les operations d'un
     * client, et savoir qui les a regardees fait partie du dispositif. Le journal est le meme,
     * pour que l'audit n'ait pas deux endroits a consulter.</p>
     */
    public Map<String, Object> mouvementsDuCompte(String uuid, Long demandeIndividuelId,
                                                  String numCuenta, int limite) {
        Perimetre p = perimetreDe(uuid);
        String membre = membreDuDossier(p, demandeIndividuelId);
        User u = p.user();
        int n = Math.min(Math.max(limite, 1), 20);
        try {
            Map<String, Object> reponse = ebankingClient.getDernieresTransactionsCompte(membre, numCuenta, n);
            Object donnees = reponse == null ? null : reponse.get("data");
            journalConsultations.journaliser(u.getUserId(), u.getUsername(), u.getRole(),
                    membre, numCuenta, n, "OK", null, null, null, null);
            return Map.of("transactions", donnees == null ? Map.of() : donnees);
        } catch (RuntimeException e) {
            journalConsultations.journaliser(u.getUserId(), u.getUsername(), u.getRole(),
                    membre, numCuenta, n, "ERREUR", null, null, null, e.getMessage());
            throw new ApiException("Service bancaire indisponible pour ce compte, veuillez reessayer");
        }
    }

    /**
     * Le membre du dossier, apres verification que le dossier est bien dans le perimetre.
     *
     * <p>Un seul message de refus pour tous les cas — dossier inexistant, non octroye, hors
     * perimetre : repondre « il existe, mais pas chez vous » renseignerait sur le reseau
     * voisin.</p>
     */
    private String membreDuDossier(Perimetre p, Long demandeIndividuelId) {
        return repository.membreDuDossierDansPerimetre(demandeIndividuelId, p.delegationId(), p.agenceId())
                .orElseThrow(() -> new ApiException(
                        "Ce dossier n'est pas un credit octroye de votre reseau, ou ne porte pas de "
                                + "numero de membre exploitable"));
    }

    /**
     * Le niveau effectivement lu. « auto » prend le plus large que le profil peut consulter,
     * pour que chacun arrive sur SA vue d'ensemble sans avoir a la choisir.
     */
    private String niveau(Perimetre p, String demande) {
        String n = demande == null || demande.isBlank() ? "auto" : demande.trim().toLowerCase();
        if ("auto".equals(n)) {
            return p.niveaux().get(0);
        }
        if (!p.niveaux().contains(n)) {
            throw new ApiException("Niveau « " + demande + " » non disponible pour votre profil");
        }
        return n;
    }

    /**
     * Le filtre effectif : le perimetre du compte, resserre par la descente demandee et
     * seulement si celle-ci reste a l'interieur.
     */
    Filtre filtre(Perimetre p, Long delegationId, Long agenceId, Long posId,
                  LocalDate du, LocalDate au, String recherche) {
        Long delegation = p.toutReseau() ? delegationId : p.delegationId();
        Long agence = p.agenceId();

        if (!p.toutReseau() && delegationId != null && !delegationId.equals(p.delegationId())) {
            throw new ApiException("Cette delegation n'est pas dans votre perimetre");
        }
        if (agenceId != null) {
            if (p.agenceId() != null && !agenceId.equals(p.agenceId())) {
                throw new ApiException("Cette agence n'est pas dans votre perimetre");
            }
            if (p.agenceId() == null && p.delegationId() != null
                    && !repository.agenceDansDelegation(agenceId, p.delegationId())) {
                throw new ApiException("Cette agence n'est pas dans votre delegation");
            }
            agence = agenceId;
            // L'agence porte sa delegation : la garder en plus serait redondant, et faux si
            // les deux identifiants ne concordaient pas.
            delegation = p.toutReseau() ? null : delegation;
        }
        if (posId != null) {
            if (p.agenceId() != null && !repository.posDansAgence(posId, p.agenceId())) {
                throw new ApiException("Ce point de service n'est pas dans votre agence");
            }
            if (p.agenceId() == null && p.delegationId() != null
                    && !repository.posDansDelegation(posId, p.delegationId())) {
                throw new ApiException("Ce point de service n'est pas dans votre delegation");
            }
            if (agenceId != null && !repository.posDansAgence(posId, agenceId)) {
                throw new ApiException("Ce point de service n'est pas dans l'agence demandee");
            }
        }
        return new Filtre(delegation, agence, posId, du, au, recherche);
    }
}
