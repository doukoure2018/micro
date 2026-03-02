package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PersonneCautionRequest {

    private List<PersonneCautionInput> personnesCaution;

    @Data
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
        private String adresseComplete;
        private String descriptionActivite;
    }
}
