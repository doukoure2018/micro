package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.ArreteCaisseDto;
import io.digiservices.ecreditservice.service.ArreteCaisseService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Endpoints publics (sans authentification) pour l'integration Power BI.
 */
@RestController
@RequestMapping("/ecredit/public/arrete-caisse")
@RequiredArgsConstructor
@Slf4j
public class PublicArreteCaisseResource {

    private final ArreteCaisseService arreteCaisseService;

    /**
     * Dernier arrete de caisse par point de vente - accessible par Power BI sans JWT.
     */
    @GetMapping("/latest")
    public ResponseEntity<Response> getLatestByPointvente(HttpServletRequest request) {
        log.info("API PUBLIC: Recuperation derniers arretes par point de vente (Power BI)");
        List<ArreteCaisseDto> arretes = arreteCaisseService.findLatestByPointvente();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "arretes", arretes,
                "total", arretes.size()
        ), "Derniers arretes recuperes", OK));
    }
}
