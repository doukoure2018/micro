package io.digiservices.ebanking.service;

import io.digiservices.ebanking.dto.FicheSignaletiqueResponseDTO;
import io.digiservices.ebanking.dto.UpdateFicheSignaletiqueDTO;

import java.util.Map;

public interface FicheSignaletiqueService {
     Map<String, Object> updateFicheSignaletique(UpdateFicheSignaletiqueDTO dto);
     FicheSignaletiqueResponseDTO getFicheSignaletique(String codCliente);

     /**
      * Récupère la fiche signalétique complète d'un client pour une entreprise spécifique
      * @param codEmpresa Le code de l'entreprise
      * @param codCliente Le code du client
      * @return La fiche signalétique ou null si le client n'existe pas
      */
     FicheSignaletiqueResponseDTO getFicheSignaletique(String codEmpresa, String codCliente);
}
