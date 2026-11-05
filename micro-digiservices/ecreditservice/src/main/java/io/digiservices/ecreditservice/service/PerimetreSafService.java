package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Perimetre SAF de l'utilisateur connecte, partage par le suivi du portefeuille, l'etat TT1
 * et le signalement de numero de telephone. Source unique : pointvente.code = COD_AGENCIA SAF.
 *
 * <p>DG, SUPER_ADMIN et MANAGER du service DE voient tout le reseau ; le DR sa delegation ;
 * le DA son agence ; l'AGENT_CREDIT son point de service.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PerimetreSafService {

    private final UserClient userClient;
    private final PortefeuillePerimetreRepository perimetreRepository;

    /** niveau : RESEAU, DELEGATION, AGENCE ou PS. */
    public record Perimetre(boolean toutReseau, Set<String> codes, String niveau, User user) {

        public boolean couvre(String codAgencia) {
            return toutReseau || codes.contains(codAgencia);
        }

        public String role() {
            return user == null ? null : user.getRole();
        }

        /**
         * Le service Audit lit et n'ecrit rien (V194). La regle est portee par le perimetre
         * parce que c'est l'objet que tous les services metier ont deja en main : chaque
         * action sensible la consulte avant d'ecrire, et un appel direct au point d'entree
         * est refuse comme l'ecran l'interdit.
         */
        public boolean lectureSeule() {
            return estAudit(user);
        }
    }

    /** Service dont les comptes ne modifient rien : ils controlent apres coup. */
    public static final String SERVICE_AUDIT = "Audit";
    /** Le service qui exploite la plateforme : il en voit tout le reseau. */
    public static final String SERVICE_DSIG = "DSIG";
    /** L'inspection : elle controle le reseau entier. */
    public static final String SERVICE_INSPECTION = "DI";
    /** La Direction financiere : elle controle des chiffres comptables sur tout le reseau. */
    public static final String SERVICE_DF = "DF";

    /**
     * Les services dont les comptes voient le reseau entier, quel que soit leur rattachement
     * geographique — ils n'en ont pas.
     *
     * <p>La meme liste que {@code RapprochementProfilResolver} cote outil de bureau, au DG pres
     * qui s'y exprime par son role. Les deux repondaient a la meme question de deux facons
     * differentes jusqu'au 05/11/2026, et le directeur de la DSIG se voyait refuser le tableau
     * de bord de son propre service.</p>
     */
    private static final Set<String> SERVICES_RESEAU =
            Set.of("DE", SERVICE_AUDIT, SERVICE_DSIG, SERVICE_INSPECTION, SERVICE_DF);

    private static boolean serviceReseau(String service) {
        if (service == null) {
            return false;
        }
        String s = service.trim();
        return SERVICES_RESEAU.stream().anyMatch(r -> r.equalsIgnoreCase(s));
    }

    private static boolean estAudit(User user) {
        return user != null && SERVICE_AUDIT.equalsIgnoreCase(user.getService());
    }

    /**
     * Le compte est-il en lecture seule, SANS rien exiger de son perimetre geographique ?
     *
     * <p>{@link #perimetreDe(String)} refuse tout role hors agent de credit et direction,
     * parce qu'il doit borner ce que le compte voit du reseau. Un ecran qui porte sur TOUT le
     * reseau — les credits negatifs, les comptes mal adosses — n'a pas de perimetre a borner :
     * son autorisation est la rubrique d'habilitation, pas le rattachement geographique. Lui
     * demander un perimetre revient a refuser les comptes de la DSIG, qui sont precisement
     * ceux a qui l'ecran est destine : c'est ce qui est arrive au bouton « Je m'en occupe »
     * des credits negatifs, ou un operationnel se voyait repondre « Acces reserve aux agents
     * de credit et niveaux de direction » (02/11/2026).</p>
     *
     * <p>Cette methode ne repond donc qu'a la question posee : ce compte appartient-il au
     * service qui controle sans modifier ?</p>
     */
    public boolean lectureSeule(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        return estAudit(user);
    }

    public Perimetre perimetreDe(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        String role = user.getRole();
        String service = user.getService();
        // Ces comptes n'ont pas d'agence : ils voient le reseau entier.
        //
        // Jusqu'au 05/11/2026 la liste s'arretait a la DE et a l'Audit. Le directeur de la DSIG
        // est un MANAGER du service DSIG, pas un SUPER_ADMIN : il se voyait refuser le
        // portefeuille SAF, le portefeuille a risque, les classes de confiance, l'affectation,
        // le contentieux et les ecrans d'audit — sur le tableau de bord de son propre service.
        // L'inspection et la Direction financiere ont ete ajoutees dans la foulee, a la demande
        // de la DSIG : elles avaient deja le reseau dans l'outil de rapprochement.
        if ("DG".equals(role) || "SUPER_ADMIN".equals(role)
                || ("MANAGER".equals(role) && serviceReseau(service))) {
            return new Perimetre(true, Set.of(), "RESEAU", user);
        }
        Set<String> codes;
        String rattachement;
        String niveau;
        if ("DR".equals(role)) {
            codes = perimetreRepository.codesParDelegation(user.getDelegationId());
            rattachement = "votre delegation";
            niveau = "DELEGATION";
        } else if ("DA".equals(role)) {
            codes = perimetreRepository.codesParAgence(user.getAgenceId());
            rattachement = "votre agence";
            niveau = "AGENCE";
        } else if ("AGENT_CREDIT".equals(role)) {
            codes = perimetreRepository.codesParPointVente(user.getPointventeId());
            rattachement = "votre point de service";
            niveau = "PS";
        } else {
            throw new ApiException("Acces reserve aux agents de credit et niveaux de direction");
        }
        if (codes.isEmpty()) {
            log.warn("[PERIMETRE SAF] Perimetre vide pour user={} role={} (pointvente.code non renseigne)",
                    user.getUserId(), role);
            throw new ApiException("Aucun point de service de " + rattachement
                    + " n'est encore relie a SAF — contactez l'administrateur");
        }
        return new Perimetre(false, codes, niveau, user);
    }
}
