package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.repository.SystemaRepository;
import io.digiservices.ebanking.service.SystemaService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemaServiceImpl implements SystemaService {

    private SystemaRepository systemaRepository;

    public SystemaServiceImpl(SystemaRepository systemaRepository) {
        this.systemaRepository = systemaRepository;
    }

    @Override
    public List<Object[]> getInfoSystema(String codSystema) {
        List<Object[]> object=systemaRepository.getInfoSystema(codSystema);
        return object.stream().toList();
    }
}
