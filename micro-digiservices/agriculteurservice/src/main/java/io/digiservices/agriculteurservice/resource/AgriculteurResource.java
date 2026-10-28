package io.digiservices.agriculteurservice.resource;

import io.digiservices.agriculteurservice.dto.AgenceCrgDto;
import io.digiservices.agriculteurservice.dto.AgenceDto;
import io.digiservices.agriculteurservice.dto.AgriculteurDto;
import io.digiservices.agriculteurservice.dto.CooperativeDto;
import io.digiservices.agriculteurservice.dto.CreditAgricoleDto;
import io.digiservices.agriculteurservice.dto.DelegationDto;
import io.digiservices.agriculteurservice.dto.EcheanceDto;
import io.digiservices.agriculteurservice.dto.MembreCooperativeDto;
import io.digiservices.agriculteurservice.dto.PageDto;
import io.digiservices.agriculteurservice.dto.PointDeVenteDto;
import io.digiservices.agriculteurservice.exception.BadRequestException;
import io.digiservices.agriculteurservice.service.AgriculteurService;
import io.digiservices.clients.agents.AgentPerimetreDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API publique AgriPilot ({@code /agriculteurs/**}). Reponses : DTO / PageDto bruts.
 * Delegue a {@link AgriculteurService}. Securisee par cle API publique (header X-API-Key).
 */
@RestController
@RequestMapping("/agriculteurs")
@RequiredArgsConstructor
@Slf4j
public class AgriculteurResource {

    private static final int MAX_PAGE_SIZE = 100;
    /** La route nationale accepte des pages plus larges : une lecture de nuit en quelques pages. */
    private static final int MAX_PAGE_SIZE_PORTFOLIO = 500;
    private static final java.util.regex.Pattern AGENT_ID = java.util.regex.Pattern.compile("CR-\\d{1,10}");

    private final AgriculteurService agriculteurService;

    @GetMapping("/agencies")
    public ResponseEntity<List<AgenceDto>> getAgencies() {
        log.info("[AGRI] GET /agriculteurs/agencies");
        return ResponseEntity.ok(agriculteurService.getAgencies());
    }

    @GetMapping("/agencies/{agencyId}/portfolio")
    public ResponseEntity<PageDto<CreditAgricoleDto>> getAgencyPortfolio(
            @PathVariable("agencyId") String agencyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agriculteurs/agencies/{}/portfolio page={} size={}", agencyId, page, size);
        PageDto<CreditAgricoleDto> resultat = agriculteurService.getAgencyPortfolio(agencyId, page, size);
        resultat.setDonneesSafAu(agriculteurService.donneesSafAu());
        return avecDate(resultat);
    }

    /**
     * Portefeuille national pagine (KUMY, lot 1) : jusqu'a 500 lignes par page, credits vivants par
     * defaut, option pour inclure les clos, filtre par delegation. Chaque reponse porte la date des
     * donnees, en en-tete et dans le corps : l'API lit la sauvegarde de la veille.
     */
    @GetMapping("/portfolio")
    public ResponseEntity<PageDto<CreditAgricoleDto>> getPortfolio(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(required = false) Long delegationId,
            @RequestParam(defaultValue = "false") boolean inclureClos) {
        if (page < 0) {
            throw new BadRequestException("Le parametre 'page' doit etre >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE_PORTFOLIO) {
            throw new BadRequestException("Le parametre 'size' doit etre compris entre 1 et " + MAX_PAGE_SIZE_PORTFOLIO);
        }
        log.info("[AGRI] GET /agriculteurs/portfolio page={} size={} delegationId={} inclureClos={}", page, size, delegationId, inclureClos);
        PageDto<CreditAgricoleDto> resultat = agriculteurService.getPortfolio(delegationId, inclureClos, page, size);
        return avecDate(resultat);
    }

    /** Dictionnaire des statuts de credit : code SAF, libelle, sens, classement. */
    @GetMapping("/referentiels/statuts")
    public ResponseEntity<List<java.util.Map<String, String>>> getStatuts() {
        return ResponseEntity.ok(agriculteurService.getStatuts());
    }

    /**
     * Sorties du portefeuille entre deux dates (point 10).
     *
     * <p>SAF ne date que les credits cloturees, et seulement une partie : les apures et les
     * transferts n'ont jamais de date de sortie et n'apparaissent donc pas ici.</p>
     */
    @GetMapping("/sorties")
    public ResponseEntity<PageDto<io.digiservices.agriculteurservice.dto.SortiePortefeuilleDto>> getSorties(
            @RequestParam("debut") String debut,
            @RequestParam("fin") String fin,
            @RequestParam(value = "delegationId", required = false) Long delegationId,
            @RequestParam(value = "codeAgence", required = false) String codeAgence,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "100") int size) {
        int taille = Math.min(Math.max(size, 1), MAX_PAGE_SIZE_PORTFOLIO);
        return avecDate(agriculteurService.getSorties(debut, fin, delegationId, codeAgence,
                Math.max(page, 0), taille));
    }

    /**
     * Serie mensuelle du portefeuille par point de vente (point 6). Bornes au format AAAA-MM,
     * incluses.
     *
     * <p>Chaque ligne porte sa provenance dans {@code source} : <b>PHOTO</b> pour un mois que la
     * plateforme a observe — l'encours est alors celui de SAF — ou <b>RECONSTITUTION</b> pour un
     * mois recalcule depuis l'echeancier. Dans ce second cas la production, les sorties datees et
     * les retards sont fideles, mais <b>l'encours est nul a dessein</b> : l'echeancier de SAF ne
     * reproduit pas le solde, et publier une approximation aurait fausse la serie de 40 %.</p>
     */
    @GetMapping("/historique")
    public ResponseEntity<List<io.digiservices.clients.agri.HistoriqueMensuelDto>> getHistorique(
            @RequestParam("debut") String debut,
            @RequestParam("fin") String fin,
            @RequestParam(value = "codeAgence", required = false) String codeAgence,
            @RequestParam(value = "delegationId", required = false) Long delegationId) {
        return ResponseEntity.ok(agriculteurService.getHistorique(debut, fin, codeAgence, delegationId));
    }

    /**
     * Objectifs de la Direction de l'exploitation (point 7). Vide tant que le fichier annuel de
     * la DE n'a pas ete charge ; le gabarit est annee, mois, cible, indicateur, valeur.
     */
    @GetMapping("/objectifs")
    public ResponseEntity<List<io.digiservices.clients.agri.ObjectifDto>> getObjectifs(
            @RequestParam("annee") int annee,
            @RequestParam(value = "codeAgence", required = false) String codeAgence,
            @RequestParam(value = "delegationId", required = false) Long delegationId) {
        return ResponseEntity.ok(agriculteurService.getObjectifs(annee, codeAgence, delegationId));
    }

    /** Referentiel des activites : activite, sous-activites et filieres agricoles (point 11). */
    @GetMapping("/referentiels/activites")
    public ResponseEntity<List<java.util.Map<String, Object>>> getActivites() {
        return ResponseEntity.ok(agriculteurService.getActivites());
    }

    /**
     * Agents de credit d'un point de vente (point 8). Le code attendu est le <b>code SAF</b>,
     * le meme que {@code codeAgence} du portefeuille.
     */
    @GetMapping("/agencies/{codeAgence}/agents")
    public ResponseEntity<List<io.digiservices.agriculteurservice.dto.AgentCreditDto>> getAgents(
            @PathVariable("codeAgence") String codeAgence) {
        return ResponseEntity.ok(agriculteurService.getAgents(codeAgence));
    }

    /**
     * Demandes de credit saisies dans digi, paginees et datees (point 9).
     *
     * @param depuis       date de creation minimale, au format AAAA-MM-JJ (optionnel)
     * @param delegationId restreint a une delegation (optionnel)
     * @param codeAgence   restreint a un point de vente, code SAF (optionnel)
     * @param etape        RECU, EN_INSTRUCTION, ACCORDE, REFUSE ou ANNULE (optionnel)
     */
    @GetMapping("/demandes")
    public ResponseEntity<PageDto<io.digiservices.agriculteurservice.dto.DemandeCreditDto>> getDemandes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "100") int size,
            @RequestParam(value = "depuis", required = false) String depuis,
            @RequestParam(value = "delegationId", required = false) Long delegationId,
            @RequestParam(value = "codeAgence", required = false) String codeAgence,
            @RequestParam(value = "etape", required = false) String etape) {
        int taille = Math.min(Math.max(size, 1), MAX_PAGE_SIZE_PORTFOLIO);
        return ResponseEntity.ok(agriculteurService.getDemandes(
                Math.max(page, 0), taille, depuis, delegationId, codeAgence, etape));
    }

    private <T> ResponseEntity<PageDto<T>> avecDate(PageDto<T> page) {
        String date = page.getDonneesSafAu();
        return date == null ? ResponseEntity.ok(page)
                : ResponseEntity.ok().header("X-Donnees-SAF-Au", date).body(page);
    }

    @GetMapping("/farmers")
    public ResponseEntity<PageDto<AgriculteurDto>> getFarmers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agriculteurs/farmers page={} size={}", page, size);
        return ResponseEntity.ok(agriculteurService.getFarmers(page, size));
    }

    @GetMapping("/farmers/{clientId}")
    public ResponseEntity<AgriculteurDto> getFarmer(@PathVariable("clientId") String clientId) {
        log.info("[AGRI] GET /agriculteurs/farmers/{}", clientId);
        return ResponseEntity.ok(agriculteurService.getFarmer(clientId));
    }

    @GetMapping("/farmers/{clientId}/credits")
    public ResponseEntity<List<CreditAgricoleDto>> getCreditsByFarmer(@PathVariable("clientId") String clientId) {
        log.info("[AGRI] GET /agriculteurs/farmers/{}/credits", clientId);
        return ResponseEntity.ok(agriculteurService.getCreditsByFarmer(clientId));
    }

    @GetMapping("/farmers/{clientId}/identite")
    public ResponseEntity<io.digiservices.agriculteurservice.dto.IdentiteMembreDto> getIdentiteByFarmer(
            @PathVariable("clientId") String clientId) {
        log.info("[AGRI] GET /agriculteurs/farmers/{}/identite", clientId);
        return ResponseEntity.ok(agriculteurService.getIdentite(clientId));
    }

    @GetMapping("/farmers/{clientId}/comptes")
    public ResponseEntity<io.digiservices.agriculteurservice.dto.ComptesMembreDto> getComptesByFarmer(
            @PathVariable("clientId") String clientId) {
        log.info("[AGRI] GET /agriculteurs/farmers/{}/comptes", clientId);
        return ResponseEntity.ok(agriculteurService.getComptes(clientId));
    }

    /**
     * Comme {@code /farmers/{clientId}/comptes}, mais à partir d'un des trois téléphones de la
     * fiche du membre (CL_CLIENTES.TEL_PRINCIPAL, TEL_SECUNDARIO, TEL_OTRO). Le numéro est
     * normalisé avant tout appel : 9 chiffres
     * commençant par 6, indicatif +224 accepté, sinon 400. Un numéro peut être porté par
     * plusieurs membres : la réponse les liste.
     */
    @GetMapping("/telephones/{telephone}/comptes")
    public ResponseEntity<io.digiservices.agriculteurservice.dto.ComptesParTelephoneDto> getComptesParTelephone(
            @PathVariable("telephone") String telephone) {
        String numero = io.digiservices.agriculteurservice.utils.TelephoneGuineen.normaliser(telephone);
        log.info("[AGRI] GET /agriculteurs/telephones/{}/comptes", numero);
        return ResponseEntity.ok(agriculteurService.getComptesParTelephone(numero));
    }

    @GetMapping("/credits/{creditId}")
    public ResponseEntity<CreditAgricoleDto> getCredit(@PathVariable("creditId") Long creditId) {
        log.info("[AGRI] GET /agriculteurs/credits/{}", creditId);
        return ResponseEntity.ok(agriculteurService.getCredit(creditId));
    }

    @GetMapping("/credits/{creditId}/repayment-schedule")
    public ResponseEntity<List<EcheanceDto>> getRepaymentSchedule(@PathVariable("creditId") Long creditId) {
        log.info("[AGRI] GET /agriculteurs/credits/{}/repayment-schedule", creditId);
        return ResponseEntity.ok(agriculteurService.getRepaymentSchedule(creditId));
    }

    @GetMapping("/cooperatives")
    public ResponseEntity<PageDto<CooperativeDto>> getCooperatives(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agriculteurs/cooperatives page={} size={}", page, size);
        return ResponseEntity.ok(agriculteurService.getCooperatives(page, size));
    }

    @GetMapping("/cooperatives/{groupId}")
    public ResponseEntity<CooperativeDto> getCooperative(@PathVariable("groupId") String groupId) {
        log.info("[AGRI] GET /agriculteurs/cooperatives/{}", groupId);
        return ResponseEntity.ok(agriculteurService.getCooperative(groupId));
    }

    @GetMapping("/cooperatives/{groupId}/members")
    public ResponseEntity<PageDto<MembreCooperativeDto>> getCooperativeMembers(
            @PathVariable("groupId") String groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agriculteurs/cooperatives/{}/members page={} size={}", groupId, page, size);
        return ResponseEntity.ok(agriculteurService.getCooperativeMembers(groupId, page, size));
    }

    // ============================================================
    //  Referentiel organisationnel (perimetre / cloisonnement des agents)
    //  Hierarchie : delegation ("region") -> agence -> point de vente.
    //  Les id exposes correspondent a ceux portes par le SSO des agents.
    // ============================================================

    @GetMapping("/structure/delegations")
    public ResponseEntity<List<DelegationDto>> getDelegations() {
        log.info("[AGRI] GET /agriculteurs/structure/delegations");
        return ResponseEntity.ok(agriculteurService.getDelegations());
    }

    @GetMapping("/structure/delegations/{delegationId}/agences")
    public ResponseEntity<List<AgenceCrgDto>> getAgencesByDelegation(
            @PathVariable("delegationId") Long delegationId) {
        log.info("[AGRI] GET /agriculteurs/structure/delegations/{}/agences", delegationId);
        return ResponseEntity.ok(agriculteurService.getAgencesByDelegation(delegationId));
    }

    @GetMapping("/structure/agences/{agenceId}/points-de-vente")
    public ResponseEntity<List<PointDeVenteDto>> getPointsDeVenteByAgence(
            @PathVariable("agenceId") Long agenceId) {
        log.info("[AGRI] GET /agriculteurs/structure/agences/{}/points-de-vente", agenceId);
        return ResponseEntity.ok(agriculteurService.getPointsDeVenteByAgence(agenceId));
    }

    /**
     * Perimetre de TOUTE la structure : meme reponse que /agents/{agentId}/perimetre pour un agent
     * de niveau NATIONAL, sans parametre ni agent (agentId null, role STRUCTURE, active true).
     * Demande KUMY (2026-09-14) : administration / maintenance d'AgriScore, un administrateur
     * peut se placer sur n'importe quel point de service pour analyser un incident.
     */
    @GetMapping("/structure/perimetre")
    public ResponseEntity<AgentPerimetreDto> getStructurePerimetre() {
        log.info("[AGRI] GET /agriculteurs/structure/perimetre");
        return ResponseEntity.ok(agriculteurService.getStructurePerimetre());
    }

    @GetMapping("/structure/delegations/{delegationId}/points-de-vente")
    public ResponseEntity<List<PointDeVenteDto>> getPointsDeVenteByDelegation(
            @PathVariable("delegationId") Long delegationId) {
        log.info("[AGRI] GET /agriculteurs/structure/delegations/{}/points-de-vente", delegationId);
        return ResponseEntity.ok(agriculteurService.getPointsDeVenteByDelegation(delegationId));
    }

    // ============================================================
    //  Perimetre d'un agent (cloisonnement "qui voit quoi" cote AgriScore).
    //  agentId = claim agent_id du SSO (format CR-<n>). Meme objet que le claim
    //  "perimetre" de /userinfo ; les points de service portent le "code" = codeAgence
    //  des agriculteurs et credits de cette API.
    // ============================================================

    @GetMapping("/agents/{agentId}/perimetre")
    public ResponseEntity<AgentPerimetreDto> getAgentPerimetre(@PathVariable("agentId") String agentId) {
        if (!AGENT_ID.matcher(agentId).matches()) {
            throw new BadRequestException("Le parametre 'agentId' doit etre au format CR-<n>");
        }
        log.info("[AGRI] GET /agriculteurs/agents/{}/perimetre", agentId);
        return ResponseEntity.ok(agriculteurService.getAgentPerimetre(agentId));
    }

    /** page &gt;= 0 et 1 &le; size &le; 100, sinon HTTP 400. */
    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Le parametre 'page' doit etre >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new BadRequestException("Le parametre 'size' doit etre compris entre 1 et " + MAX_PAGE_SIZE);
        }
    }
}
