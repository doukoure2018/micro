package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.exception.ResourceNotFoundException;
import io.digiservices.clients.agri.AgriAgencyDto;
import io.digiservices.clients.agri.AgriCreditDto;
import io.digiservices.clients.agri.AgriInstallmentDto;
import io.digiservices.clients.agri.CooperativeDto;
import io.digiservices.clients.agri.CooperativeMemberDto;
import io.digiservices.clients.agri.FarmerDto;
import io.digiservices.clients.agri.PageDto;
import io.digiservices.ebanking.paylaod.PlanPagosDto;
import io.digiservices.ebanking.repository.AgriculteurRepository;
import io.digiservices.ebanking.service.AgriculteurService;
import io.digiservices.ebanking.service.PlanPagosService;
import io.digiservices.ebanking.utils.SafTranslator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

/**
 * Orchestration des acces SAF agricoles : appelle le repository (tertiary),
 * enrichit les DTO via {@link SafTranslator}, et 404 quand une ressource demandee
 * par identifiant n'existe pas dans le perimetre agricole.
 *
 * <p>La validation de pagination (page &gt;= 0, 1 &le; size &le; 100) est faite en
 * amont par le controller. L'indisponibilite tertiary est geree dans le repository
 * (-&gt; TertiaryUnavailableException / 503), on la laisse remonter ici.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgriculteurServiceImpl implements AgriculteurService {

    /** Au-dela de ce retard (jours) sur une echeance impayee, on la marque "missed" plutot que "late". */
    private static final int MISSED_THRESHOLD_DAYS = 90;

    private final AgriculteurRepository agriculteurRepository;
    private final SafTranslator safTranslator;
    private final PlanPagosService planPagosService;

    @Override
    public List<AgriAgencyDto> getAllAgencies() {
        return agriculteurRepository.findAllAgencies();
    }

    @Override
    public PageDto<AgriCreditDto> getAgencyPortfolio(String codAgencia, int page, int size) {
        long total = agriculteurRepository.countAgencyPortfolio(codAgencia);
        List<AgriCreditDto> content = total == 0
                ? List.of()
                : agriculteurRepository.findAgencyPortfolio(codAgencia, page * size, size);
        content.forEach(this::enrichCredit);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public PageDto<FarmerDto> getFarmers(int page, int size) {
        long total = agriculteurRepository.countFarmers();
        List<FarmerDto> content = total == 0
                ? List.of()
                : agriculteurRepository.findFarmers(page * size, size);
        content.forEach(this::enrichFarmer);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public FarmerDto getFarmerById(String codCliente) {
        FarmerDto farmer = agriculteurRepository.findFarmerById(codCliente);
        if (farmer == null) {
            throw new ResourceNotFoundException("Agriculteur", "codCliente", codCliente);
        }
        enrichFarmer(farmer);
        return farmer;
    }

    @Override
    public List<AgriCreditDto> getAgriculturalCreditsByClient(String codCliente) {
        List<AgriCreditDto> credits = agriculteurRepository.findAgriculturalCreditsByClient(codCliente);
        credits.forEach(this::enrichCredit);
        return credits;
    }

    @Override
    public AgriCreditDto getCreditDetail(Long numCredito) {
        AgriCreditDto credit = agriculteurRepository.findCreditDetail(numCredito);
        if (credit == null) {
            throw new ResourceNotFoundException("Credit agricole", "numCredito", String.valueOf(numCredito));
        }
        enrichCredit(credit);
        return credit;
    }

    @Override
    public List<AgriInstallmentDto> getRepaymentSchedule(Long numCredito) {
        LocalDate today = LocalDate.now();
        return planPagosService.getEcheancesParCredit(numCredito).stream()
                .map(p -> toInstallment(p, today))
                .sorted(Comparator.comparing(AgriInstallmentDto::getDueDate,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    /**
     * Derive une echeance publique a partir de la ligne SAF PR_PLAN_PAGOS :
     * statut (pending/paid/late/missed) et jours de retard calcules depuis les dates.
     */
    private AgriInstallmentDto toInstallment(PlanPagosDto p, LocalDate today) {
        LocalDate dueDate = p.getFecCuota() == null ? null : p.getFecCuota().toLocalDate();
        // Date de solde effectif de l'echeance : FEC_CANCELACION, a defaut FEC_REAL_CUOTA.
        LocalDateTime paid = p.getFEC_CANCELACION() != null ? p.getFEC_CANCELACION() : p.getFEC_REAL_CUOTA();
        LocalDate paidDate = paid == null ? null : paid.toLocalDate();
        BigDecimal amount = p.getMON_CUOTA();

        String status;
        long daysLate;
        BigDecimal paidAmount;
        if (paidDate != null) {
            status = "paid";
            daysLate = (dueDate == null) ? 0 : Math.max(0, ChronoUnit.DAYS.between(dueDate, paidDate));
            paidAmount = amount; // echeance soldee
        } else if (dueDate == null || !dueDate.isBefore(today)) {
            status = "pending";
            daysLate = 0;
            paidAmount = null;
        } else {
            daysLate = ChronoUnit.DAYS.between(dueDate, today);
            status = daysLate > MISSED_THRESHOLD_DAYS ? "missed" : "late";
            paidAmount = null;
        }
        return new AgriInstallmentDto(dueDate, amount, status, paidDate, paidAmount, daysLate);
    }

    @Override
    public PageDto<CooperativeDto> getCooperatives(int page, int size) {
        long total = agriculteurRepository.countCooperatives();
        List<CooperativeDto> content = total == 0
                ? List.of()
                : agriculteurRepository.findCooperatives(page * size, size);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public CooperativeDto getCooperativeById(String codGrupo) {
        CooperativeDto coop = agriculteurRepository.findCooperativeById(codGrupo);
        if (coop == null) {
            throw new ResourceNotFoundException("Cooperative", "codGrupo", codGrupo);
        }
        return coop;
    }

    @Override
    public PageDto<CooperativeMemberDto> getCooperativeMembers(String codGrupo, int page, int size) {
        long total = agriculteurRepository.countCooperativeMembers(codGrupo);
        List<CooperativeMemberDto> content = total == 0
                ? List.of()
                : agriculteurRepository.findCooperativeMembers(codGrupo, page * size, size);
        content.forEach(this::enrichMember);
        return PageDto.of(content, page, size, total);
    }

    // ============================================================
    //  Enrichissement (traduction des codes SAF)
    // ============================================================

    private void enrichFarmer(FarmerDto farmer) {
        farmer.setPersonType(safTranslator.translatePersonType(farmer.getIndPersona()));
    }

    private void enrichCredit(AgriCreditDto credit) {
        credit.setPersonType(safTranslator.translatePersonType(credit.getIndPersona()));
        credit.setCreditStatus(safTranslator.translateCreditStatus(credit.getIndEstado()));
    }

    private void enrichMember(CooperativeMemberDto member) {
        member.setPersonType(safTranslator.translatePersonType(member.getIndPersona()));
        member.setGroupRole(safTranslator.translateGroupRole(member.getIndGrado()));
    }

    // ==================== Comptes du membre ====================

    /**
     * Produits retenus, parametrables : le compte de credit porte le montant debourse,
     * le compte de remboursement recoit les versements et supporte le prelevement des
     * echeances (ecran SAF « Ouverture d'un credit », onglet Debourse).
     */
    @org.springframework.beans.factory.annotation.Value("${agri.comptes.produit-credit:CC008}")
    private String produitCredit;

    @org.springframework.beans.factory.annotation.Value("${agri.comptes.produit-remboursement:CC014}")
    private String produitRemboursement;

    /** Echeances restant a payer servies avec les comptes (demande DSIG du 2026-09-29). */
    @org.springframework.beans.factory.annotation.Value("${agri.comptes.nb-echeances:5}")
    private int nbEcheancesParCredit;

    @Override
    public io.digiservices.clients.agri.ComptesMembreDto getComptesMembre(String codCliente) {
        List<String> produits = List.of(produitCredit, produitRemboursement);
        List<java.util.Map<String, Object>> lignes = agriculteurRepository.findComptesMembre(codCliente, produits);

        List<io.digiservices.clients.agri.CompteMembreDto> comptes = new java.util.ArrayList<>();
        String nomMembre = null;
        for (java.util.Map<String, Object> r : lignes) {
            if (nomMembre == null) nomMembre = txt(r.get("NOM_CLIENTE"));
            String numero = txt(r.get("NUM_CUENTA"));
            String produit = txt(r.get("COD_PRODUCTO"));
            comptes.add(io.digiservices.clients.agri.CompteMembreDto.builder()
                    .numeroCompte(numero)
                    .type(typeDeProduit(produit))
                    .produit(produit)
                    .libelleProduit(premierNonVide(txt(r.get("NOM_PRODUCTO")), txt(r.get("DES_PRODUCTO"))))
                    .codeAgence(txt(r.get("COD_AGENCIA")))
                    .libelleAgence(txt(r.get("DES_AGENCIA")))
                    .devise(txt(r.get("COD_MONEDA")))
                    .statut(txt(r.get("IND_ESTADO")))
                    .libelleStatut(libelleStatutCompte(txt(r.get("IND_ESTADO"))))
                    .dateOuverture(date(r.get("FEC_APERTURA")))
                    .dernierMouvement(date(r.get("FEC_ULT_MOVIMIENTO")))
                    .soldeDisponible(montant(r.get("SAL_DISPONIBLE")))
                    .soldeReserve(montant(r.get("SAL_RESERVA")))
                    .soldeBloque(montant(r.get("SAL_CONGELADO")))
                    .incoherenceNumero(numeroIncoherent(numero, produit))
                    .build());
        }
        List<io.digiservices.clients.agri.CreditEnCoursDto> credits = creditsEnCours(codCliente, comptes);
        log.info("[AGRI] membre {} : {} compte(s), {} credit(s) en cours", codCliente, comptes.size(), credits.size());
        return io.digiservices.clients.agri.ComptesMembreDto.builder()
                .codeMembre(codCliente)
                .nomMembre(nomMembre)
                .comptes(comptes)
                .creditsEnCours(credits)
                .message(comptes.isEmpty() && credits.isEmpty() ? "Compte non disponible" : null)
                .build();
    }

    /**
     * Credits en cours de remboursement et, pour chacun, ses premieres echeances restant a payer.
     * Deux requetes seulement, quel que soit le nombre de credits : la seconde ramene les
     * echeances de tous les credits d'un coup, bornees par credit.
     */
    private List<io.digiservices.clients.agri.CreditEnCoursDto> creditsEnCours(
            String codCliente, List<io.digiservices.clients.agri.CompteMembreDto> comptes) {
        List<java.util.Map<String, Object>> lignes = agriculteurRepository.findCreditsEnCours(codCliente);
        if (lignes.isEmpty()) {
            return List.of();
        }
        java.util.Map<Long, List<io.digiservices.clients.agri.EcheanceCourteDto>> parCredit = new java.util.HashMap<>();
        LocalDate aujourdhui = LocalDate.now();
        for (java.util.Map<String, Object> r : agriculteurRepository.findProchainesEcheances(codCliente, nbEcheancesParCredit)) {
            Long numCredit = nombre(r.get("NUM_CREDITO")) == null ? null : nombre(r.get("NUM_CREDITO")).longValue();
            if (numCredit == null) continue;
            LocalDate echeance = date(r.get("FEC_CUOTA"));
            boolean impayee = echeance != null && echeance.isBefore(aujourdhui);
            BigDecimal montant = montant(r.get("MON_CUOTA"));
            BigDecimal interets = montant(r.get("MON_INT"));
            parCredit.computeIfAbsent(numCredit, k -> new java.util.ArrayList<>())
                    .add(io.digiservices.clients.agri.EcheanceCourteDto.builder()
                            .numeroEcheance(nombre(r.get("NUM_CUOTA")) == null ? null : nombre(r.get("NUM_CUOTA")).longValue())
                            .dateEcheance(echeance)
                            .montant(montant)
                            .capital(montant == null || interets == null ? null : montant.subtract(interets))
                            .interets(interets)
                            .resteAPayer(montant(r.get("RESTE")))
                            .etat(impayee ? "IMPAYEE" : "A_ECHOIR")
                            .joursRetard(impayee ? ChronoUnit.DAYS.between(echeance, aujourdhui) : 0)
                            .build());
        }

        // Compte de remboursement du membre, rattache a chaque credit pour information
        String compteRemboursement = comptes.stream()
                .filter(c -> "REMBOURSEMENT".equals(c.getType()))
                .map(io.digiservices.clients.agri.CompteMembreDto::getNumeroCompte)
                .findFirst().orElse(null);

        List<io.digiservices.clients.agri.CreditEnCoursDto> credits = new java.util.ArrayList<>();
        for (java.util.Map<String, Object> r : lignes) {
            Number num = nombre(r.get("NUM_CREDITO"));
            Long numCredit = num == null ? null : num.longValue();
            String etat = txt(r.get("IND_ESTADO"));
            credits.add(io.digiservices.clients.agri.CreditEnCoursDto.builder()
                    .numeroCredit(numCredit)
                    .codeAgence(txt(r.get("COD_AGENCIA")))
                    .typeCredit(txt(r.get("TIP_CREDITO")))
                    .libelleTypeCredit(txt(r.get("DES_TIP_CREDITO")))
                    .montantAccorde(montant(r.get("MON_CREDITO")))
                    .capitalRestantDu(montant(r.get("MON_SALDO")))
                    .montantEcheance(montant(r.get("MON_CUOTA")))
                    .nombreEcheances(nombre(r.get("CANT_CUOTAS")) == null ? null : nombre(r.get("CANT_CUOTAS")).longValue())
                    .dateOuverture(date(r.get("FEC_APERTURA")))
                    .dateEcheanceFinale(date(r.get("FEC_VENCIMIENTO")))
                    .statut(etat)
                    .libelleStatut("J".equals(etat) ? "Contentieux" : "En cours de remboursement")
                    .compteRemboursement(compteRemboursement)
                    .prochainesEcheances(parCredit.getOrDefault(numCredit, List.of()))
                    .nbEcheancesRestantes(nombre(r.get("NB_RESTANTES")) == null ? 0 : nombre(r.get("NB_RESTANTES")).longValue())
                    .resteTotalAPayer(montant(r.get("RESTE_TOTAL")))
                    .build());
        }
        return credits;
    }

    private static Number nombre(Object v) {
        return v instanceof Number n ? n : null;
    }

    private String typeDeProduit(String produit) {
        if (produit == null) return "AUTRE";
        if (produit.equalsIgnoreCase(produitCredit)) return "CREDIT";
        if (produit.equalsIgnoreCase(produitRemboursement)) return "REMBOURSEMENT";
        return "AUTRE";
    }

    /**
     * Controle de coherence : le numero se lit [3 agence][3 produit][8 sequence], et le
     * triplet produit doit correspondre au code produit stocke. Une discordance est signalee,
     * jamais masquee.
     */
    private static Boolean numeroIncoherent(String numero, String produit) {
        if (numero == null || produit == null || numero.length() < 6 || produit.length() < 3) return null;
        return !numero.substring(3, 6).equals(produit.substring(produit.length() - 3));
    }

    private static String libelleStatutCompte(String indEstado) {
        if (indEstado == null) return null;
        return switch (indEstado.trim().toUpperCase()) {
            case "A" -> "Actif";
            case "I" -> "Inactif";
            case "B" -> "Bloque";
            case "C" -> "Cloture";
            default -> indEstado;
        };
    }

    private static String premierNonVide(String a, String b) {
        if (a != null && !a.isBlank()) return a;
        return b == null || b.isBlank() ? null : b;
    }

    private static String txt(Object v) {
        if (v == null) return null;
        String s = v.toString().trim();
        return s.isEmpty() ? null : s;
    }

    private static BigDecimal montant(Object v) {
        return v instanceof java.math.BigDecimal b ? b
                : v instanceof Number n ? BigDecimal.valueOf(n.doubleValue()) : null;
    }

    private static LocalDate date(Object v) {
        if (v instanceof java.sql.Timestamp t) return t.toLocalDateTime().toLocalDate();
        if (v instanceof java.sql.Date d) return d.toLocalDate();
        if (v instanceof LocalDateTime dt) return dt.toLocalDate();
        if (v instanceof LocalDate d) return d;
        return null;
    }

    // ==================== Identite et contacts ====================

    @Override
    public io.digiservices.clients.agri.IdentiteMembreDto getIdentiteMembre(String codCliente) {
        List<java.util.Map<String, Object>> lignes = agriculteurRepository.findIdentiteMembre(codCliente);
        if (lignes.isEmpty()) {
            log.info("[AGRI] identite : membre {} introuvable", codCliente);
            return io.digiservices.clients.agri.IdentiteMembreDto.builder()
                    .codeMembre(codCliente)
                    .telephones(List.of())
                    .adresses(List.of())
                    .sansTelephone(true)
                    .message("Membre introuvable")
                    .build();
        }
        java.util.Map<String, Object> r = lignes.get(0);
        String typePersonne = txt(r.get("IND_PERSONA"));
        String principal = tel(r.get("TEL_PRINCIPAL"));
        String secondaire = tel(r.get("TEL_SECUNDARIO"));
        String autre = tel(r.get("TEL_OTRO"));
        List<String> numeros = java.util.stream.Stream.of(principal, secondaire, autre)
                .filter(java.util.Objects::nonNull).toList();

        List<io.digiservices.clients.agri.AdresseMembreDto> adresses = new java.util.ArrayList<>();
        for (java.util.Map<String, Object> a : agriculteurRepository.findAdressesMembre(codCliente)) {
            adresses.add(io.digiservices.clients.agri.AdresseMembreDto.builder()
                    .type(txt(a.get("TIP_DIRECCION")))
                    .detail(txt(a.get("DET_DIRECCION")))
                    .province(txt(a.get("DES_PROVINCIA")))
                    .prefecture(txt(a.get("DES_CANTON")))
                    .district(txt(a.get("DES_DISTRITO")))
                    .build());
        }

        log.info("[AGRI] identite du membre {} : {} numero(s), {} adresse(s)",
                codCliente, numeros.size(), adresses.size());
        return io.digiservices.clients.agri.IdentiteMembreDto.builder()
                .codeMembre(txt(r.get("COD_CLIENTE")))
                .nomComplet(txt(r.get("NOM_CLIENTE")))
                .nom(txt(r.get("PRIMER_APELLIDO")))
                .prenom(txt(r.get("PRIMER_NOMBRE")))
                .typePersonne(typePersonne)
                .libelleTypePersonne("J".equalsIgnoreCase(typePersonne) ? "Personne morale" : "Personne physique")
                .raisonSociale(txt(r.get("RAZON_SOCIAL")))
                .sexe(txt(r.get("IND_SEXO")))
                .nationalite(txt(r.get("NACIONALIDAD")))
                .profession(txt(r.get("DES_PROFESION")))
                .codeAgence(txt(r.get("COD_AGENCIA")))
                .libelleAgence(txt(r.get("DES_AGENCIA")))
                .dateAdhesion(date(r.get("FEC_INGRESO")))
                .telephonePrincipal(principal)
                .telephoneSecondaire(secondaire)
                .telephoneAutre(autre)
                .telephones(numeros)
                .sansTelephone(numeros.isEmpty())
                .adresses(adresses)
                .build();
    }

    /** Numero SAF : espaces retires, chaine vide ramenee a null. */
    private static String tel(Object v) {
        if (v == null) return null;
        String t = v.toString().replace("\u00a0", " ").trim();
        return t.isEmpty() ? null : t;
    }
}
