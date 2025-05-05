package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Serie;
import io.digiservices.ebanking.paylaod.SerieDto;
import io.digiservices.ebanking.paylaod.SeriePKId;
import io.digiservices.ebanking.repository.SerieRepository;
import io.digiservices.ebanking.service.SerieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import java.sql.Types;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SerieServiceImpl implements SerieService {

    private final SerieRepository serieRepository;
    private final ModelMapper modelMapper;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public SerieDto getCurrentSerie(SeriePKId seriePKId) {
        Serie serie=serieRepository.getReferenceById(seriePKId);
        SerieDto serieDto=modelMapper.map(serie,SerieDto.class);
        return serieDto;
    }

    @Override
    public SerieDto updateCurrentSerie(SerieDto serieDto,SeriePKId seriePKId) {
        Serie serie=serieRepository.getReferenceById(seriePKId);
        serie.setVAL_SIGUIENTE(serie.getVAL_SIGUIENTE()+1);
        Serie updatedPost=serieRepository.save(serie);
        return modelMapper.map(updatedPost,SerieDto.class);
    }


    @Override
    public Long callCF_SP_SERIE_AGENCIA(String codEmpresa, String codAgencia, String codSistema, String codSerie) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("CF") // Le schéma de la procédure
                .withProcedureName("CF_SP_SERIE_AGENCIA")
                .declareParameters(
                        new SqlParameter("COD_EMPRESA", Types.NVARCHAR),
                        new SqlParameter("COD_AGENCIA", Types.NVARCHAR),
                        new SqlParameter("COD_SISTEMA", Types.NVARCHAR),
                        new SqlParameter("COD_SERIE", Types.NVARCHAR),
                        new SqlOutParameter("VALOR", Types.NUMERIC)
                );

        // Configurer les paramètres d'entrée
        Map<String, Object> inParameters = Map.of(
                "COD_EMPRESA", codEmpresa,
                "COD_AGENCIA", codAgencia,
                "COD_SISTEMA", codSistema,
                "COD_SERIE", codSerie
        );

        // Appeler la procédure stockée
        Map<String, Object> outParameters = jdbcCall.execute(inParameters);

        // Extract and convert VALOR
        Object valorObject = outParameters.get("VALOR");
        if (valorObject instanceof Number) {
            return ((Number) valorObject).longValue();
        } else {
            throw new IllegalArgumentException("VALOR is not a valid number");
        }
    }


    @Override
    public Long callCF_SP_SERIE_EMPRESA(String codEmpresa, String codSistema, String codSerie) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withSchemaName("CF")
                .withProcedureName("CF_SP_SERIE_EMPRESA")
                .declareParameters(
                        new SqlParameter("COD_EMPRESA", Types.NVARCHAR),
                        new SqlParameter("COD_SISTEMA", Types.NVARCHAR),
                        new SqlParameter("COD_SERIE", Types.NVARCHAR),
                        new SqlOutParameter("VALOR", Types.NUMERIC)
                );

        Map<String, Object> inParameters = Map.of(
                "COD_EMPRESA", codEmpresa,
                "COD_SISTEMA", codSistema,
                "COD_SERIE", codSerie
        );

        Map<String, Object> outParameters = jdbcCall.execute(inParameters);

        Object valorObject = outParameters.get("VALOR");
        if (valorObject instanceof Number) {
            return ((Number) valorObject).longValue();
        } else {
            throw new IllegalArgumentException("VALOR is not a valid number");
        }
    }
}
