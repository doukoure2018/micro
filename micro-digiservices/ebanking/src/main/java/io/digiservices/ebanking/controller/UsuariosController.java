package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.domain.Response;
import io.digiservices.ebanking.paylaod.SG_USUARIOSDto;
import io.digiservices.ebanking.paylaod.UsariosPKId;
import io.digiservices.ebanking.service.SG_USUARIOSService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static io.digiservices.ebanking.controller.CreditosController.getResponse;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/ebanking")
@RequiredArgsConstructor
@Slf4j
public class UsuariosController {

    private final SG_USUARIOSService sg_usuariosService;


    @GetMapping("/usuarios")
    public boolean existeUsuarios(
            @RequestParam(name = "codEmpresa") String codEmpresa,
            @RequestParam(name = "codAgencia") String codAgencia,
            @RequestParam(name = "codUsuarios") String codUsuarios)
    {
        return sg_usuariosService.existeUsuarios(new UsariosPKId(codEmpresa,codAgencia,codUsuarios));
    }

    @GetMapping("/is_userActive")
    public boolean is_userActive(
            @RequestParam(name = "codEmpresa") String codEmpresa,
            @RequestParam(name = "codAgencia") String codAgencia,
            @RequestParam(name = "codUsuarios") String codUsuarios)
    {
        return sg_usuariosService.isActive_usuarios(new UsariosPKId(codEmpresa,codAgencia,codUsuarios));
    }

    @GetMapping("/{codEmpresa}/{codAgencia}/{codUsuarios}/getUsuarios")
    public ResponseEntity<SG_USUARIOSDto> getUsuarios(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "codUsuarios") String codUsuarios)
    {
        return ResponseEntity.ok(sg_usuariosService.getUsuarios(new UsariosPKId(codEmpresa,codAgencia,codUsuarios)));
    }

    @GetMapping("/{codAgencia}/{codPuesto}/{indActivo}/getListUsuariosByCodAgencia")
    public ResponseEntity<Response> getListUsuariosByCodAgencia(
            @NotNull Authentication authentication,
            @PathVariable(value="codAgencia") String codAgencia,
            @PathVariable(value = "codPuesto") String codPuesto,
            @PathVariable(value = "indActivo") String indActivo,
            HttpServletRequest request
    ){
        return ok(getResponse(request, Map.of("usuarios",sg_usuariosService.getListUsuariosByCodAgencia(codAgencia,codPuesto,indActivo)), "Liste des Points de vente", OK));
    }

    @GetMapping("/{codEmpresa}/{codAgencia}/{codUsuarios}/getActiveUser")
    public String getActiveUser(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "codUsuarios") String codUsuarios)
    {
        return sg_usuariosService.getActiveUser(new UsariosPKId(codEmpresa,codAgencia,codUsuarios));
    }


    @GetMapping("/{codEmpresa}/{codAgencia}/{codUsuarios}/getCodeAgencia")
    public String getCodeAgencia(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "codUsuarios") String codUsuarios)
    {
        return sg_usuariosService.getCodAgencia(new UsariosPKId(codEmpresa,codAgencia,codUsuarios));
    }

    @GetMapping("/{codEmpresa}/{codAgencia}/{codUsuarios}/is_agent")
    public Boolean is_agent(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "codUsuarios") String codUsuarios)
    {
        return sg_usuariosService.is_agent(new UsariosPKId(codEmpresa,codAgencia,codUsuarios));
    }

    @GetMapping("/{codeUser}/isActiveAgent")
    public ResponseEntity<Boolean> isActiveAgent(
            @PathVariable(name = "codeUser") String codeUser)
    {
        log.info("Getting User Information with ID: {}", codeUser);
        return ResponseEntity.ok(sg_usuariosService.getActiveUser(codeUser));
    }

}
