package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.SerieDto;
import io.digiservices.ebanking.paylaod.SeriePKId;

public interface SerieService {

    SerieDto getCurrentSerie(SeriePKId seriePKId);

    SerieDto updateCurrentSerie(SerieDto serieDto, SeriePKId seriePKId);


    Long callCF_SP_SERIE_AGENCIA(String codEmpresa, String codAgencia, String codSistema, String codSerie);

    Long callCF_SP_SERIE_EMPRESA(String codEmpresa, String codSistema, String codSerie);
}
