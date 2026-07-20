package io.digiservices.userservice.service;

import io.digiservices.userservice.dto.ReseauImportReport;
import io.digiservices.userservice.dto.ReseauPointVenteDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReseauService {

    /** Import Excel : REMPLACE tout le reseau. Corrige la permutation lon/lat. */
    ReseauImportReport importExcel(MultipartFile file);

    /** Export du reseau au format .xlsx (memes colonnes que l'import). */
    byte[] exportExcel();

    /** Liste des points (pour la carte), filtrable par delegation/type. */
    List<ReseauPointVenteDto> getPoints(String delegation, String type);

    /** Soumission publique d'un nouveau point (lien public, GPS auto) -> EN_ATTENTE. */
    void soumettrePublic(ReseauPointVenteDto dto);

    /** Soumissions publiques en attente de moderation (SUPER_ADMIN). */
    List<ReseauPointVenteDto> getSoumissions();

    /** Valider une soumission (optionnellement completer delegation/agence/point de vente). */
    void validerSoumission(Long id, ReseauPointVenteDto localisation);

    /** Rejeter une soumission. */
    void rejeterSoumission(Long id);
}
