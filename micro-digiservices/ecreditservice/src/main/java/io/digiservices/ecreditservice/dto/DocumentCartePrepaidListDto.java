package io.digiservices.ecreditservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentCartePrepaidListDto {
    @NotEmpty(message = "La liste des documents ne peut pas être vide")
    @Valid
    private List<DocumentCartePrepaidDto> documents;
}