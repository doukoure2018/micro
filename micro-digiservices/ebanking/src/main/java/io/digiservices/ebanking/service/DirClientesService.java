package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.DirClientesDto;
import io.digiservices.ebanking.paylaod.DirClientesPKId;

import java.util.List;

public interface DirClientesService {

    DirClientesDto createDirClientes(DirClientesDto dirClientesDto);

    List<DirClientesDto> getListDirClientes();

    DirClientesDto getInfoDirClientes(String codClientes);

    DirClientesDto updateInfoDirClientes(DirClientesDto dirClientesDto, DirClientesPKId dirClientesPKId);
}
