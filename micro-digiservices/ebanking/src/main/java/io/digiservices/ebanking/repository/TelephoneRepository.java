package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.dto.UpdateTelephoneDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * Repository dedie a la mise a jour du seul champ TEL_PRINCIPAL dans SAF.
 * Appelle la procedure stockee SP_UPDATE_TELEPHONE_CLIENT (3 parametres IN, 2 OUT).
 *
 * Cree pour le workflow de changement de telephone — n'altere pas FicheSignaletiqueRepository existant.
 */
@Slf4j
@Repository
public class TelephoneRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Map<String, Object> updateTelephone(UpdateTelephoneDTO dto) {
        log.info("Appel SP_UPDATE_TELEPHONE_CLIENT - Client: {}, Tel: {}",
                dto.getCodCliente(), dto.getTelPrincipal());

        StoredProcedureQuery sp = entityManager
                .createStoredProcedureQuery("CL.SP_UPDATE_TELEPHONE_CLIENT");

        sp.registerStoredProcedureParameter("p_cod_empresa", String.class, ParameterMode.IN);
        sp.registerStoredProcedureParameter("p_cod_cliente", String.class, ParameterMode.IN);
        sp.registerStoredProcedureParameter("p_tel_principal", String.class, ParameterMode.IN);
        sp.registerStoredProcedureParameter("p_result_code", Integer.class, ParameterMode.OUT);
        sp.registerStoredProcedureParameter("p_result_message", String.class, ParameterMode.OUT);

        String codEmpresa = (dto.getCodEmpresa() != null && !dto.getCodEmpresa().isBlank())
                ? truncate(dto.getCodEmpresa(), 5)
                : "00000";

        sp.setParameter("p_cod_empresa", codEmpresa);
        sp.setParameter("p_cod_cliente", truncate(dto.getCodCliente(), 15));
        sp.setParameter("p_tel_principal", truncate(dto.getTelPrincipal(), 15));

        sp.execute();

        Integer resultCode = (Integer) sp.getOutputParameterValue("p_result_code");
        String resultMessage = (String) sp.getOutputParameterValue("p_result_message");

        Map<String, Object> result = new HashMap<>();
        result.put("code", resultCode);
        result.put("message", resultMessage);

        log.info("SP_UPDATE_TELEPHONE_CLIENT termine - Client: {}, Code: {}, Message: {}",
                dto.getCodCliente(), resultCode, resultMessage);

        return result;
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return null;
        return value.length() > maxLength ? value.substring(0, maxLength) : value;
    }
}
