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
@Setter
@Getter
@Entity
@Table(name = "PA_DISTRITOS",schema = "PA")
public class District {

    @Id
    @Column(name = "COD_DISTRITO")
    private String codDistrito;
    private String COD_PAIS;
    @Column(name = "COD_PROVINCIA")
    private String  codProvincia;
    @Column(name = "COD_CANTON")
    private String codCanton;
    private String DES_DISTRITO;
}
