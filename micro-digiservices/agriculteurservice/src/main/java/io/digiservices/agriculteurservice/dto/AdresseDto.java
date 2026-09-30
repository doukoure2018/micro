package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Adresse déclarée d'un membre. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdresseDto {

    private String type;
    private String detail;
    private String province;
    private String prefecture;
    private String district;
}
