package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.ClientesDto;
import io.digiservices.ebanking.paylaod.ClientesPKId;
import io.digiservices.ebanking.paylaod.ClientesResponse;

import java.util.Date;
import java.util.List;

public interface ClientesService {

    ClientesDto createClientes(ClientesDto clientesDto);

    ClientesResponse getAllClientes(int pageNo, int pageSize, String sortBy, String sortDi);

    ClientesDto getClientes(ClientesPKId clientesPKId);

    ClientesDto getOldCliente(String codClienteMig);

    ClientesDto getNewCliente(String codCliente);

    boolean existCodCliente(String codCliente);

    boolean existCodClienteMig(String codClienteMig);

    ClientesDto updateClientes(ClientesDto clientesDto,ClientesPKId clientesPKId);

    void deleteClientes(String id);

    ClientesDto searchsClientes(String query);

    ClientesDto searchsClientesByCodAgencia(String codAgencia,String query);

    List<Object[]> getInfoClientes(String codCliente);

    Long getNombreAdhesion(Date start_date, Date end_date);

    Long getNombreAdhesionByAgencia(Date start_date,Date end_date,String codAgencia);

    List<Object[]> getNombreAnomalieParAgence(String codAgencia);


}
