package io.digiservices.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentDisponibilityDto {
    private Long userId;
    private Long pointVenteId;
    private Boolean isActive;
    private Long currentPs;
    private LocalDateTime rotationDate;
    private String message;

    // Constructeur pour réponse simple
    public AgentDisponibilityDto(Long userId, Long pointVenteId, Boolean isActive) {
        this.userId = userId;
        this.pointVenteId = pointVenteId;
        this.isActive = isActive;
    }
}