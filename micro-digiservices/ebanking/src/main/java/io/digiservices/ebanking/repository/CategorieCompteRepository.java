package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.CategorieCompte;
import io.digiservices.ebanking.paylaod.CategorieComptePKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategorieCompteRepository extends JpaRepository<CategorieCompte, CategorieComptePKId> {

    @Query("SELECT c.categorieComptePKId.codEmpresa, " +
            "c.categorieComptePKId.codCategoria, " +
            "c.DES_CATEGORIA " +
            "FROM CategorieCompte c")
    List<Object[]> getListCategorieProduct();

}
