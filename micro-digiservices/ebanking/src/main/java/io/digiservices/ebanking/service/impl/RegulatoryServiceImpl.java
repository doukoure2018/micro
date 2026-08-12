package io.digiservices.ebanking.service.impl;

import io.digiservices.clients.agri.PageDto;
import io.digiservices.clients.reg.RegEncoursDto;
import io.digiservices.clients.reg.RegEngagementDto;
import io.digiservices.clients.reg.RegPersonneMoraleDto;
import io.digiservices.clients.reg.RegPersonnePhysiqueDto;
import io.digiservices.ebanking.exception.BlogAPIException;
import io.digiservices.ebanking.repository.RegulatoryRepository;
import io.digiservices.ebanking.service.RegulatoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegulatoryServiceImpl implements RegulatoryService {

    private final RegulatoryRepository repository;

    @Override
    public PageDto<RegPersonnePhysiqueDto> getPersonnesPhysiques(int page, int size) {
        long total = repository.countPersonnesPhysiques();
        List<RegPersonnePhysiqueDto> content = repository.findPersonnesPhysiques(page * size, size);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public RegPersonnePhysiqueDto getPersonnePhysiqueById(String codCliente) {
        RegPersonnePhysiqueDto dto = repository.findPersonnePhysiqueById(codCliente);
        if (dto == null) {
            throw new BlogAPIException(HttpStatus.NOT_FOUND, "Personne physique introuvable : " + codCliente);
        }
        return dto;
    }

    @Override
    public List<RegPersonnePhysiqueDto> getPersonnesPhysiquesLot(String afterId, int limit) {
        return repository.findPersonnesPhysiquesLot(afterId, limit);
    }

    @Override
    public List<RegPersonnePhysiqueDto> getPersonnesPhysiquesByIds(List<String> ids) {
        return repository.findPersonnesPhysiquesByIds(ids);
    }

    @Override
    public List<RegPersonneMoraleDto> getPersonnesMoralesLot(String afterId, int limit) {
        return repository.findPersonnesMoralesLot(afterId, limit);
    }

    @Override
    public List<RegPersonneMoraleDto> getPersonnesMoralesByIds(List<String> ids) {
        return repository.findPersonnesMoralesByIds(ids);
    }

    @Override
    public List<RegEngagementDto> getEngagementsLot(Long afterId, int limit) {
        return repository.findEngagementsLot(afterId, limit);
    }

    @Override
    public PageDto<RegPersonneMoraleDto> getPersonnesMorales(int page, int size) {
        long total = repository.countPersonnesMorales();
        List<RegPersonneMoraleDto> content = repository.findPersonnesMorales(page * size, size);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public RegPersonneMoraleDto getPersonneMoraleById(String codCliente) {
        RegPersonneMoraleDto dto = repository.findPersonneMoraleById(codCliente);
        if (dto == null) {
            throw new BlogAPIException(HttpStatus.NOT_FOUND, "Personne morale introuvable : " + codCliente);
        }
        return dto;
    }

    @Override
    public PageDto<RegEngagementDto> getEngagements(int page, int size) {
        long total = repository.countEngagements();
        List<RegEngagementDto> content = repository.findEngagements(page * size, size);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public RegEngagementDto getEngagementById(Long numCredito) {
        RegEngagementDto dto = repository.findEngagementById(numCredito);
        if (dto == null) {
            throw new BlogAPIException(HttpStatus.NOT_FOUND, "Engagement introuvable : " + numCredito);
        }
        return dto;
    }

    @Override
    public PageDto<RegEncoursDto> getEncours(String periode, int page, int size) {
        LocalDate periodEnd = parsePeriodEnd(periode);
        long total = repository.countEncours();
        List<RegEncoursDto> content = repository.findEncours(periodEnd, page * size, size);
        return PageDto.of(content, page, size, total);
    }

    /** "AAAA-MM" -> premier jour du mois suivant (borne exclusive des echeances de la periode). */
    private LocalDate parsePeriodEnd(String periode) {
        try {
            String[] parts = periode.split("-");
            int year = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            return LocalDate.of(year, month, 1).plusMonths(1);
        } catch (RuntimeException e) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST,
                    "Parametre 'periode' invalide (format attendu AAAA-MM) : " + periode);
        }
    }
}
