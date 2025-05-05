package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TypeIdDto {

    private TypeIdPKId typeIdPKId;
    private String DES_TIPO_ID;
    private String MASCARA;
    private String IND_LARGO_FIJO;
}
