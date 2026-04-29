package io.digiservices.clients;

import io.digiservices.clients.domain.UpdateTelephoneDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

/**
 * Feign client dedie a la mise a jour du numero de telephone dans SAF.
 * Pointe vers l'endpoint dedie expose par le microservice ebanking.
 *
 * Cree pour le workflow de changement de telephone (ne touche pas a UpdateFicheSignaletiqueDTO existant).
 */
@FeignClient(name = "EBANKING", contextId = "telephoneFeignClient")
public interface TelephoneFeignClient {

    @PutMapping(path = "/ebanking/telephone")
    Map<String, Object> updateTelephone(@RequestBody UpdateTelephoneDTO dto);
}
