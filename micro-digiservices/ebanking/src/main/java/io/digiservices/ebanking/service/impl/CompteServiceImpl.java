package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Compte;
import io.digiservices.ebanking.paylaod.CompteDto;
import io.digiservices.ebanking.paylaod.ComptePKId;
import io.digiservices.ebanking.repository.CompteRepository;
import io.digiservices.ebanking.service.CompteService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompteServiceImpl implements CompteService {

    private CompteRepository compteRepository;
    private ModelMapper mapper;
    // private AgentClient agentClient;

    public CompteServiceImpl(CompteRepository compteRepository, ModelMapper mapper) {
        this.compteRepository = compteRepository;
        this.mapper = mapper;
    }

    @Override
    public CompteDto getInfoClientes(ComptePKId comptePKId)
    {
        Compte compte =compteRepository.getReferenceById(comptePKId);
        return mapper.map(compte,CompteDto.class);
    }

    @Override
    public List<CompteDto> getComptesByClient(String codClientes) {
        List<Compte> comptes=compteRepository.findAllByCodClientes(codClientes);

        return comptes.stream().map((compte)->mapper.map(compte,CompteDto.class)).collect(Collectors.toList());
    }

    @Override
    public CompteDto getCompte(String codClientes, String codCategoria, String codProducto) {
        Compte compte=compteRepository.findByCodClientesAndCodCategoriaAndCodProducto(codClientes,codCategoria,codProducto);
        return mapper.map(compte,CompteDto.class);
    }

    @Override
    public CompteDto createCompte(CompteDto compteDto) {
        // mapping the received values into entity
        Compte compte=mapToEntity(compteDto);
        // Saving mapping values into database
        Compte cp=compteRepository.save(compte);
        // then we return the mapping DTO values
        CompteDto clResponse=mapToDTO(cp);
        return clResponse;
    }

    @Override
    public CompteDto getInfoCompteByNumCompte(ComptePKId comptePKId) {
        Compte compte=compteRepository.getReferenceById(comptePKId);
        return mapToDTO(compte);
    }

//    @Override
//    public List<Object> getInstanceCompte(String codEmpresa, String numCuenta) {
//        List<Object> listObject=compteRepository.getInstanceCompte(codEmpresa,numCuenta);
//        return listObject.stream().toList();
//    }

    @Override
    public CompteDto updateCompte(CompteDto compteDto, ComptePKId comptePKId) {
        Compte compte=compteRepository.getReferenceById(comptePKId);
        compte.setSAL_DISPONIBLE(compteDto.getSAL_DISPONIBLE());
        compte.setSAL_TRANSITO(compteDto.getSAL_TRANSITO());
        compte.setFEC_ULT_MOVIMIENTO(compteDto.getFEC_ULT_MOVIMIENTO());
        compte.setSAL_PROMEDIO(compteDto.getSAL_PROMEDIO());
        Compte compte1=compteRepository.save(compte);
        CompteDto updateCompte=mapToDTO(compte1);
        return updateCompte;
    }

    @Override
    public CompteDto getInfoSoldeDisponibleByProd(String codClientes, String codProducto) {
        Compte compte=compteRepository.findByCodClientesAndCodProducto(codClientes,codProducto);
        if(compte == null) {
            // Compte n'existe pas, on considère qu'il est vide
            return new CompteDto();
        }

        BigDecimal zero = new BigDecimal(0);

        if(compte.getSAL_DISPONIBLE().compareTo(zero) <= 0) {
            // Solde négatif ou nul
            return new CompteDto();
        }
        // Mapper le compte s'il a un solde positif
        return mapper.map(compte,CompteDto.class);
    }

    @Override
    public CompteDto getInfoNumCompte(String numCuenta) {
        Compte compte=compteRepository.findByComptePKIdNumCuenta(numCuenta);
        return mapToDTO(compte);
    }



    // convert Entity into DTO
    private CompteDto mapToDTO(Compte compte){
        CompteDto compteDto = mapper.map(compte,CompteDto.class);
        return compteDto;
    }

    // convert DTO to entity
    private Compte mapToEntity(CompteDto compteDto){
        Compte compte = mapper.map(compteDto, Compte.class);
        return compte;
    }



}
