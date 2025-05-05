package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.dto.DepositMobile;
import io.digiservices.ebanking.dto.DepositResponse;
import io.digiservices.ebanking.dto.MontantDto;
import io.digiservices.ebanking.entity.*;
import io.digiservices.ebanking.exception.BlogAPIException;
import io.digiservices.ebanking.paylaod.*;
import io.digiservices.ebanking.repository.*;
import io.digiservices.ebanking.service.DepositMobileService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class DepositMobileServiceImpl implements DepositMobileService {

    private MouvementRepository mouvementRepository;
    private ResumenRepository resumenRepository;
    private AstoDetailRepository astoDetailRepository;
    private SerieRepository serieRepository;
    private CalendariosRepository calendariosRepository;
    private CompteRepository compteRepository;

    private ModelMapper mapper;


    @Override
    @Transactional
    public DepositResponse depositAccountMobile(DepositMobile depositMobile, String codCliente) {

        try {
            MontantDto montantDto=depositMobile.getMontantDto();
            if(!compteRepository.existsCompteByCodClientesAndCodProducto(codCliente,"CC014")){
                throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Ce client n'a pas de compte de remboursement");
            }
            Compte compte=compteRepository.findByCodClientesAndCodProducto(codCliente,"CC014");
            // Mise a jour du solde du client
            compte.setSAL_DISPONIBLE(compte.getSAL_DISPONIBLE().add(montantDto.getMontant()));
            compte.setSAL_PROMEDIO(compte.getSAL_DISPONIBLE());
            compteRepository.save(compte);

            // Mise a jour solde Compte Pivot
            Compte compte1=compteRepository.findByComptePKIdNumCuenta("95101300041670");
            compte1.setSAL_DISPONIBLE(compte1.getSAL_DISPONIBLE().subtract(montantDto.getMontant()));
            compte1.setSAL_PROMEDIO(compte1.getSAL_DISPONIBLE());
            compteRepository.save(compte1);

            Calendarios calendarios=calendariosRepository.getReferenceById(new CalendariosPKId("CG","00000","951"));
            Serie serie1=serieRepository.getReferenceById(new SeriePKId("00000","CC","CC_MOV_DIA"));
            serie1.setVAL_SIGUIENTE(serie1.getVAL_SIGUIENTE()+1);
            serieRepository.save(serie1);
            Mouvement mouvement1=depositMobile.getMouvement1();
            mouvement1.setNUM_MOV_FUENTE(serie1.getVAL_SIGUIENTE());
            mouvement1.setMouvementPkId(new MouvementPkId("00000",serie1.getVAL_SIGUIENTE()));

            mouvement1.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            mouvement1.setTIP_TRANSACCION("41");
            mouvement1.setSUBTIP_TRANSAC("4");
            mouvement1.setDES_REFERENCIA("REMB CREDIT MONEY");
            mouvement1.setDES_MOVIMIENTO("REMB CREDIT MONEY");
            mouvement1.setNUM_CUENTA(compte.getComptePKId().getNumCuenta());
            mouvement1.setCOD_PRODUCTO(compte.getCodProducto());
            mouvement1.setCOD_AGENCIA(compte.getCOD_AGENCIA());
            mouvement1.setEST_MOVIMIENTO("C");
            mouvement1.setIND_APL_CARGO("N");
            mouvement1.setCOD_SISTEMA("CC");
            mouvement1.setSISTEMA_FUENTE("CC");
            mouvement1.setNUM_DOCUMENTO(0L);
            mouvement1.setCOD_USUARIO("CRGEBANKING");
            mouvement1.setMON_MOVIMIENTO(montantDto.getMontant());
            mouvementRepository.save(mouvement1);

            Serie serie2=serieRepository.getReferenceById(new SeriePKId("00000","CC","CC_MOV_DIA"));
            serie2.setVAL_SIGUIENTE(serie2.getVAL_SIGUIENTE()+1);
            serieRepository.save(serie2);
            Mouvement mouvement2=depositMobile.getMouvement2();
            mouvement2.setNUM_MOV_FUENTE(serie2.getVAL_SIGUIENTE());
            mouvement2.setMouvementPkId(new MouvementPkId("00000",serie2.getVAL_SIGUIENTE()));
            mouvement2.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            mouvement2.setTIP_TRANSACCION("40");
            mouvement2.setSUBTIP_TRANSAC("4");
            mouvement2.setDES_REFERENCIA("REMB CREDIT MONEY"+"-"+compte.getCodClientes()+"-"+compte.getNOM_CHEQUERA()+"-"+compte.getCOD_AGENCIA());
            mouvement2.setDES_MOVIMIENTO("REMB CREDIT MONEY"+"-"+compte.getCodClientes()+"-"+compte.getNOM_CHEQUERA()+"-"+compte.getCOD_AGENCIA());
            mouvement2.setNUM_CUENTA("95101300041670");
            mouvement2.setCOD_PRODUCTO("CC013");
            mouvement2.setCOD_AGENCIA("951");
            mouvement2.setEST_MOVIMIENTO("C");
            mouvement2.setIND_APL_CARGO("N");
            mouvement2.setCOD_SISTEMA("CC");
            mouvement2.setSISTEMA_FUENTE("CC");
            mouvement2.setCOD_USUARIO("CRGEBANKING");
            mouvement2.setNUM_DOCUMENTO(0L);
            mouvement2.setMON_MOVIMIENTO(montantDto.getMontant());
            mouvementRepository.save(mouvement2);


            Serie serieResume=serieRepository.getReferenceById(new SeriePKId("00000","CG","CONS_ASTO"));
            serieResume.setVAL_SIGUIENTE(serieResume.getVAL_SIGUIENTE()+1);
            serieRepository.save(serieResume);
            Resumen resumen=depositMobile.getResumen();
            resumen.setResumenPkId(new ResumenPkId("00000",compte.getCOD_AGENCIA(),serieResume.getVAL_SIGUIENTE()));
            resumen.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            resumen.setFEC_ASIENTO(calendarios.getFEC_HOY());
            resumen.setFEC_REGISTRO(LocalDateTime.now());
            resumen.setTIP_TRANSACCION("41");
            resumen.setSUBTIP_TRANSAC("4");
            resumen.setCOD_SISTEMA("CC");
            resumen.setCOD_USUARIO("CRGEBANKING");
            resumen.setDES_ASIENTO("CREDIT POUR TRANSFERT EBANKING");
            resumen.setEST_ASIENTO("P");
            resumen.setIND_LIQUIDACION("N");
            resumen.setIND_POST_CIERRE("N");
            resumenRepository.save(resumen);

            AstoDetail astoDetail1=depositMobile.getAstoDetail1();
            astoDetail1.setAstoDetailPkId(new AstoDetailPkId("00000",compte.getCOD_AGENCIA(),serieResume.getVAL_SIGUIENTE(), 1L));
            astoDetail1.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            astoDetail1.setTIP_CAM_BASE(BigDecimal.valueOf(1.00));
            astoDetail1.setCREDITO_CTA(BigDecimal.valueOf(0.00));
            astoDetail1.setCREDITO(BigDecimal.valueOf(0.00));
            astoDetail1.setDETALLE("REMB CREDIT MONEY"+"-"+compte.getCodClientes()+"-"+compte.getNOM_CHEQUERA()+"-"+compte.getCOD_AGENCIA());
            astoDetail1.setTIP_CAM_CTA(BigDecimal.valueOf(1.00));
            astoDetail1.setREFERENCIA("0");
            astoDetail1.setCUENTA_CONTABLE("38000000005");
            astoDetail1.setDEBITO_CTA(montantDto.getMontant());
            astoDetail1.setDEBITO(montantDto.getMontant());
            astoDetailRepository.save(astoDetail1);


            AstoDetail astoDetail2=depositMobile.getAstoDetail2();
            astoDetail2.setAstoDetailPkId(new AstoDetailPkId("00000",compte.getCOD_AGENCIA(),serieResume.getVAL_SIGUIENTE(), 2L));
            astoDetail2.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            astoDetail2.setTIP_CAM_BASE(BigDecimal.valueOf(1.00));
            astoDetail2.setDEBITO_CTA(BigDecimal.valueOf(0.00));
            astoDetail2.setDEBITO(BigDecimal.valueOf(0.00));
            astoDetail2.setDETALLE("REMB CREDIT MONEY"+"-"+compte.getCodClientes()+"-"+compte.getNOM_CHEQUERA()+"-"+compte.getCOD_AGENCIA());
            astoDetail2.setTIP_CAM_CTA(BigDecimal.valueOf(1.00));
            astoDetail2.setREFERENCIA("0");
            astoDetail2.setCUENTA_CONTABLE("24700000001");
            astoDetail2.setCREDITO_CTA(montantDto.getMontant());
            astoDetail2.setCREDITO(montantDto.getMontant());
            astoDetailRepository.save(astoDetail2);

            // ECRETURE COMPTABLE COMPTE PIVOT
            Serie serieResumePivot=serieRepository.getReferenceById(new SeriePKId("00000","CG","CONS_ASTO"));
            serieResumePivot.setVAL_SIGUIENTE(serieResumePivot.getVAL_SIGUIENTE()+1);
            serieRepository.save(serieResumePivot);
            Resumen resumen1=depositMobile.getResumen1();
            resumen1.setResumenPkId(new ResumenPkId("00000",compte1.getCOD_AGENCIA(),serieResumePivot.getVAL_SIGUIENTE()));
            resumen1.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            resumen1.setFEC_ASIENTO(calendarios.getFEC_HOY());
            resumen1.setFEC_REGISTRO(LocalDateTime.now());
            resumen1.setTIP_TRANSACCION("40");
            resumen1.setSUBTIP_TRANSAC("4");
            resumen1.setCOD_SISTEMA("CC");
            resumen1.setCOD_USUARIO("CRGEBANKING");
            resumen1.setDES_ASIENTO("DEBIT POUR TRANSFERT EBANKING");
            resumen1.setEST_ASIENTO("P");
            resumen1.setIND_LIQUIDACION("N");
            resumen1.setIND_POST_CIERRE("N");
            resumenRepository.save(resumen1);

            AstoDetail astoDetail3=depositMobile.getAstoDetail1();
            astoDetail3.setAstoDetailPkId(new AstoDetailPkId("00000",compte1.getCOD_AGENCIA(),serieResumePivot.getVAL_SIGUIENTE(), 1L));
            astoDetail3.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            astoDetail3.setTIP_CAM_BASE(BigDecimal.valueOf(1.00));
            astoDetail3.setCREDITO_CTA(BigDecimal.valueOf(0.00));
            astoDetail3.setCREDITO(BigDecimal.valueOf(0.00));
            astoDetail3.setDETALLE("REMB CREDIT MONEY"+"-"+compte.getCodClientes()+"-"+compte.getNOM_CHEQUERA()+"-"+compte.getCOD_AGENCIA());
            astoDetail3.setTIP_CAM_CTA(BigDecimal.valueOf(1.00));
            astoDetail3.setREFERENCIA("0");
            astoDetail3.setCUENTA_CONTABLE("24100000004");
            astoDetail3.setDEBITO_CTA(montantDto.getMontant());
            astoDetail3.setDEBITO(montantDto.getMontant());
            astoDetailRepository.save(astoDetail3);

            AstoDetail astoDetail4=depositMobile.getAstoDetail2();
            astoDetail4.setAstoDetailPkId(new AstoDetailPkId("00000",compte1.getCOD_AGENCIA(),serieResumePivot.getVAL_SIGUIENTE(), 2L));
            astoDetail4.setFEC_MOVIMIENTO(calendarios.getFEC_HOY());
            astoDetail4.setTIP_CAM_BASE(BigDecimal.valueOf(1.00));
            astoDetail4.setDEBITO_CTA(BigDecimal.valueOf(0.00));
            astoDetail4.setDEBITO(BigDecimal.valueOf(0.00));
            astoDetail4.setDETALLE("REMB CREDIT MONEY"+"-"+compte.getCodClientes()+"-"+compte.getNOM_CHEQUERA()+"-"+compte.getCOD_AGENCIA());
            astoDetail4.setTIP_CAM_CTA(BigDecimal.valueOf(1.00));
            astoDetail4.setREFERENCIA("0");
            astoDetail4.setCUENTA_CONTABLE("38000000005");
            astoDetail4.setCREDITO_CTA(montantDto.getMontant());
            astoDetail4.setCREDITO(montantDto.getMontant());
            astoDetailRepository.save(astoDetail4);

            DepositResponse depositResponse=new DepositResponse();
            depositResponse.setMessage("Success");
            return depositResponse;
        } catch (Exception e) {
            // rollback implicite
            throw e;
        }
    }
}
