package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.domain.CreditosClienteResponseDTO;
import io.digiservices.ebanking.repository.SafTertiaryRepository;
import io.digiservices.ebanking.service.CreditosService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Endpoints de synthese DG lus depuis la datasource TERTIARY (dev 10.110.15.2)
 * afin de NE PAS solliciter la base de production. Hors du perimetre protege
 * par cle API ({@code /ebanking/agri/**}) : appel interne service-a-service.
 */
@Slf4j
@RestController
@RequestMapping("/ebanking/saf")
@RequiredArgsConstructor
public class SafSyntheseController {

    private final SafTertiaryRepository safTertiaryRepository;
    private final CreditosService creditosService;

    /** Anciennete : date d'adhesion (FEC_INGRESO). Requete legere ; null si client inconnu. */
    @GetMapping("/adhesion/{codCliente}")
    public Map<String, Object> getAdhesion(@PathVariable("codCliente") String codCliente) {
        List<Map<String, Object>> rows = safTertiaryRepository.obtenerAdhesion(codCliente);
        return rows.isEmpty() ? null : rows.get(0);
    }

    /** Comptes d'epargne du client (soldes). */
    @GetMapping("/comptes/{codCliente}")
    public List<Map<String, Object>> getComptes(@PathVariable("codCliente") String codCliente) {
        return safTertiaryRepository.obtenerComptesByClient(codCliente);
    }

    /** Historique credits + plan de paiements + score de confiance. */
    @GetMapping("/creditos/{codCliente}")
    public CreditosClienteResponseDTO getCreditos(@PathVariable("codCliente") String codCliente) {
        return creditosService.obtenerCreditosYPlanPagosPorClienteSaf(codCliente);
    }
}
