package io.digiservices.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Point de vente geolocalise du reseau. latitude/longitude en WGS84
 * (deja corriges de la permutation des colonnes de l'Excel a l'import).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReseauPointVenteDto {
    private Long id;
    private String delegation;
    private String agence;
    private String pointVente;
    private String nom;
    private String contact;
    private String type;
    private Double latitude;
    private Double longitude;
}
