package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.CategorieClientePKId;
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
@Table(name = "CL_CATEG_CLIENTES",schema = "CL")
public class CategorieCliente {

    @EmbeddedId
    private CategorieClientePKId categorieClientePKId;
    private String DES_CATEGORIA;
}
