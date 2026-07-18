package io.digiservices.clients;

import io.digiservices.clients.domain.*;
import io.digiservices.clients.agri.FarmerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.CREATED;

@FeignClient("EBANKING")
public interface EbankingClient {

    @GetMapping(path = "/ebanking/clientes/{codCliente}/00000")
    ClientesDto getClientes(
                    @PathVariable(name = "codCliente") String codCliente);


    @GetMapping(path = "/ebanking/typePlazo")
    List<TypePlazoDto> getAllTypePlazo();


    @GetMapping(path = "/ebanking/typeCredito/{COD_EMPRESA}/{TIP_CREDITO}")
    TypeCreditDto getTypeCredito(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "TIP_CREDITO") Long TIP_CREDITO);


    @GetMapping(path = "/ebanking/nombreCreditos/{codCliente}")
     long getNombreCreditByClientes(@PathVariable(name = "codCliente") String codCliente);


    @GetMapping("/ebanking/cumulCredito/{codCliente}")
     long getCumulCreditoByCodClientes(
            @PathVariable(name = "codCliente") String codCliente);




    @GetMapping(path = "/ebanking/inversion")
    List<InversionDto> getAllInversion();


    @GetMapping("/ebanking/activida")
    List<ActividaDto> getAllActivida();

    @GetMapping("/ebanking/getInfoActivida/{Id}")
    ActividaDto getInfoActivida(
            @PathVariable(name = "Id") String Id);

    @GetMapping(path = "/ebanking/sousActivite")
     List<SousActiviteDto> getAllSousActivite();

    @GetMapping(path = "/ebanking/sousSousActivite")
    List<SousSousActiviteDto> getAllSousSousActivite();

    @GetMapping(path = "/ebanking/requisitos")
     List<RequisitoDto> getAllRequisito();


    @GetMapping(path = "/ebanking/origineFond")
    List<OrigineFondDto> getAllOrigineFond();

    @PostMapping(path = "/ebanking/create")
    CreditResponse createCredit(@RequestBody CreditRequest creditRequest);


    @GetMapping(path = "/ebanking/getUsuarios/{codEmpresa}/{codAgencia}/{codUsuarios}")
    SG_USUARIOSDto getUsuarios(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "codUsuarios") String codUsuarios);

    @GetMapping(path = "/ebanking/creditos/{codCliente}")
     List<CreditosDto> getAllCreditosByCodCliente(@PathVariable(name = "codCliente") String codCliente);



    @GetMapping(path = "/ebanking/planPagos/{numCredito}")
     List<PlanPagosDto> getAllPlanPagosByCreditos(@PathVariable(name = "numCredito") Long numCredito);



    @GetMapping(path = "/ebanking/creditos/cliente/{codCliente}")
    CreditosClienteResponseDTO obtenerCreditosYPlanPagosPorCliente(
            @PathVariable(name = "codCliente") String codCliente);

    @GetMapping("/ebanking/search")
    ClientesDto searchClientes(@RequestParam("query") String query);


    @GetMapping(path = "/ebanking/offLine/getListUsuariosByCodAgencia/{codAgencia}/{codPuesto}/{indActivo}")
    List<SG_USUARIOSDto> getListUsuariosByCodAgenciaOffLine(
            @PathVariable(value="codAgencia") String codAgencia,
            @PathVariable(value = "codPuesto") String codPuesto,
            @PathVariable(value = "indActivo") String indActivo
    );


    @PostMapping(path ="/ebanking/reconciliation/check")
     ReconciliationResultDTO checkReconciliation(
            @RequestParam(value = "codeAgence") String codeAgence,
            @RequestParam(value = "dateDebut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(value = "dateFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin);



    @PostMapping(path ="/ebanking/reconciliationcompte/check")
    ReconciliationResultDTO checkReconciliationCompte(
            @RequestParam(value = "codeAgence") String codeAgence,
            @RequestParam(value = "dateDebut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(value = "dateFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin);

    @GetMapping(path = "/ebanking/fiche-signaletique/{codCliente}")
    Map<String, Object> getFicheSignaletique(@PathVariable("codCliente") String codCliente);

    @PutMapping(path = "/ebanking/fiche-signaletique")
    Map<String, Object> updateFicheSignaletique(@RequestBody UpdateFicheSignaletiqueDTO dto);

    @GetMapping(path = "/ebanking/fiche-signaletique-solde/{codCliente}")
    ResponseEntity<?> getFicheSignaletiqueWithSolde(@PathVariable(name = "codCliente") String codCliente);


    // Synthese DG : lectures via la datasource SAF tertiary (dev), hors base de production
    // et hors perimetre protege par cle API (/ebanking/agri/**).
    @GetMapping(path = "/ebanking/saf/adhesion/{codCliente}")
    Map<String, Object> getFarmerInfo(@PathVariable(name = "codCliente") String codCliente);

    @GetMapping(path = "/ebanking/saf/comptes/{codCliente}")
    List<Map<String, Object>> getComptesByClient(@PathVariable(name = "codCliente") String codCliente);

    @GetMapping(path = "/ebanking/saf/creditos/{codCliente}")
    CreditosClienteResponseDTO getCreditosSaf(@PathVariable(name = "codCliente") String codCliente);



























}