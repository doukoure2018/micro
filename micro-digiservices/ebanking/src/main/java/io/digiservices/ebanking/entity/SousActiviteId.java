package io.digiservices.ebanking.entity;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class SousActiviteId implements Serializable {
    private String codActividad;
    private String id;
}