package io.digiservices.ebanking.paylaod;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class TypeCreditPKId implements Serializable {
    private String COD_EMPRESA;
    private Long TIP_CREDITO;
}
