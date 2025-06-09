package io.digiservices.ebanking.entity;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class SousSousActiviteId implements Serializable {
    private String codActividad;
    private String codSousActivite;
    private String id; // COD_SUBSUBACTIV
}