package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.domain.Response;
import io.digiservices.ebanking.paylaod.ClientesDto;
import io.digiservices.ebanking.paylaod.ClientesPKId;
import io.digiservices.ebanking.paylaod.ClientesResponse;
import io.digiservices.ebanking.service.ClientesService;
import io.digiservices.ebanking.utils.AppConstants;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

import static io.digiservices.ebanking.controller.CreditosController.getResponse;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/ebanking")
public class ClientesController {

    private ClientesService clientesService;

    public ClientesController(ClientesService clientesService) {
        this.clientesService = clientesService;
    }


    @PostMapping("/addClientes")
    public ResponseEntity<ClientesDto> createClientes(
            @Valid @RequestBody ClientesDto clientesDto)
    {
        return new ResponseEntity<>(clientesService.createClientes(clientesDto), HttpStatus.CREATED);
    }


    @GetMapping("/clientes")
    public ClientesResponse getAllClientes(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir)
    {
        return clientesService.getAllClientes(pageNo, pageSize, sortBy, sortDir);
    }

    @GetMapping("/clientes/{codCliente}/{codEmpresa}")
    public ResponseEntity<ClientesDto> getClientes(
            @PathVariable(name = "codCliente") String codCliente,
            @PathVariable(name = "codEmpresa") String codEmpresa)
    {
        ClientesDto clientesDto=clientesService.getClientes(new ClientesPKId(codCliente,codEmpresa));
        return ResponseEntity.ok(clientesDto);
    }
    @GetMapping("/newClientes/{codCliente}")
    public ResponseEntity<ClientesDto> getNewClientes(
            @PathVariable(name = "codCliente") String codCliente
    )
    {
        ClientesDto clientesDto=clientesService.getNewCliente(codCliente);
        return ResponseEntity.ok(clientesDto);
    }

    @GetMapping("/oldCliente/{codClienteMig}")
    public ResponseEntity<ClientesDto> getOldClientes(
            @PathVariable(name = "codClienteMig") String codClienteMig
    )
    {
        ClientesDto clientesDto=clientesService.getOldCliente(codClienteMig);
        return ResponseEntity.ok(clientesDto);
    }

    @GetMapping("/{codCliente}/infoNewCliente")
    public Boolean existCodCliente(
            @PathVariable(name = "codCliente") String codCliente
    )
    {
        return clientesService.existCodCliente(codCliente);
    }

    @GetMapping("/{codClienteMig}/infoOldCliente")
    public Boolean existCodClienteMig(
            @PathVariable(name = "codClienteMig") String codClienteMig
    )
    {
        return clientesService.existCodClienteMig(codClienteMig);
    }

    @GetMapping("/search")
    public ResponseEntity<Response> searchClientes(@RequestParam("query") String query, HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("clientes",clientesService.searchsClientes(query)), "Membre Trouvé", OK));
    }

    @GetMapping("/{codAgencia}/searchByCodAgencia")
    public ResponseEntity<ClientesDto> searchClientesByCodAgencia(
            @PathVariable(name = "codAgencia") String codAgencia,
            @RequestParam("query") String query){
        return ResponseEntity.ok(clientesService.searchsClientesByCodAgencia(codAgencia,query));
    }

    @GetMapping("/{codCliente}/getInfoClientes")
    public List<Object[]> getInfoClientes(@PathVariable(name = "codCliente") String codCliente)
    {
        return clientesService.getInfoClientes(codCliente);
    }

    @PutMapping("{codCliente}/{COD_EMPRESA}/updateInfoClient")
    public ResponseEntity<ClientesDto> updateClientes(
            @RequestBody ClientesDto clientesDto,
            @PathVariable(name = "codCliente") String codCliente,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA
    )
    {
        return new ResponseEntity<>(clientesService.updateClientes(clientesDto,new ClientesPKId(codCliente,COD_EMPRESA)), HttpStatus.OK);
    }

    @GetMapping("{start_date}/{end_date}/nombreAdhesion")
    public Long getNombreAdhesion(
            @PathVariable(name = "start_date") @DateTimeFormat(pattern = "dd-MM-yyyy") Date start_date,
            @PathVariable(name = "end_date") @DateTimeFormat(pattern = "dd-MM-yyyy") Date end_date)
    {
        return clientesService.getNombreAdhesion(start_date,end_date);
    }

    @GetMapping("{start_date}/{end_date}/{codAgencia}/nombreAdhesionByAgence")
    public Long getNombreAdhesionByAgence(
            @PathVariable(name = "start_date") @DateTimeFormat(pattern = "dd-MM-yyyy") Date start_date,
            @PathVariable(name = "end_date") @DateTimeFormat(pattern = "dd-MM-yyyy") Date end_date,
            @PathVariable(name = "codAgencia") String codAgencia
    )
    {
        return clientesService.getNombreAdhesionByAgencia(start_date,end_date,codAgencia);
    }

    @GetMapping("/{codAgencia}/getNombreAnomalieParAgence")
    public List<Object[]> getNombreAnomalieParAgence(
            @PathVariable(name = "codAgencia") String codAgencia
    )
    {
        return clientesService.getNombreAnomalieParAgence(codAgencia);
    }
}
