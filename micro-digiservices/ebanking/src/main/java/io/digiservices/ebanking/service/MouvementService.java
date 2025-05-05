package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.MouvementDto;
import io.digiservices.ebanking.paylaod.MouvementPkId;

public interface MouvementService {

    MouvementDto createMouvement(MouvementDto mouvementDto);

    MouvementDto getInfoMouvement(MouvementPkId mouvementPkId);

}
