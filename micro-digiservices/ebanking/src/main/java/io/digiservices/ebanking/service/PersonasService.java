package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.PersonaPKId;
import io.digiservices.ebanking.paylaod.PersonasDto;

public interface PersonasService {

    PersonasDto createPersona(PersonasDto personasDto);

    PersonasDto getInfoPersona(PersonaPKId personaPKId);

    PersonasDto getPersona(String codClientes);

    PersonasDto updateInfoPersona(PersonasDto personasDto,PersonaPKId personaPKId);
}
