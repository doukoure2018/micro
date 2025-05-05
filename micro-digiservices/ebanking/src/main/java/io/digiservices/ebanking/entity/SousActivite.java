package io.digiservices.ebanking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CL_SUBACT_ECONOMICA",schema = "CL")
public class SousActivite {

    @Id
    @Column(name = "COD_SUBACTIV")
    private String id;
    @Column(name = "COD_ACTIVIDAD",nullable = false)
    private String codActividad;
    private String DES_SUBACTIV;
}
