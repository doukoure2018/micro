package io.digiservices.ebanking.paylaod;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
public class CategorieClientePKId implements Serializable {

    private String COD_EMPRESA;
    private String CAT_CLIENTE;
}
