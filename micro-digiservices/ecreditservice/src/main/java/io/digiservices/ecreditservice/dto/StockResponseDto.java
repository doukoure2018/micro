package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockResponseDto {
    private Long idCmd;
    private String numeroCommande;
    private Long idUser;
    private String service;
    private String detailBonCommande;
    private Long pointventeId;
    private String pointventeLibele;
    private Long agenceId;
    private String agenceLibele;
    private Long delegationId;
    private String delegationLibele;
    private Long categorieId;
    private String categorieLibele;
    private String status;
    private String motif;
    private Long traitePar;
    private String observations;
    private String username;
    private String userFullName;
    private String stateValidation;

    private Integer qte;
    
    // Nouveaux champs pour la suggestion de quantité
    private Integer qteActuelle;
    private Integer qteSuggeree;
    private String motifQte;
    private Long suggerePar;
    private String suggereParFullName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateCreation;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateTraitement;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateSuggestion;
    
    /**
     * Indique si une suggestion de quantité a été faite
     */
    public boolean hasSuggestion() {
        return qteSuggeree != null;
    }
    
    /**
     * Indique si la quantité suggérée est différente de la quantité actuelle
     */
    public boolean hasQuantityChange() {
        return qteSuggeree != null && qteActuelle != null && !qteSuggeree.equals(qteActuelle);
    }
}
