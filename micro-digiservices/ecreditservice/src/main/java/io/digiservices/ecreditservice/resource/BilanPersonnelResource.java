package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.BilanPersonnel;
import io.digiservices.ecreditservice.dto.Entreprise;
import io.digiservices.ecreditservice.service.BilanPersonnelService;
import io.digiservices.ecreditservice.service.EntrepriseService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.ResponseEntity.created;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
public class BilanPersonnelResource {

    private final BilanPersonnelService bilanPersonnelService;

    @PostMapping("/addBillanPersonnel")
    public ResponseEntity<Response> registerBilanPersonnel(@RequestBody BilanPersonnel bilanPersonnel, HttpServletRequest request) {
        return created(getUri()).body(getResponse(request, Map.of("bilanPersonnel", bilanPersonnelService.saveBilanPersonnel(bilanPersonnel.getPromoteurId(), bilanPersonnel)), "Bilan Personnel Created Success", CREATED));
    }

    private URI getUri() {
        return URI.create("/bilanPersonnel/bilanPersonnelId");
    }
}
