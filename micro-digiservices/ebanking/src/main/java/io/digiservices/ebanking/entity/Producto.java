package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.ProductoPkId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
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
@Table(name = "CF_PRODUCTOS",schema = "CF")
public class Producto {

    @EmbeddedId
    private ProductoPkId productoPkId;
    private String COD_MONEDA;
    private String NOM_PRODUCTO;
    private String DES_PRODUCTO;
    private String REQUISITOS;
    private String COD_COLUMNA_REPORTE;
}
