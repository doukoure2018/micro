package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChargesDto {

    private String id;
    private String DES_CARGO;
    private String IND_SEGURO;
    private String IND_AFECTA_TAS_EFECTIVA;
    private String IND_DIFERIBLE;
}
