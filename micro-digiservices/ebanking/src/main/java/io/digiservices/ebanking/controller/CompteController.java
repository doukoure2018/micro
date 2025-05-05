package io.digiservices.ebanking.controller;
import io.digiservices.ebanking.paylaod.CompteDto;
import io.digiservices.ebanking.paylaod.ComptePKId;
import io.digiservices.ebanking.service.CompteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ebanking")
public class CompteController {

    private CompteService compteService;

    public CompteController(CompteService compteService) {
        this.compteService = compteService;
    }
    @PostMapping("/ouvrirCompte")
    public ResponseEntity<CompteDto> createCompte(@RequestBody CompteDto compteDto)
    {
        return  new ResponseEntity<>(compteService.createCompte(compteDto), HttpStatus.CREATED);
    }



    @GetMapping("/{codEmpress}/{numCuenta}/clientes")
    public ResponseEntity<CompteDto> getInfoClientes(
            @PathVariable(name = "codEmpress") String codEmpress,
            @PathVariable(name = "numCuenta") String numCuenta)
    {
        return ResponseEntity.ok(compteService.getInfoClientes(new ComptePKId(codEmpress,numCuenta)));
    }


    @GetMapping("/{codClientes}/comptes")
    public ResponseEntity<List<CompteDto>> getComptesByClient(@PathVariable(name = "codClientes") String codClientes)
    {
        return ResponseEntity.ok(compteService.getComptesByClient(codClientes));
    }
    @GetMapping("/{codClientes}/{codCategoria}/{codProducto}/infoCompte")
    public ResponseEntity<CompteDto> getInfoCompte(
            @PathVariable(name = "codClientes") String codClientes,
            @PathVariable(name = "codCategoria") String codCategoria,
            @PathVariable(name = "codProducto") String codProducto
    )
    {
        return ResponseEntity.ok(compteService.getCompte(codClientes,codCategoria,codProducto));
    }


    @GetMapping("/{codEmpresa}/{numCuenta}/infoClientesByNum")
    public ResponseEntity<CompteDto> getInfoCompteByNumCompte(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "numCuenta") String numCuenta)
    {
        return ResponseEntity.ok(compteService.getInfoCompteByNumCompte(new ComptePKId(codEmpresa,numCuenta)));
    }

//    @GetMapping("/{codEmpresa}/{numCuenta}/getInstanceCompte")
//    public List<Object> getInstancaCompte(
//            @PathVariable(name = "codEmpresa") String codEmpresa,
//            @PathVariable(name = "numCuenta") String numCuenta
//    )
//    {
//        return compteService.getInstanceCompte(codEmpresa,numCuenta);
//    }

    @PutMapping("/{codEmpresa}/{numCuenta}/updateCompte")
    public ResponseEntity<CompteDto> updateCompte(
            @RequestBody CompteDto compteDto,
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "numCuenta") String numCuenta
    )
    {
        return new ResponseEntity<>(compteService.updateCompte(compteDto,new ComptePKId(codEmpresa,numCuenta)), HttpStatus.OK);
    }

    @GetMapping("/{codClientes}/{codProducto}/getInfoSoldeByProd")
    public ResponseEntity<CompteDto> getInfoSoldeByProd(
            @PathVariable(name = "codClientes") String codClientes,
            @PathVariable(name = "codProducto") String codProducto
    )
    {
        return ResponseEntity.ok(compteService.getInfoSoldeDisponibleByProd(codClientes,codProducto));
    }


    @GetMapping("/{numCuenta}/getInfoNumCompte")
    public ResponseEntity<CompteDto> getInfoCompteNumCompte(
            @PathVariable(name = "numCuenta") String numCuenta
    )
    {
        return ResponseEntity.ok(compteService.getInfoNumCompte(numCuenta));
    }


}
