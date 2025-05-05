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
@Table(name = "CL_ACTIVIDAD_ECONOMICA",schema = "CL")
public class Activida {

    @Id
    @Column(name = "COD_ACTIVIDAD")
    private String id;
    private String DES_ACTIVIDAD;
}
