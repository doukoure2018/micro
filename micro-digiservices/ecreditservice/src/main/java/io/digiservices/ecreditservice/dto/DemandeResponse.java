package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandeResponse {
    private Long demandeId;
    private String message;
    private boolean success;
}