package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.domain.CreditosClienteResponseDTO;
import io.digiservices.ebanking.domain.Response;
import io.digiservices.ebanking.dto.CreditRequest;
import io.digiservices.ebanking.dto.CreditResponse;
import io.digiservices.ebanking.paylaod.CreditoPKId;
import io.digiservices.ebanking.paylaod.CreditosDto;
import io.digiservices.ebanking.service.CreditosService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Parameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.time.LocalTime.now;
import static org.apache.logging.log4j.util.Strings.EMPTY;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/ebanking")
@AllArgsConstructor
@Slf4j
public class CreditosController {
    private CreditosService creditosService;

    @PostMapping("/creditos")
    public ResponseEntity<CreditosDto> createCredito(
            @RequestBody CreditosDto pr_creditoDto)
    {
        return new ResponseEntity<>(creditosService.createCreditos(pr_creditoDto), HttpStatus.CREATED);
    }

    @PostMapping("/create")
    public ResponseEntity<CreditResponse> createCredit(@RequestBody CreditRequest request) {
         return  new ResponseEntity<>(creditosService.createCredit(request), CREATED);
    }

//    @PostMapping("/create")
//    public ResponseEntity<Response> createCredit(@NotNull Authentication authentication,
//                                                 @RequestBody CreditRequest request,
//                                                 HttpServletRequest httpRequest) {
//        try {
//            CreditResponse response = creditosService.createCredit(request);
//
//            if (response.isSuccess()) {
//                Map<String, Object> data = Map.of(
//                        "numCredito", response.getNumCredito(),
//                        "message", response.getMessage()
//                );
//                return ResponseEntity.status(HttpStatus.CREATED)
//                        .location(getUri())
//                        .body(getResponse(httpRequest, data,
//                                "Crédit créé avec succès. Numéro: " + response.getNumCredito(), HttpStatus.CREATED));
//            } else {
//                return ResponseEntity.badRequest()
//                        .body(getResponse(httpRequest, Collections.emptyMap(),
//                                response.getMessage(), HttpStatus.BAD_REQUEST));
//            }
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(getResponse(httpRequest, Collections.emptyMap(),
//                            "Erreur lors de la création du crédit: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
//        }
//    }


    @GetMapping("/{usuarios}/credit")
    public List<CreditosDto> getAllCreditos(@PathVariable(value = "usuarios") String usuarios)
    {
        return creditosService.getAllCreditosByUsuarios(usuarios);
    }


    @GetMapping("/creditos/{codCliente}")
    public ResponseEntity<List<CreditosDto>> getAllCreditosByCodCliente(@PathVariable(name = "codCliente") String codCliente)
    {
        return ResponseEntity.ok(creditosService.getAllCreditosByClientes(codCliente));
    }


    @GetMapping("/{codAgencia}/allRetard")
    public List<Object[]> getAllRetards(@PathVariable(name = "codAgencia") String codAgencia)
    {
        return creditosService.getAllRetards(codAgencia);
    }

    @GetMapping("/nombreCreditos/{codCliente}")
    public long getNombreCreditByClientes(@PathVariable(name = "codCliente") String codCliente)
    {
        return creditosService.getNombreCreditByClientes(codCliente);
    }

    @GetMapping("/cumulCredito/{codCliente}")
    public long getCumulCreditoByCodClientes(
            @PathVariable(name = "codCliente") String codCliente)
    {
        return creditosService.getCumulCreditByClientes(codCliente);
    }

    @GetMapping("/{numCredito}/{COD_EMPRESA}/{codAgencia}/credito")
    public ResponseEntity<CreditosDto> getCredito(
            @PathVariable(name = "numCredito") Long numCredito,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "codAgencia") String codAgencia)
    {
        return ResponseEntity.ok(creditosService.getCreditos(new CreditoPKId(numCredito,COD_EMPRESA,codAgencia)));
    }

    @GetMapping("/{codAgencia}/{indEstado}/getListCreditoByAgence")
    public ResponseEntity<List<CreditosDto>> getListCreditoByAgence(
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "indEstado") String indEstado
    )
    {
        return ResponseEntity.ok(creditosService.getListCreditoByCodAgencia(codAgencia,indEstado));
    }

    @GetMapping("/{numCredito}/getCreditoByNumCredito")
    public ResponseEntity<CreditosDto> getCreditoByNumCredito(
            @PathVariable(value = "numCredito") Long numCredito
    )
    {
        return ResponseEntity.ok(creditosService.getCreditoParNum(numCredito));
    }


    @PutMapping("/{numCredito}/updateCredito")
    public ResponseEntity<CreditosDto> updateCreditos(
            @RequestBody CreditosDto pr_creditoDto,
            @PathVariable(name = "numCredito") Long numCredito
    )
    {
        return new ResponseEntity<>(creditosService.updateCredit(pr_creditoDto,numCredito),HttpStatus.OK);
    }

    @GetMapping("/{codCliente}/getOngoingCredito")
    public ResponseEntity<List<CreditosDto>> getOngoingCredito(
            @PathVariable(value = "codCliente") String codCliente
    )
    {
        return ResponseEntity.ok(creditosService.getOngoingCreditosByCodCliente(codCliente,"D"));
    }

    @PutMapping("/{numCredito}/{codAgencia}/{indEstado}/updateIndEstado")
    public ResponseEntity<CreditosDto> updateIndEstadoCredito(
            @PathVariable(value = "numCredito") Long numCredito,
            @PathVariable(value = "indEstado") String indEstado,
            @PathVariable(value = "codAgencia") String codAgencia
    )
    {
        return new ResponseEntity<>(creditosService.updateInstado(numCredito,codAgencia,indEstado),HttpStatus.OK);
    }

    public static Response getResponse(HttpServletRequest request, Map<?, ?> data, String message, HttpStatus status){
        return new Response(now().toString(), status.value(), request.getRequestURI(), status, message, EMPTY, data);
    }


    /**
     *  Liste des credits par CodClientes et liste des paiements
     * @param codCliente
     * @return
     */
    @GetMapping("/creditos/cliente/{codCliente}")
    public ResponseEntity<CreditosClienteResponseDTO> obtenerCreditosYPlanPagosPorCliente(
            @PathVariable(name = "codCliente") String codCliente) {

        log.info("Demande reçue pour obtenir les crédits du client: {}", codCliente);

        try {
            CreditosClienteResponseDTO response = creditosService.obtenerCreditosYPlanPagosPorCliente(codCliente);

            if (response.getCreditos().isEmpty()) {
                log.warn("No se encontraron créditos para el cliente: {}", codCliente);
                return ResponseEntity.notFound().build();
            }

            log.info("Crédits obtenus avec succès pour le client: {}. Total créditos: {}",
                    codCliente, response.getCreditos().size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error al procesar solicitud para el cliente {}: {}", codCliente, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(CreditosClienteResponseDTO.builder()
                            .codCliente(codCliente)
                            .mensaje("Error interno del servidor: " + e.getMessage())
                            .build());
        }
    }

}
