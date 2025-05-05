package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.GroupementDto;

import java.util.List;

public interface GroupementService {

    GroupementDto createGroupement(GroupementDto groupementDto);

    List<GroupementDto> getAllMembreByCodCliente(String codCliente);

}
