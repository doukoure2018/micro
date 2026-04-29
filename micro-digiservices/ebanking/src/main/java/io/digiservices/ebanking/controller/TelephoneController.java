package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.dto.UpdateTelephoneDTO;
import io.digiservices.ebanking.exception.ApiException;
import io.digiservices.ebanking.service.TelephoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller dedie a la mise a jour du seul numero de telephone dans SAF.
 * Endpoint distinct de /ebanking/fiche-signaletique pour ne pas impacter le flux existant.
 *
 * Appele par ecreditservice apres validation du workflow d'autorisation
 * (AGENT_CREDIT cree -> DA approuve -> AGENT_CREDIT clique "Valider SAF").
 */
@RestController
@RequestMapping("/ebanking")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class TelephoneController {

    private final TelephoneService telephoneService;

    @PutMapping("/telephone")
    public ResponseEntity<Map<String, Object>> updateTelephone(@Valid @RequestBody UpdateTelephoneDTO dto) {
        log.info("Demande de mise a jour telephone - Client: {}", dto.getCodCliente());

        try {
            Map<String, Object> result = telephoneService.updateTelephone(dto);
            return ResponseEntity.ok(result);

        } catch (ApiException e) {
            log.error("Erreur API lors de la mise a jour telephone - Client: {}: {}",
                    dto.getCodCliente(), e.getMessage());
            Map<String, Object> err = new HashMap<>();
            err.put("code", -1);
            err.put("message", e.getMessage());
            err.put("codCliente", dto.getCodCliente());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);

        } catch (Exception e) {
            log.error("Erreur inattendue lors de la mise a jour telephone - Client: {}",
                    dto.getCodCliente(), e);
            Map<String, Object> err = new HashMap<>();
            err.put("code", -99);
            err.put("message", "Erreur inattendue: " + e.getMessage());
            err.put("codCliente", dto.getCodCliente());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }
}
