package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorizeSalaireDto {
    private Long id;
    private Boolean isAuthorized;
    private String message;
    private Long authorizedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}