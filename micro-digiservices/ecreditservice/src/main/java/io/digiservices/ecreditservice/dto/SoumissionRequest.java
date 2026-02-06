package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SoumissionRequest {

    @NotNull(message = "L'ID de l'analyse est obligatoire")
    private Long analyseId;

    private Boolean forcerSoumission;

    private List<PersonneCautionInput> personnesCaution;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PersonneCautionInput {
        private String nom;
        private String prenom;
        private String telephone;
        private String activite;
        private Long age;
        private String profession;
    }
}
