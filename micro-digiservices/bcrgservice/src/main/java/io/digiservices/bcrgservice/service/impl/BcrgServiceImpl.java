package io.digiservices.bcrgservice.service.impl;

import io.digiservices.bcrgservice.dto.EncoursDto;
import io.digiservices.bcrgservice.dto.EngagementDto;
import io.digiservices.bcrgservice.dto.PageDto;
import io.digiservices.bcrgservice.dto.PersonneMoraleDto;
import io.digiservices.bcrgservice.dto.PersonnePhysiqueDto;
import io.digiservices.bcrgservice.repository.TraitementRepository;
import io.digiservices.bcrgservice.service.BcrgService;
import io.digiservices.bcrgservice.utils.BcrgMapper;
import io.digiservices.clients.EbankingRegClient;
import io.digiservices.clients.reg.RegEngagementDto;
import io.digiservices.clients.reg.RegPersonneMoraleDto;
import io.digiservices.clients.reg.RegPersonnePhysiqueDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.function.Function;

/**
 * Implementation : delegue a {@link EbankingRegClient} (Feign) et mappe les
 * resultats au format BCRG via {@link BcrgMapper}.
 *
 * <p>Extraction incrementale (statut=restantes, defaut) : les references deja
 * notifiees traitees par la BCRG ({@link TraitementRepository}) sont exclues.
 * Le parcours se fait par lots keyset ordonnes cote SAF ; usage recommande a la
 * BCRG : requeter page=0, traiter, notifier, recommencer jusqu'a epuisement.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BcrgServiceImpl implements BcrgService {

    public static final String MODULE_PP = "PERSONNE_PHYSIQUE";
    public static final String MODULE_PM = "PERSONNE_MORALE";
    public static final String MODULE_ENG = "ENGAGEMENT";

    /** Taille des lots keyset demandes a ebanking pendant le parcours filtre. */
    private static final int TAILLE_LOT = 500;

    private final EbankingRegClient ebankingRegClient;
    private final BcrgMapper mapper;
    private final TraitementRepository traitementRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    // ==================== Personnes physiques ====================

    @Override
    public PageDto<PersonnePhysiqueDto> getPersonnesPhysiques(int page, int size, boolean toutes) {
        Set<String> traitees = toutes ? Set.of() : traitementRepository.findReferences(MODULE_PP);
        if (traitees.isEmpty()) {
            return mapper.toPage(ebankingRegClient.getPersonnesPhysiques(page, size), mapper::toPersonnePhysique);
        }
        long totalSaf = ebankingRegClient.getPersonnesPhysiques(0, 1).getTotalElements();
        Selection selection = selectionner(page, size, traitees,
                cursor -> ebankingRegClient.getPersonnesPhysiquesLot(cursor, TAILLE_LOT),
                RegPersonnePhysiqueDto::getCodCliente);
        List<PersonnePhysiqueDto> content = selection.ids().isEmpty()
                ? List.of()
                : ebankingRegClient.getPersonnesPhysiquesByIds(selection.ids()).stream()
                        .map(mapper::toPersonnePhysique).toList();
        return pageFiltree(content, page, size, totalSaf, traitees.size(), selection.hasNext());
    }

    @Override
    public PersonnePhysiqueDto getPersonnePhysique(String idClient) {
        return mapper.toPersonnePhysique(ebankingRegClient.getPersonnePhysiqueById(idClient));
    }

    // ==================== PP V2 : par liste d'ids + personnes modifiées ====================

    /** Taille des lots d'identifiants passés à ebanking (limite du endpoint par-ids). */
    private static final int TAILLE_LOT_IDS = 200;

    @Override
    public List<PersonnePhysiqueDto> getPersonnesPhysiquesParIds(List<String> ids) {
        List<PersonnePhysiqueDto> resultat = new ArrayList<>();
        for (int i = 0; i < ids.size(); i += TAILLE_LOT_IDS) {
            List<String> lot = ids.subList(i, Math.min(i + TAILLE_LOT_IDS, ids.size()));
            ebankingRegClient.getPersonnesPhysiquesByIds(lot)
                    .forEach(s -> resultat.add(mapper.toPersonnePhysique(s)));
        }
        return resultat;
    }

    /**
     * Personnes modifiées depuis leur déclaration : compare l'empreinte SHA-256 actuelle
     * (contenu SAF mappé au contrat BCRG) à celle stockée lors de la notification
     * POST /bcrg/traitements. SAF n'ayant aucune date de modification, l'empreinte est
     * le seul détecteur fiable. Parcours complet des références notifiées : extraction
     * recommandée hors heures d'affluence.
     */
    @Override
    public PageDto<PersonnePhysiqueDto> getPersonnesPhysiquesModifiees(int page, int size) {
        java.util.Map<String, String> empreintes = traitementRepository.findReferencesAvecEmpreinte(MODULE_PP);
        List<PersonnePhysiqueDto> modifiees = new ArrayList<>();
        List<String> refs = new ArrayList<>(empreintes.keySet());
        for (int i = 0; i < refs.size(); i += TAILLE_LOT_IDS) {
            List<String> lot = refs.subList(i, Math.min(i + TAILLE_LOT_IDS, refs.size()));
            for (var brut : ebankingRegClient.getPersonnesPhysiquesByIds(lot)) {
                PersonnePhysiqueDto dto = mapper.toPersonnePhysique(brut);
                String actuelle = empreinte(dto);
                if (actuelle != null && !actuelle.equals(empreintes.get(dto.getIdInterneClt()))) {
                    modifiees.add(dto);
                }
            }
        }
        int from = Math.min(page * size, modifiees.size());
        int to = Math.min(from + size, modifiees.size());
        List<PersonnePhysiqueDto> content = modifiees.subList(from, to);
        int totalPages = (int) Math.ceil((double) modifiees.size() / size);
        return new PageDto<>(content, page, size, modifiees.size(), totalPages,
                to < modifiees.size(), page > 0);
    }

    @Override
    public java.util.Map<String, String> calculerEmpreintesPersonnesPhysiques(List<String> references) {
        java.util.Map<String, String> resultat = new java.util.HashMap<>();
        try {
            for (int i = 0; i < references.size(); i += TAILLE_LOT_IDS) {
                List<String> lot = references.subList(i, Math.min(i + TAILLE_LOT_IDS, references.size()));
                for (var brut : ebankingRegClient.getPersonnesPhysiquesByIds(lot)) {
                    PersonnePhysiqueDto dto = mapper.toPersonnePhysique(brut);
                    String empreinte = empreinte(dto);
                    if (dto.getIdInterneClt() != null && empreinte != null) {
                        resultat.put(dto.getIdInterneClt(), empreinte);
                    }
                }
            }
        } catch (Exception e) {
            // SAF indisponible : la notification aboutit sans empreintes (références alors
            // exclues de la détection des modifications, documenté)
            log.warn("Empreintes PP non calculées (SAF indisponible ?) : {}", e.getMessage());
        }
        return resultat;
    }

    /** SHA-256 (hex) du JSON canonique du contrat déclaré ; null si sérialisation impossible. */
    private String empreinte(PersonnePhysiqueDto dto) {
        try {
            byte[] json = objectMapper.writeValueAsBytes(dto);
            byte[] digest = java.security.MessageDigest.getInstance("SHA-256").digest(json);
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            log.warn("Empreinte non calculable pour {} : {}", dto.getIdInterneClt(), e.getMessage());
            return null;
        }
    }

    // ==================== Personnes morales ====================

    @Override
    public PageDto<PersonneMoraleDto> getPersonnesMorales(int page, int size, boolean toutes) {
        Set<String> traitees = toutes ? Set.of() : traitementRepository.findReferences(MODULE_PM);
        if (traitees.isEmpty()) {
            return mapper.toPage(ebankingRegClient.getPersonnesMorales(page, size), mapper::toPersonneMorale);
        }
        long totalSaf = ebankingRegClient.getPersonnesMorales(0, 1).getTotalElements();
        Selection selection = selectionner(page, size, traitees,
                cursor -> ebankingRegClient.getPersonnesMoralesLot(cursor, TAILLE_LOT),
                RegPersonneMoraleDto::getCodCliente);
        List<PersonneMoraleDto> content = selection.ids().isEmpty()
                ? List.of()
                : ebankingRegClient.getPersonnesMoralesByIds(selection.ids()).stream()
                        .map(mapper::toPersonneMorale).toList();
        return pageFiltree(content, page, size, totalSaf, traitees.size(), selection.hasNext());
    }

    @Override
    public PersonneMoraleDto getPersonneMorale(String idClient) {
        return mapper.toPersonneMorale(ebankingRegClient.getPersonneMoraleById(idClient));
    }

    // ==================== Engagements ====================

    @Override
    public PageDto<EngagementDto> getEngagements(int page, int size, boolean toutes) {
        Set<String> traitees = toutes ? Set.of() : traitementRepository.findReferences(MODULE_ENG);
        if (traitees.isEmpty()) {
            return mapper.toPage(ebankingRegClient.getEngagements(page, size), mapper::toEngagement);
        }
        long totalSaf = ebankingRegClient.getEngagements(0, 1).getTotalElements();
        // Les lots engagements sont complets (pas de sous-listes) : on retient les DTO directement
        int aSauter = page * size;
        List<RegEngagementDto> retenus = new ArrayList<>();
        Long cursor = 0L;
        boolean hasNext = false;
        boolean fluxEpuise = false;
        while (!fluxEpuise) {
            List<RegEngagementDto> lot = ebankingRegClient.getEngagementsLot(cursor, TAILLE_LOT);
            if (lot.isEmpty()) break;
            for (RegEngagementDto dto : lot) {
                String ref = dto.getNumCredito() != null ? String.valueOf(dto.getNumCredito()) : "";
                if (traitees.contains(ref)) continue;
                if (aSauter > 0) {
                    aSauter--;
                    continue;
                }
                if (retenus.size() < size) {
                    retenus.add(dto);
                } else {
                    hasNext = true;
                    fluxEpuise = true;
                    break;
                }
            }
            cursor = lot.get(lot.size() - 1).getNumCredito();
            if (lot.size() < TAILLE_LOT) break;
        }
        List<EngagementDto> content = retenus.stream().map(mapper::toEngagement).toList();
        return pageFiltree(content, page, size, totalSaf, traitees.size(), hasNext);
    }

    @Override
    public EngagementDto getEngagement(Long refEng) {
        return mapper.toEngagement(ebankingRegClient.getEngagementById(refEng));
    }

    // ==================== Encours (photo mensuelle, toujours complete) ====================

    @Override
    public PageDto<EncoursDto> getEncours(String periode, int page, int size) {
        java.time.LocalDate arrete = parseArrete(periode);
        return mapper.toPage(ebankingRegClient.getEncours(periode, page, size), s -> mapper.toEncours(s, arrete));
    }

    /** Dernier jour du mois d'arrêté (AAAA-MM) ; null si le format est invalide (ebanking répondra 400). */
    private static java.time.LocalDate parseArrete(String periode) {
        try {
            return java.time.YearMonth.parse(periode).atEndOfMonth();
        } catch (Exception e) {
            return null;
        }
    }

    // ==================== Parcours filtre ====================

    private record Selection(List<String> ids, boolean hasNext) {
    }

    /**
     * Parcourt les lots keyset dans l'ordre des identifiants, ignore les references
     * traitees, saute page*size retenues puis collecte size identifiants (+1 pour hasNext).
     */
    private <T> Selection selectionner(int page, int size, Set<String> traitees,
                                       Function<String, List<T>> lot, Function<T, String> id) {
        int aSauter = page * size;
        List<String> ids = new ArrayList<>();
        String cursor = "";
        boolean hasNext = false;
        boolean fluxEpuise = false;
        while (!fluxEpuise) {
            List<T> batch = lot.apply(cursor);
            if (batch.isEmpty()) break;
            for (T dto : batch) {
                String ref = id.apply(dto);
                if (traitees.contains(ref)) continue;
                if (aSauter > 0) {
                    aSauter--;
                    continue;
                }
                if (ids.size() < size) {
                    ids.add(ref);
                } else {
                    hasNext = true;
                    fluxEpuise = true;
                    break;
                }
            }
            cursor = id.apply(batch.get(batch.size() - 1));
            if (batch.size() < TAILLE_LOT) break;
        }
        return new Selection(ids, hasNext);
    }

    /**
     * Enveloppe de pagination du flux filtre. totalElements est une estimation
     * (total SAF - references notifiees) ; hasNext provient du parcours reel.
     */
    private <T> PageDto<T> pageFiltree(List<T> content, int page, int size,
                                       long totalSaf, int nbTraitees, boolean hasNext) {
        long totalEstime = Math.max(content.size(), totalSaf - nbTraitees);
        int totalPages = (int) Math.ceil((double) totalEstime / size);
        return new PageDto<>(content, page, size, totalEstime, totalPages, hasNext, page > 0);
    }
}
