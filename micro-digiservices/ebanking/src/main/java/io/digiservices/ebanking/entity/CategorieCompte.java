package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.CategorieComptePKId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
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
@Table(name = "CC_CATEG_CUENTA",schema = "CC")
public class CategorieCompte {

    @EmbeddedId
    private CategorieComptePKId categorieComptePKId;
    private String DES_CATEGORIA;
    private String IND_FRE_CAL_INT;
    private String IND_FRE_CAP_INT;
}
