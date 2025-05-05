package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategorieCompteDto {

    private CategorieComptePKId categorieComptePKId;
    private String DES_CATEGORIA;
    private String IND_FRE_CAL_INT;
    private String IND_FRE_CAP_INT;
}
