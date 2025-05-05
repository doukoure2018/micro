package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Prestataire;
import io.digiservices.ebanking.paylaod.PrestataireDto;
import io.digiservices.ebanking.repository.PrestataireRepository;
import io.digiservices.ebanking.service.PrestataireService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrestataireServiceImpl implements PrestataireService {

    private PrestataireRepository prestataireRepository;
    private ModelMapper modelMapper;

    public PrestataireServiceImpl(PrestataireRepository prestataireRepository, ModelMapper modelMapper) {
        this.prestataireRepository = prestataireRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<PrestataireDto> getListPrestataire() {
        List<Prestataire> prestataires=prestataireRepository.findAll();
        return prestataires.stream().map((prestataire)->modelMapper.map(prestataire,PrestataireDto.class))
                .collect(Collectors.toList());
    }
}
