package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategorieStockDto {

    private Long id;
    private String libele;
    private String description;
    private boolean actif;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
