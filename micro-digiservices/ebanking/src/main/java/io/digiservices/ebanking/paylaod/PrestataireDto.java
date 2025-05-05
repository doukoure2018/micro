package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PrestataireDto {

    private PrestatairePKId prestatairePKId;
    private String DES_PROVEEDOR;
}
