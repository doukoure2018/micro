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
@Table(name = "CF_SISTEMAS",schema = "CF")
public class Systema {

    @Id
    @Column(name = "COD_SISTEMA")
    private String codSystema;
    private String DES_SISTEMA;
    private String IND_ESTADO;
}
