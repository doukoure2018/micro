package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategorieClienteDto {

    private CategorieClientePKId categorieClientePKId;
    private String DES_CATEGORIA;
}
