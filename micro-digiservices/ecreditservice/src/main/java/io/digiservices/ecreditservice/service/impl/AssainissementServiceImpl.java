package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.AssainissementDtos.PointEvolutionDto;
import io.digiservices.ecreditservice.dto.AssainissementDtos.PointServiceRetardDto;
import io.digiservices.ecreditservice.dto.AssainissementDtos.StockDelegationDto;
import io.digiservices.ecreditservice.dto.AssainissementDtos.TableauAssainissementDto;
import io.digiservices.ecreditservice.repository.AssainissementRepository;
import io.digiservices.ecreditservice.service.AssainissementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Assemble en une seule reponse ce que l'ecran affiche : la courbe, le tableau des delegations
 * periode par periode, les points de service en retard et les totaux. Une seule periode et un
 * seul filtre valent pour tout l'ecran.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AssainissementServiceImpl implements AssainissementService {

    private static final int MAX_PERIODES = 104;
    private static final int TOP_POINTS_SERVICE = 10;

    private final AssainissementRepository repository;

    @Override
    public TableauAssainissementDto tableau(String granularite, int nbPeriodes, Long delegationId, int seuilJours,
                                           java.time.LocalDate du, java.time.LocalDate au) {
        String granu = "day".equalsIgnoreCase(granularite) ? "day" : "week";
        int fenetre = Math.max(1, Math.min(nbPeriodes, MAX_PERIODES));
        int seuil = Math.max(1, seuilJours);

        // Bornes explicites : elles priment sur la fenetre glissante. Une seule borne suffit,
        // l'autre est completee (debut de l'historique ou aujourd'hui).
        java.time.LocalDate debut = du;
        java.time.LocalDate fin = au;
        if (debut != null && fin != null && fin.isBefore(debut)) {
            java.time.LocalDate tmp = debut;
            debut = fin;
            fin = tmp;
        }
        if (fin == null && debut != null) {
            fin = java.time.LocalDate.now();
        }

        List<PointEvolutionDto> evolution = repository.evolution(granu, fenetre, delegationId, debut, fin);
        List<String> periodes = evolution.stream().map(PointEvolutionDto::getPeriode).toList();

        List<StockDelegationDto> delegations = repository.stockParDelegation(seuil);
        remplirTraiteesParPeriode(delegations, periodes,
                repository.traiteesParDelegationEtPeriode(granu, fenetre, debut, fin));

        List<PointServiceRetardDto> retards = repository.pointsServiceEnRetard(delegationId, TOP_POINTS_SERVICE);

        long resteATraiter = delegations.stream().mapToLong(StockDelegationDto::getEnAttente).sum();
        long plusAncienne = delegations.stream().mapToLong(StockDelegationDto::getAgeMaxJours).max().orElse(0);
        long traiteesDerniere = evolution.isEmpty() ? 0 : evolution.get(evolution.size() - 1).getTraitees();
        long totalValide = evolution.stream().mapToLong(PointEvolutionDto::getValide).sum();
        long totalRejete = evolution.stream().mapToLong(PointEvolutionDto::getRejete).sum();
        double tauxRejet = totalValide + totalRejete == 0 ? 0
                : Math.round(1000.0 * totalRejete / (totalValide + totalRejete)) / 10.0;

        log.info("[ASSAINISSEMENT] {} periodes ({}) du {} au {}, delegation={} : {} a traiter, plus ancienne {} j",
                periodes.size(), granu, debut, fin, delegationId, resteATraiter, plusAncienne);

        return TableauAssainissementDto.builder()
                .granularite(granu)
                .nbPeriodes(fenetre)
                .delegationId(delegationId)
                .seuilJours(seuil)
                .du(debut)
                .au(fin)
                .periodes(periodes)
                .evolution(evolution)
                .delegations(delegations)
                .pointsServiceEnRetard(retards)
                .traiteesDernierePeriode(traiteesDerniere)
                .resteATraiter(resteATraiter)
                .tauxRejetGlobal(tauxRejet)
                .plusAncienneJours(plusAncienne)
                .build();
    }

    /** Pivote les lignes (delegation, periode) en une serie alignee sur les periodes de la courbe. */
    private void remplirTraiteesParPeriode(List<StockDelegationDto> delegations, List<String> periodes,
                                           List<Map<String, Object>> lignes) {
        Map<String, Map<String, Long>> parDelegation = new LinkedHashMap<>();
        for (Map<String, Object> l : lignes) {
            String deleg = String.valueOf(l.get("delegation"));
            String periode = String.valueOf(l.get("periode"));
            long traitees = l.get("traitees") instanceof Number n ? n.longValue() : 0;
            parDelegation.computeIfAbsent(deleg, k -> new LinkedHashMap<>()).merge(periode, traitees, Long::sum);
        }
        for (StockDelegationDto d : delegations) {
            Map<String, Long> serie = parDelegation.getOrDefault(d.getDelegation(), Map.of());
            List<Long> valeurs = new ArrayList<>(periodes.size());
            for (String p : periodes) {
                valeurs.add(serie.getOrDefault(p, 0L));
            }
            d.setTraiteesParPeriode(valeurs);
        }
    }
}
