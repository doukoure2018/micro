package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.domain.CreditoDTO;
import io.digiservices.ebanking.domain.CreditosClienteResponseDTO;
import io.digiservices.ebanking.domain.PlanPagoDTO;
import io.digiservices.ebanking.domain.ResumenPlanPagoDTO;
import io.digiservices.ebanking.dto.CreditRequest;
import io.digiservices.ebanking.dto.CreditResponse;
import io.digiservices.ebanking.dto.RequisitoRequest;
import io.digiservices.ebanking.entity.Creditos;
import io.digiservices.ebanking.entity.ReqCredito;
import io.digiservices.ebanking.exception.BlogAPIException;
import io.digiservices.ebanking.paylaod.CreditoPKId;
import io.digiservices.ebanking.paylaod.CreditosDto;
import io.digiservices.ebanking.paylaod.ReqCreditoPKId;
import io.digiservices.ebanking.repository.CreditosRepository;
import io.digiservices.ebanking.repository.ReqCreditoRepository;
import io.digiservices.ebanking.service.CreditosService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class CreditosServiceImpl implements CreditosService {

    private CreditosRepository creditosRepository;
    private ModelMapper mapper;

    private ReqCreditoRepository reqCreditoRepository;

    private JdbcTemplate jdbcTemplate;

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

    @Override
    public CreditResponse createCredit(CreditRequest request) {
        try {
            // Configuration de l'appel de procédure stockée simplifiée
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("SP_MiseEnPlaceCreditSimple")
                    .withoutProcedureColumnMetaDataAccess() // Avoid metadata lookup
                    .declareParameters(
                            new SqlParameter("COD_AGENCIA", Types.VARCHAR),
                            new SqlParameter("TIP_CREDITO", Types.INTEGER),
                            new SqlParameter("COD_CLIENTE", Types.VARCHAR),
                            new SqlParameter("MON_CREDITO", Types.DECIMAL),
                            new SqlParameter("CANT_CUOTAS", Types.INTEGER),
                            new SqlParameter("COD_USUARIO", Types.VARCHAR),
                            new SqlParameter("COD_ORIGEN", Types.VARCHAR),
                            new SqlParameter("COD_PLAN_INVERSION", Types.VARCHAR),
                            new SqlParameter("COD_PLAZO", Types.VARCHAR),
                            new SqlParameter("COD_ACTIVIDAD", Types.VARCHAR),
                            new SqlParameter("COD_SUBACTIV", Types.VARCHAR),
                            new SqlParameter("COD_SUBSUBACTIVIDAD", Types.VARCHAR),
                            new SqlParameter("COD_TASA_INT", Types.VARCHAR),
                            new SqlParameter("COD_TASA_MORA", Types.VARCHAR),
                            new SqlParameter("TIP_MODALIDAD_COBRO", Types.VARCHAR),
                            new SqlParameter("TIP_INTERES", Types.VARCHAR),
                            new SqlParameter("TIP_CALENDARIO", Types.INTEGER),
                            new SqlParameter("TIP_CUOTA", Types.VARCHAR),
                            new SqlParameter("PLAZO_CREDITO", Types.INTEGER),
                            new SqlParameter("TIP_TASA", Types.VARCHAR),
                            new SqlParameter("TASA_INTERES", Types.DECIMAL),
                            new SqlParameter("TASA_MORA", Types.DECIMAL),
                            new SqlParameter("IND_LINEA", Types.VARCHAR),
                            new SqlParameter("OBSERVACIONES", Types.VARCHAR),
                            new SqlParameter("COD_EJECUTIVO", Types.VARCHAR),
                            new SqlOutParameter("NUM_CREDITO_OUT", Types.INTEGER),
                            new SqlOutParameter("RESULT_MESSAGE", Types.VARCHAR)
                    );

            // Préparation des paramètres
            Map<String, Object> inParams = new HashMap<>();
            inParams.put("COD_AGENCIA", request.getCodAgencia());
            inParams.put("TIP_CREDITO", request.getTipCredito());
            inParams.put("COD_CLIENTE", request.getCodCliente());
            inParams.put("MON_CREDITO", request.getMonCredito());
            inParams.put("CANT_CUOTAS", request.getCantCuotas());
            inParams.put("COD_USUARIO", request.getCodUsuario());
            inParams.put("COD_ORIGEN", request.getCodOrigen());
            inParams.put("COD_PLAN_INVERSION", request.getCodPlanInversion());
            inParams.put("COD_PLAZO", request.getCodPlazo());
            inParams.put("COD_ACTIVIDAD", request.getCodActividad());
            inParams.put("COD_SUBACTIV", request.getCodSubactiv());
            inParams.put("COD_SUBSUBACTIVIDAD", request.getCodSubsubactividad());
            inParams.put("COD_TASA_INT", request.getCodTasaInt());
            inParams.put("COD_TASA_MORA", request.getCodTasaMora());
            inParams.put("TIP_MODALIDAD_COBRO", request.getTipModalidadCobro());
            inParams.put("TIP_INTERES", request.getTipInteres());
            inParams.put("TIP_CALENDARIO", request.getTipCalendario());
            inParams.put("TIP_CUOTA", request.getTipCuota());
            inParams.put("PLAZO_CREDITO", request.getPlazoCredito());
            inParams.put("TIP_TASA", request.getTipTasa());
            inParams.put("TASA_INTERES", request.getTasaInteres());
            inParams.put("TASA_MORA", request.getTasaMora());
            inParams.put("IND_LINEA", request.getIndLinea());
            inParams.put("OBSERVACIONES", request.getObservaciones());
            inParams.put("COD_EJECUTIVO", request.getCodEjecutivo());

            // Exécution de la procédure stockée
            Map<String, Object> result = jdbcCall.execute(inParams);

            Integer numCredito = (Integer) result.get("NUM_CREDITO_OUT");
            String message = (String) result.get("RESULT_MESSAGE");

            if (numCredito != null && numCredito > 0) {
                insertRequisitosWithJPA(numCredito, request.getCodAgencia(), request.getRequisitos());
                return new CreditResponse(numCredito, message, true);
            } else {
                return new CreditResponse(null, message != null ? message : "Erreur inconnue", false);
            }

        } catch (Exception e) {
            return new CreditResponse(null, "Erreur lors de la création du crédit: " + e.getMessage(), false);
        }
    }



    private void insertRequisitosWithJPA(Integer numCredito, String codAgencia, List<RequisitoRequest> requisitos) {
        List<ReqCredito> reqCreditoList = new ArrayList<>();

        for (RequisitoRequest req : requisitos) {
            // Création de la clé composite
            ReqCreditoPKId pkId = new ReqCreditoPKId();
            pkId.setCOD_EMPRESA("00000");
            pkId.setCodAgencia(codAgencia);
            pkId.setNumCredito(numCredito);
            pkId.setCodRequisito(req.getCodRequisito());

            // Création de l'entité ReqCredito
            ReqCredito reqCredito = new ReqCredito();
            reqCredito.setReqCreditoPKId(pkId);
            reqCredito.setIND_ESTADO("S");
            //reqCredito.setIND_OBLIGATORIO(req.getIndObligatorio());
            reqCredito.setIND_OBLIGATORIO("S");
            reqCredito.setFEC_ULT_PRESENTACION(null);

            reqCreditoList.add(reqCredito);
        }

        // Sauvegarde en batch pour de meilleures performances
        reqCreditoRepository.saveAll(reqCreditoList);
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

    /**
     *  Liste des credits et Paiements
     */

    @Override
    public CreditosClienteResponseDTO obtenerCreditosYPlanPagosPorCliente(String codCliente) {
        log.info("Obteniendo créditos y plan de pagos para el cliente: {}", codCliente);

        try {
            // Obtener créditos
            List<Map<String, Object>> creditosData = creditosRepository.obtenerCreditosPorCliente(codCliente);
            log.debug("Datos de créditos obtenidos: {} registros", creditosData.size());

            List<CreditoDTO> creditos = mapearCreditos(creditosData);

            if (creditos.isEmpty()) {
                log.warn("No se encontraron créditos para el cliente: {}", codCliente);
                return CreditosClienteResponseDTO.builder()
                        .codCliente(codCliente)
                        .creditos(List.of())
                        .planPagos(List.of())
                        .resumenes(List.of())
                        .mensaje("No se encontraron créditos para el cliente: " + codCliente)
                        .build();
            }

            // Obtener plan de pagos
            List<Map<String, Object>> planPagosData = creditosRepository.obtenerPlanPagosPorCliente(codCliente);
            log.debug("Datos de plan de pagos obtenidos: {} registros", planPagosData.size());

            // Debug: mostrar las primeras entradas para identificar problemas de tipo
            if (!planPagosData.isEmpty()) {
                Map<String, Object> firstRecord = planPagosData.get(0);
                log.debug("Tipos de datos en primer registro de plan de pagos:");
                for (Map.Entry<String, Object> entry : firstRecord.entrySet()) {
                    Object value = entry.getValue();
                    log.debug("Campo: {}, Tipo: {}, Valor: {}",
                            entry.getKey(),
                            value != null ? value.getClass().getSimpleName() : "null",
                            value);
                }
            }

            List<PlanPagoDTO> planPagos = mapearPlanPagos(planPagosData);

            // Generar resúmenes por crédito
            List<ResumenPlanPagoDTO> resumenes = generarResumenes(planPagos);

            log.info("Información obtenida exitosamente para cliente {}: {} créditos, {} plan de pagos",
                    codCliente, creditos.size(), planPagos.size());

            return CreditosClienteResponseDTO.builder()
                    .codCliente(codCliente)
                    .creditos(creditos)
                    .planPagos(planPagos)
                    .resumenes(resumenes)
                    .mensaje("Información obtenida exitosamente")
                    .build();

        } catch (ClassCastException e) {
            log.error("Error de conversión de tipos para el cliente {}: {}", codCliente, e.getMessage(), e);
            return CreditosClienteResponseDTO.builder()
                    .codCliente(codCliente)
                    .creditos(List.of())
                    .planPagos(List.of())
                    .resumenes(List.of())
                    .mensaje("Error de conversión de datos: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Error al obtener información del cliente {}: {}", codCliente, e.getMessage(), e);
            return CreditosClienteResponseDTO.builder()
                    .codCliente(codCliente)
                    .creditos(List.of())
                    .planPagos(List.of())
                    .resumenes(List.of())
                    .mensaje("Error al obtener información: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public boolean existeClienteConCreditos(String codCliente) {
        try {
            List<Map<String, Object>> creditos = creditosRepository.obtenerCreditosPorCliente(codCliente);
            return !creditos.isEmpty();
        } catch (Exception e) {
            log.error("Error al verificar existencia del cliente {}: {}", codCliente, e.getMessage());
            return false;
        }
    }

    private List<CreditoDTO> mapearCreditos(List<Map<String, Object>> creditosData) {
        return creditosData.stream().map(this::mapearCredito).collect(Collectors.toList());
    }

    private CreditoDTO mapearCredito(Map<String, Object> data) {
        return CreditoDTO.builder()
                .codEmpresa(convertirAString(data.get("COD_EMPRESA")))
                .codAgencia(convertirAString(data.get("COD_AGENCIA")))
                .numCredito(((Number) data.get("NUM_CREDITO")).longValue())
                .tipCredito(data.get("TIP_CREDITO") != null ? ((Number) data.get("TIP_CREDITO")).intValue() : null)
                .codCliente(convertirAString(data.get("COD_CLIENTE")))
                .monCredito((BigDecimal) data.get("MON_CREDITO"))
                .monSaldo((BigDecimal) data.get("MON_SALDO"))
                .monDesembolsado((BigDecimal) data.get("MON_DESEMBOLSADO"))
                .monPagadoPrincipal((BigDecimal) data.get("MON_PAGADO_PRINCIPAL"))
                .monPagadoIntereses((BigDecimal) data.get("MON_PAGADO_INTERESES"))
                .tasaInteres((BigDecimal) data.get("TASA_INTERES"))
                .plazoCredito(data.get("PLAZO_CREDITO") != null ? ((Number) data.get("PLAZO_CREDITO")).intValue() : null)
                .fecApertura(convertirTimestamp((Timestamp) data.get("FEC_APERTURA")))
                .fecVencimiento(convertirTimestamp((Timestamp) data.get("FEC_VENCIMIENTO")))
                .fecCancelacion(convertirTimestamp((Timestamp) data.get("FEC_CANCELACION")))
                .indEstado(convertirAString(data.get("IND_ESTADO")))
                .cantCuotas(data.get("CANT_CUOTAS") != null ? ((Number) data.get("CANT_CUOTAS")).intValue() : null)
                .monCuota((BigDecimal) data.get("MON_CUOTA"))
                .build();
    }

    private List<PlanPagoDTO> mapearPlanPagos(List<Map<String, Object>> planPagosData) {
        return planPagosData.stream().map(data -> {
            try {
                return mapearPlanPago(data);
            } catch (Exception e) {
                log.error("Error al mapear plan de pago. Datos: {}. Error: {}", data, e.getMessage());
                throw new RuntimeException("Error al procesar plan de pago", e);
            }
        }).collect(Collectors.toList());
    }

    private PlanPagoDTO mapearPlanPago(Map<String, Object> data) {
        return PlanPagoDTO.builder()
                .codEmpresa(convertirAString(data.get("COD_EMPRESA")))
                .codAgencia(convertirAString(data.get("COD_AGENCIA")))
                .numCredito(((Number) data.get("NUM_CREDITO")).longValue())
                .numCuota(((Number) data.get("NUM_CUOTA")).intValue())
                .fecCuota(convertirTimestamp((Timestamp) data.get("FEC_CUOTA")))
                .fecRealCuota(convertirTimestamp((Timestamp) data.get("FEC_REAL_CUOTA")))
                .tipCuota(convertirAString(data.get("TIP_CUOTA")))
                .monCuota((BigDecimal) data.get("MON_CUOTA"))
                .monPrincipal((BigDecimal) data.get("MON_PRINCIPAL"))
                .monInt((BigDecimal) data.get("MON_INT"))
                .monComision((BigDecimal) data.get("MON_COMISION"))
                .salPrincipal((BigDecimal) data.get("SAL_PRINCIPAL"))
                .salInt((BigDecimal) data.get("SAL_INT"))
                .salCredito((BigDecimal) data.get("SAL_CREDITO"))
                .fecCancelacion(convertirTimestamp((Timestamp) data.get("FEC_CANCELACION")))
                .indEstado(convertirAString(data.get("IND_ESTADO")))
                .tasInt((BigDecimal) data.get("TAS_INT"))
                .diaInt(data.get("DIA_INT") != null ? ((Number) data.get("DIA_INT")).intValue() : null)
                .diaPendientesInt(data.get("DIA_PENDIENTES_INT") != null ? ((Number) data.get("DIA_PENDIENTES_INT")).intValue() : null)
                .perCuota(convertirAString(data.get("PER_CUOTA")))
                .build();
    }

    private List<ResumenPlanPagoDTO> generarResumenes(List<PlanPagoDTO> planPagos) {
        return planPagos.stream()
                .collect(Collectors.groupingBy(PlanPagoDTO::getNumCredito))
                .entrySet().stream()
                .map(entry -> {
                    Long numCredito = entry.getKey();
                    List<PlanPagoDTO> pagosCredito = entry.getValue();

                    return ResumenPlanPagoDTO.builder()
                            .numCredito(numCredito)
                            .totalEcheances(pagosCredito.size())
                            .totalAPagar(pagosCredito.stream()
                                    .map(PlanPagoDTO::getMonCuota)
                                    .filter(java.util.Objects::nonNull)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add))
                            .totalPrincipal(pagosCredito.stream()
                                    .map(PlanPagoDTO::getMonPrincipal)
                                    .filter(java.util.Objects::nonNull)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add))
                            .totalIntereses(pagosCredito.stream()
                                    .map(PlanPagoDTO::getMonInt)
                                    .filter(java.util.Objects::nonNull)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add))
                            .totalPagado(pagosCredito.stream()
                                    .filter(p -> "C".equals(p.getIndEstado()))
                                    .map(PlanPagoDTO::getMonCuota)
                                    .filter(java.util.Objects::nonNull)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add))
                            .totalRestant(pagosCredito.stream()
                                    .filter(p -> List.of("N", "P").contains(p.getIndEstado()))
                                    .map(PlanPagoDTO::getMonCuota)
                                    .filter(java.util.Objects::nonNull)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add))
                            .echeancesPagadas((int) pagosCredito.stream()
                                    .filter(p -> "C".equals(p.getIndEstado()))
                                    .count())
                            .echeancesRestantes((int) pagosCredito.stream()
                                    .filter(p -> List.of("N", "P").contains(p.getIndEstado()))
                                    .count())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private LocalDateTime convertirTimestamp(Timestamp timestamp) {
        return timestamp != null ? timestamp.toLocalDateTime() : null;
    }

    /**
     * Convierte un objeto a String, manejando casos donde puede ser Character o String
     * @param value El valor a convertir
     * @return String convertido o null si el valor es null
     */
    private String convertirAString(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof String) {
            return ((String) value).trim(); // Trim para remover espacios de CHAR fields
        }
        if (value instanceof Character) {
            return String.valueOf(value);
        }
        return value.toString().trim();
    }
}
