package io.digiservices.clients.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TypePlazoDto {

    private Long id;
    private String DES_PLAZO;
    private Long PLAZO_MIN;
    private String PLAZO_MAX;
    private String IND_PLAZO;
}
