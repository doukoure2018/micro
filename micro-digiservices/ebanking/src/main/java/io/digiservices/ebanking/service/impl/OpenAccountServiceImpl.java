package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.dto.OpenAccount;
import io.digiservices.ebanking.dto.OpenAccountResponse;
import io.digiservices.ebanking.entity.*;
import io.digiservices.ebanking.paylaod.*;
import io.digiservices.ebanking.repository.*;
import io.digiservices.ebanking.service.OpenAccountService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@AllArgsConstructor
public class OpenAccountServiceImpl implements OpenAccountService {

    private MouvementRepository mouvementRepository;
    private FirmasClientesRepository firmasClientesRepository;
    private CompteRepository compteRepository;
    private SerieRepository serieRepository;
    private CalendariosRepository calendariosRepository;
    private ModelMapper mapper;

    @Override
    @Transactional
    public OpenAccountResponse ouvertureCompte(OpenAccount openAccount, String codCliente, String codPs, String codProducto) {

        try {
            // Get Information of calendar
            Calendarios calendarios=calendariosRepository.getReferenceById(new CalendariosPKId("CC","00000",codPs));
            // Insert Compte
            Compte compte = openAccount.getCompte();
            compte.setCodSystema("CC");

            // Get the last serie
            Serie serie=serieRepository.getReferenceById(new SeriePKId("00000","CC","CC_CTA_EFE"));
            serie.setVAL_SIGUIENTE(serie.getVAL_SIGUIENTE()+1);
            serieRepository.save(serie);

            // Determination du numero de compte du client
            String numCuenta="";
            if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 5) {
                numCuenta = codPs + codProducto.substring(codProducto.indexOf('C') + 2) + "000" + serie.getVAL_SIGUIENTE();
            } else if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 6) {
                numCuenta = codPs + codProducto.substring(codProducto.indexOf('C') + 2) + "00" + serie.getVAL_SIGUIENTE();
            } else if (String.valueOf(serie.getVAL_SIGUIENTE()).length() == 7) {
                numCuenta = codPs + codProducto.substring(codProducto.indexOf('C') + 2) + "0" + serie.getVAL_SIGUIENTE();
            } else {
                numCuenta = codPs + codProducto.substring(codProducto.indexOf('C') + 2) + serie.getVAL_SIGUIENTE();
            }

            System.out.println(numCuenta);

            compte.setComptePKId(new ComptePKId("00000",numCuenta));
            compte.setCodSystema("CC");
            compte.setCodProducto(codProducto);
            compte.setCodClientes(codCliente);
            compte.setFEC_ULT_CAP_INT(calendarios.getFEC_HOY());
            compte.setCOD_AGENCIA(codPs);
            compte.setFEC_ESTADO(calendarios.getFEC_HOY());
            compte.setFEC_ULT_ACT_INT(calendarios.getFEC_HOY());
            compte.setFEC_APERTURA(calendarios.getFEC_HOY());
            compte.setFEC_INI_SOBGRO(calendarios.getFEC_HOY());
            compte.setFEC_PROX_CAP_INT(calendarios.getFEC_HOY());
            compte.setCOD_ESTADO("1");
            compte.setIND_ESTADO("A");
            compte.setOBS_ESTADO_CUENTA("Ouverture de Compte en Espèces");
            compte.setIND_TIP_CARGOS("P");
            compte.setSAL_DISPONIBLE(BigDecimal.valueOf(0.00));
            compte.setSAL_RESERVA(BigDecimal.valueOf(0.00));
            compte.setSAL_TRANSITO(BigDecimal.valueOf(0.00));
            compte.setIND_CTA_ALTERNA("N");
            compte.setSAL_CONSULTADO(BigDecimal.valueOf(0.00));
            compte.setSAL_CONGELADO(BigDecimal.valueOf(0.00));
            compte.setSAL_PROMEDIO(BigDecimal.valueOf(0.00));
            compte.setIND_PAG_INTERES("N");
            compte.setINT_RESERVA_UTL(BigDecimal.valueOf(0.00));
            compte.setIND_SOBGRO("N");
            compte.setCOD_MONEDA("4");
            compte.setINT_CAP_RESERVA(BigDecimal.valueOf(0.00));
            compte.setMON_RESERVA_UTL(BigDecimal.valueOf(0.00));
            compte.setINT_MES_ACTUAL(BigDecimal.valueOf(0.00));
            compte.setINT_SOBGRO_AUT(BigDecimal.valueOf(0.00));
            compte.setMON_SOBGRO_AUT(BigDecimal.valueOf(0.00));
            compte.setMON_SOB_NO_AUT(BigDecimal.valueOf(0.00));
            compte.setMON_TOTAL_CARGO(BigDecimal.valueOf(0.00));
            compte.setINT_CAP_CONGELA(BigDecimal.valueOf(0.00));
            compte.setSAL_MINIMO(BigDecimal.valueOf(0.00));
            compte.setSAL_ULT_CORTE(BigDecimal.valueOf(0.00));
            compte.setCOD_ASOCIACION(null);
            compte.setCOD_GRUPO_SOL(null);
            compte.setMON_SOBGRO_DISP(BigDecimal.valueOf(0.00));
            compte.setINT_POR_PAGAR(BigDecimal.valueOf(0.00));
            compte.setNUM_CTA_RELACIONADA(null);
            compte.setMON_MAX_SOBGRO_TEMP(null);
            compte.setINT_POR_PAGAR_MES(null);
            compte.setFEC_PROX_CAP_INT(null);
            compteRepository.save(compte);
            // add firClientes
            FirmasClientes firmasClientes = openAccount.getFirmasClientes();
            firmasClientes.setFirmasClientesPkId(new FirmasClientesPkId("00000",codCliente,numCuenta));
            firmasClientes.setCTG_FIRMA("A");
            firmasClientes.setTIP_CLIENTE("P");
            firmasClientesRepository.save(firmasClientes);
            // add Info Mouvement
            // Get the last serie
            Serie serieMouvement=serieRepository.getReferenceById(new SeriePKId("00000","CC","CC_CTA_EFE"));
            serieMouvement.setVAL_SIGUIENTE(serieMouvement.getVAL_SIGUIENTE()+1);
            serieRepository.save(serieMouvement);
            Mouvement mouvement = openAccount.getMouvement();
            mouvement.setMouvementPkId(new MouvementPkId("00000", serieMouvement.getVAL_SIGUIENTE()));
            mouvement.setCOD_SISTEMA("CC");
            mouvement.setCOD_PRODUCTO(codProducto);
            mouvement.setCOD_SISTEMA("CC");
            mouvement.setCOD_AGENCIA(codPs);
            mouvement.setSISTEMA_FUENTE("CC");
            mouvement.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            mouvement.setCOD_AGENCIA(codPs);
            mouvement.setDES_MOVIMIENTO("Ouverture de compte Ecredit");
            mouvement.setDES_REFERENCIA("Ouverture de compte Ecredit");
            mouvement.setEST_MOVIMIENTO("C");
            mouvement.setMON_MOVIMIENTO(BigDecimal.valueOf(0.00));
            mouvement.setIND_APL_CARGO("N");
            mouvement.setNUM_MOV_FUENTE(0L);
            mouvement.setSUBTIP_TRANSAC("1");
            mouvement.setTIP_TRANSACCION("39");
            mouvement.setNUM_CUENTA(numCuenta);
            mouvement.setNUM_DOCUMENTO(0L);
            mouvementRepository.save(mouvement);

            OpenAccountResponse response=new OpenAccountResponse();
            response.setMessage("success");
            return response;
        } catch (Exception e) {
            // rollback implicite
            throw e;
        }
    }
}
