package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Creditos;
import io.digiservices.ebanking.exception.BlogAPIException;
import io.digiservices.ebanking.paylaod.CreditoPKId;
import io.digiservices.ebanking.paylaod.CreditosDto;
import io.digiservices.ebanking.repository.CreditosRepository;
import io.digiservices.ebanking.service.CreditosService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CreditosServiceImpl implements CreditosService {

    private CreditosRepository creditosRepository;
    private ModelMapper mapper;

    @Override
    public CreditosDto createCreditos(CreditosDto pr_creditoDto) {
        Creditos credito1=mapToEntity(pr_creditoDto);
        credito1.setFEC_ULT_PAGO_MORA(null);
        credito1.setFEC_CANCELACION(null);
        credito1.setFEC_PRORROGA(null);
        credito1.setTIP_COMISION("A");
        credito1.setPER_INT("");
        credito1.setIndEstado("T");
        credito1.setPER_CUOTA("ME");
        credito1.setPER_COMISION("ME");
        credito1.setNUM_LINEA(null);
        credito1.setGRACIA_MORA(5L);
        credito1.setTIP_DESEMBOLSO("2");
        credito1.setID_EXTERNO(null);
        credito1.setMON_SALDO(BigDecimal.valueOf(0));
        credito1.setTIP_MANEJO(null);
        credito1.setFEC_RECONOC_INT(null);
        credito1.setCOD_REFERENTE(null);
        credito1.setTIP_LINEA(null);
        credito1.setTIP_REVISION("A");
        credito1.setIND_COB_CUOTA("N");
        credito1.setTIP_MORA("M");
        credito1.setPER_MORA("ME");
        //credito1.setCOD_EJECUTIVO(null);
        credito1.setIND_FORMA_PAGO("D");
        credito1.setFEC_SAL_COBRO(null);
        credito1.setIND_COB_POLIZA("N");
        credito1.setCOD_OFICIAL(null);
        credito1.setIND_COB_CARGOS("S");
        credito1.setIND_BLOQUEO("N");
        credito1.setCANT_HECTAREAS(null);
        credito1.setCOD_DIRECCION("1");
        credito1.setPOR_SOBREGIRO(0L);
        credito1.setIND_SOBREGIRO("N");
        credito1.setPER_REV_TASA("ME");
        credito1.setNUM_CICLO(1L);
        credito1.setFEC_ADICION(null);
        credito1.setFEC_ING_COBRO(null);
        credito1.setTIP_REG_COBRO(1L);
        credito1.setCOD_ASOCIACION(null);
        credito1.setCOD_GRUPO_SOL(null);
        credito1.setTASA_EFECTIVA(0L);
        credito1.setFEC_PROVISION(null);
        credito1.setIND_CALC_MORA("PV");
        credito1.setFEC_INICIO_PLAN(null);
        credito1.setPLAZO_ADICIONAL(0L);
        credito1.setCOD_ZONA(null);
        credito1.setFEC_RENOVACION(null);
        credito1.setMON_INT_CUOTA(0L);
        credito1.setMON_PROVISION(null);
        credito1.setFEC_PRIMER_DESEMBOLSO(null);
        credito1.setFEC_ULT_PAGO_MORA(null);
        credito1.setFEC_CALIFICACION(null);
        credito1.setMON_COMISION_NORMAL(BigDecimal.valueOf(0.00));
        credito1.setMON_INT_ACUMULADO(0L);
        credito1.setMON_SUSPEN_PRINCIPAL(null);
        credito1.setMON_INT_SUSPENSO(0L);
        credito1.setFEC_ULT_PAGO_PRINCIPAL(null);
        credito1.setIND_COB_COMISION("N");
        credito1.setVAL_VARIACION_BASE(0L);
        credito1.setFEC_ULT_PAGO_COMISION(null);
        credito1.setMON_INT_MORA_SUSPENSO(0L);
        credito1.setPERIODO_CAPITALIZACION(null);
        credito1.setFEC_INI_PAGO_PRINC(null);
        credito1.setIND_CONTINUA_COBRO_INT("N");
        credito1.setTASA_INT_VAL_AGREGADO(null);
        credito1.setFEC_PROX_REVISION(null);
        credito1.setTASA_INT_VAL_AGREGADO(null);
        credito1.setMON_REVALORIZACION(0L);
        credito1.setFEC_ULT_PAGO_INTERESES(null);
        credito1.setIND_CAPITALIZA_INT(null);
        credito1.setMON_SUSPEN_INTERESES(null);
        credito1.setMON_PRINCIPAL_CUOTA(0L);
        credito1.setMON_PAGADO_INTERESES(0L);
        credito1.setMON_INT_ANTES_CJ(null);
        credito1.setMON_INT_ANTICIPADOS(null);
        credito1.setIND_CALIF_MANUAL("N");
        credito1.setFEC_ULT_DESEMBOLSO(null);
        credito1.setMON_INT_MORA_ACUMULA(0L);
        credito1.setIND_EXCLUSION_PAGO("N");
        credito1.setCOD_USUARIO_PROVISION(null);
        credito1.setVAL_VARIACION_MORA(0L);
        credito1.setGRACIA_PRINCIPAL(0L);
        credito1.setMON_DESEMBOLSADO(0L);
        credito1.setMON_PAGADO_PRINCIPAL(0L);
        credito1.setFEC_ULT_REVISION(null);
        credito1.setIND_COBRA_INT_INICIAL(null);
        credito1.setFEC_PROX_COMISION(null);
        credito1.setCOD_ESTADO_CONTABLE(null);
        credito1.setCOD_CALIFICACION(null);
        credito1.setTIP_MODALIDAD_COBRO_ESP("H");
        credito1.setFEC_RECONOC_INT(null);
        credito1.setCOD_MONEDA("4");
        credito1.setTIP_INTERES("V");
        credito1.setTIP_TASA("V");
        credito1.setIND_LINEA("N");
        //credito1.setCOD_FINANCIADOR(null);
        Creditos newCredito=creditosRepository.save(credito1);
        CreditosDto creditoResponse=mapToDto(newCredito);
        return creditoResponse;
    }

    @Override
    public CreditosDto updateCredit(CreditosDto pr_creditoDto,Long numCredito) {
        Creditos pr_credito=creditosRepository.getCreditoParNumCredit(numCredito);
        pr_credito.setIdCuenta(pr_creditoDto.getIdCuenta());
        Creditos newCredito=creditosRepository.save(pr_credito);
        CreditosDto responseCreditos=mapToDto(newCredito);
        return responseCreditos;
    }

    @Override
    public CreditosDto getCreditoParNum(Long numCredito) {
        Creditos pr_credito=creditosRepository.getCreditoParNumCredit(numCredito);
        return mapToDto(pr_credito);
    }

    @Override
    public List<CreditosDto> getAllCreditosByUsuarios(String codUsuarios) {
        List<Creditos> pr_creditos=creditosRepository.findByCodUsuarios(codUsuarios);
        return pr_creditos.stream().map(creditos->mapToDto(creditos)).collect(Collectors.toList());
    }

    @Override
    public CreditosDto getCreditos(CreditoPKId pr_creditoPKId) {
        Creditos pr_credito=creditosRepository.getReferenceById(pr_creditoPKId);
        return mapToDto(pr_credito);
    }

    @Override
    public List<CreditosDto> getAllCreditosByClientes(String codCliente) {
        List<Creditos> pr_creditos=creditosRepository.findAllByCodCliente(codCliente);
        return pr_creditos.stream().map((pr_credito)->mapToDto(pr_credito))
                .collect(Collectors.toList());
    }

    @Override
    public long getNombreCreditByClientes(String codCliente) {
        List<Creditos> pr_creditos=creditosRepository.findAllByCodCliente(codCliente);
        long count=pr_creditos.size();
        return count;
    }

    @Override
    public long getCumulCreditByClientes(String codCliente) {
//        if(creditosRepository.existsByCodCliente(codCliente)){
//            return creditosRepository.getSommeCreditoByClientes(codCliente);
//        }else{
//            return 0;
//        }

        return 0;
    }

    @Override
    public List<Object[]> getAllRetards(String codAgencia) {
        /*List<Object[]> objects=creditosRepository.getAllRetard(codAgencia);
        return objects.stream().toList();*/
        return  null;
    }

    @Override
    public List<CreditosDto> getListCreditoByCodAgencia(String codAgencia, String indEstado) {
        List<Creditos> listCredito=creditosRepository.findByCreditoPKIdCodAgenciaAndIndEstado(codAgencia,indEstado);
        return listCredito.stream().map((pr_credito)->mapToDto(pr_credito))
                .collect(Collectors.toList());
    }

    @Override
    public List<CreditosDto> getOngoingCreditosByCodCliente(String codCliente, String indEstado) {

        if(!creditosRepository.existsCreditosByCodClienteAndIndEstado(codCliente,indEstado)){
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Ce client n'a pas de credit encours");
        }
        List<Creditos> listCreditos=creditosRepository.findAllByCodClienteAndIndEstado(codCliente,indEstado);

        return listCreditos.stream().map(creditos -> mapper.map(creditos,CreditosDto.class))
                           .collect(Collectors.toList());
    }

    @Override
    public CreditosDto updateInstado(Long numCredito,String codAgencia,String indEstado) {

        Creditos creditos = creditosRepository.getReferenceById(new CreditoPKId(numCredito,"00000",codAgencia));
        creditos.setIndEstado(indEstado);
        Creditos creditos1 =creditosRepository.save(creditos);
        CreditosDto responseCreditos=mapToDto(creditos1);
        return responseCreditos;
    }


    //Convert Entity into Dto
    private CreditosDto mapToDto(Creditos pr_credito){
        CreditosDto pr_creditoDto =mapper.map(pr_credito, CreditosDto.class);
        return pr_creditoDto;
    }

    // Convert Dto into Entity
    private Creditos mapToEntity(CreditosDto pr_creditoDto)
    {
        Creditos pr_credito =mapper.map(pr_creditoDto, Creditos.class);
        return pr_credito;
    }
}
