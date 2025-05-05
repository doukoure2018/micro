package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.ProfessionDto;
import io.digiservices.ebanking.paylaod.ProfessionPKId;

import java.util.List;

public interface ProfessionService {

    List<ProfessionDto> getAllProfession();

    ProfessionDto getInfoProfession(ProfessionPKId professionPKId);
}
