package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.SG_USUARIOSDto;
import io.digiservices.ebanking.paylaod.UsariosPKId;

import java.util.List;

public interface SG_USUARIOSService {

    boolean existeUsuarios(UsariosPKId usariosPKId);

    SG_USUARIOSDto getUsuarios(UsariosPKId usariosPKId);

    List<SG_USUARIOSDto> getListUsuariosByCodAgencia(String codAgencia, String codPuesto, String indActivo);


    boolean isActive_usuarios(UsariosPKId usariosPKId);

    String getActiveUser(UsariosPKId usariosPKId);

    String getCodAgencia(UsariosPKId usariosPKId);

    Boolean is_agent(UsariosPKId usariosPKId);

    Boolean is_caisse(UsariosPKId usariosPKId);

    Boolean getActiveUser(String codUser);

}
