package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SerieDto {

    private SeriePKId seriePKId;
    private String DES_SERIE;
    private Long VAL_SIGUIENTE;
}
