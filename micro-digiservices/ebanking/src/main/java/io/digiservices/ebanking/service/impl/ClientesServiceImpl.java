package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.entity.Clientes;
import io.digiservices.ebanking.exception.ResourceNotFoundException;
import io.digiservices.ebanking.paylaod.ClientesDto;
import io.digiservices.ebanking.paylaod.ClientesPKId;
import io.digiservices.ebanking.paylaod.ClientesResponse;
import io.digiservices.ebanking.repository.ClientesRepository;
import io.digiservices.ebanking.service.ClientesService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientesServiceImpl implements ClientesService {

    private ClientesRepository clientesRepository;
    private ModelMapper mapper;

    public ClientesServiceImpl(ClientesRepository clientesRepository, ModelMapper mapper) {
        this.clientesRepository = clientesRepository;
        this.mapper = mapper;
    }

    @Override
    public ClientesDto createClientes(ClientesDto clientesDto) {
        Clientes clientes=mapToEntity(clientesDto);
        Clientes cl=clientesRepository.save(clientes);
        ClientesDto clResponse=mapToDTO(cl);
        return clResponse;
    }

    @Override
    public ClientesResponse getAllClientes(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort=sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                :Sort.by(sortBy).descending();
        // create Pageable instance
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Clientes> allClientes=clientesRepository.findAll(pageable);
        List<Clientes> listOfClientes=allClientes.getContent();
        List<ClientesDto> content=listOfClientes.stream().map(clientes -> mapToDTO(clientes)).collect(Collectors.toList());
        ClientesResponse clientesResponse=new ClientesResponse();
        clientesResponse.setContent(content);
        clientesResponse.setPageNo(allClientes.getNumber());
        clientesResponse.setPageSize(allClientes.getSize());
        clientesResponse.setTotalElements(allClientes.getTotalElements());
        clientesResponse.setTotalPages(allClientes.getTotalPages());
        clientesResponse.setLast(allClientes.isLast());
        return clientesResponse;
    }

    @Override
    public ClientesDto getClientes(ClientesPKId clientesPKId) {
        Clientes clientes=clientesRepository.getReferenceById(clientesPKId);
        return mapToDTO(clientes);
    }

    @Override
    public ClientesDto getOldCliente(String codClienteMig) {
        Clientes clientes=clientesRepository.findByCodClienteMig(codClienteMig)
                .orElseThrow(()->new ResourceNotFoundException("IdClientesDto","codClienteMig",codClienteMig));
        return mapToDTO(clientes);
    }

    @Override
    public ClientesDto getNewCliente(String codCliente) {
        Clientes clientes=clientesRepository.findByClientesPKIdCodCliente(codCliente)
                .orElseThrow(()->new ResourceNotFoundException("IdClientesDto","codCliente",codCliente));

        return mapToDTO(clientes);
    }

    @Override
    public boolean existCodCliente(String codCliente) {
        if(clientesRepository.existsByClientesPKIdCodCliente(codCliente)){
            return true;
        }else{
            return false;
        }

    }

    @Override
    public boolean existCodClienteMig(String codClienteMig) {
        if(clientesRepository.existsByCodClienteMig(codClienteMig)){
            return true;
        }else{
            return false;
        }

    }

    @Override
    public ClientesDto updateClientes(ClientesDto clientesDto, ClientesPKId clientesPKId)
    {
        Clientes clientes=clientesRepository.getReferenceById(clientesPKId);
        clientes.setTEL_PRINCIPAL(clientesDto.getTEL_PRINCIPAL());
        clientes.setTEL_OTRO(clientesDto.getTEL_OTRO());
        clientes.setPROV_SERV_DESTINO(clientesDto.getPROV_SERV_DESTINO());
        Clientes clientes1=clientesRepository.save(clientes);
        ClientesDto clientesDto1=mapToDTO(clientes1);
        return clientesDto1;
    }

    @Override
    public void deleteClientes(String id) {

    }
    @Override
    public ClientesDto searchsClientes(String query) {
        Clientes clientes=clientesRepository.findByClientesPKIdCodCliente(query).orElseThrow(
                ()->new ResourceNotFoundException("IdClientesDto",query,query)
        );
        return mapper.map(clientes,ClientesDto.class);
    }

    @Override
    public ClientesDto searchsClientesByCodAgencia(String codAgencia, String query) {

        Clientes clientes=clientesRepository.findByCodAgenciaAndClientesPKIdCodCliente(codAgencia,query);
        return mapper.map(clientes,ClientesDto.class);
    }

    @Override
    public List<Object[]> getInfoClientes(String codCliente) {
        List<Object[]> objects=clientesRepository.getInfoClientes(codCliente);
        return objects.stream().toList();
    }

    @Override
    public Long getNombreAdhesion(Date start_date, Date end_date) {
        Long nombreAdhesion= clientesRepository.getNombreAdhesionWithinDates(start_date,end_date);
        return nombreAdhesion;
    }

    @Override
    public Long getNombreAdhesionByAgencia(Date start_date, Date end_date, String codAgencia) {
        Long nombreAdhesionByAgence= clientesRepository.getNombreAdhesionWithinDatesByAgence(start_date,end_date,codAgencia);
        return nombreAdhesionByAgence;
    }

    @Override
    public List<Object[]> getNombreAnomalieParAgence(String codAgencia) {
        List<Object[]> nbrAnomalieParAgence=clientesRepository.getNombreAnomalies(codAgencia);
        return nbrAnomalieParAgence.stream().toList();
    }

    // convert Entity into DTO
    private ClientesDto mapToDTO(Clientes clientes){
        ClientesDto clientesDto = mapper.map(clientes, ClientesDto.class);
        return clientesDto;
    }

    // convert DTO to entity
    private Clientes mapToEntity(ClientesDto clientesDto){
        Clientes clientes = mapper.map(clientesDto, Clientes.class);
        return clientes;
    }

    /**
     * get newCompteClientes
     * @param numComte
     * @param cod_agence
     * @return
     */
    public String incrementLastNumber(String numComte,String cod_agence)
    {
        int count=0;
        for (int i=0;i<numComte.length();i++)
        {
            if(numComte.charAt(i)!=' '){
                count++;
            }
        }
        // je recupere les derniers puis je fais l'incrementation
        String newLastCompte=numComte.substring(3,count);
        int incrementLastNomber=Integer.parseInt(newLastCompte)+1;
        String newCompteClientes=cod_agence+Integer.toString(incrementLastNomber);
        return newCompteClientes;
    }


}
