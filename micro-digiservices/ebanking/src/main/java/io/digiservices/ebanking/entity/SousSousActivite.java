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
@Table(name = "CL_SUBSUBACT_ECONOMICA",schema = "CL")
public class SousSousActivite {

    @Id
    @Column(name = "COD_SUBSUBACTIV")
    private String id;
    @Column(name = "COD_ACTIVIDAD",nullable = false)
    private String codActividad;
    @Column(name = "COD_SUBACTIV",nullable = false)
    private String codSousActivite;
    private String DES_SUBSUBACTIV;
}
