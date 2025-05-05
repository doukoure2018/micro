package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.IdClientesDto;

import java.util.List;

public interface IdClientesService {

    IdClientesDto createIdClientesId(IdClientesDto idClientesDto);

    List<IdClientesDto> getAllIdClientes();

    IdClientesDto getInfoIdClientes(String codClientes);

    IdClientesDto updateIdClientes(IdClientesDto idClientesDto, String codClientes);

    IdClientesDto getInfoIdClientesByCodClient(String codClient);
}
