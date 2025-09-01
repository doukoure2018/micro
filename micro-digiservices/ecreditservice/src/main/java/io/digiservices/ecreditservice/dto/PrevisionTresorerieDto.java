package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrevisionTresorerieDto {
    private Long id;
    private Long dossierId;
    private Integer numeroMois;

    // Soldes
    private BigDecimal soldeDebut;
    private BigDecimal soldeFin;

    // Totaux
    private BigDecimal totalEncaissements;
    private BigDecimal totalDecaissements;
    private BigDecimal excedentDeficit;
    private LocalDateTime dateCreation;

    // Détail des lignes (optionnel, pour affichage détaillé)
    private List<LigneEncaissementDto> lignesEncaissement;
    private List<LigneDecaissementDto> lignesDecaissement;

    // Calculs additionnels
    private BigDecimal disponibleEnCaisse; // soldeDebut + totalEncaissements
    private BigDecimal tauxCouverture; // excedentDeficit / remboursementMensuel
}