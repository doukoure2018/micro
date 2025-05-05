package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Systema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SystemaRepository extends JpaRepository<Systema,String> {

    @Query(value = "SELECT  CF.CF_SISTEMAS.COD_SISTEMA ,           \n" +
            "CF.CF_SISTEMAS.DES_SISTEMA ,           \n" +
            "CF.CF_SISTEMAS.IND_ESTADO     \n" +
            "FROM CF.CF_SISTEMAS   \n" +
            "WHERE ( CF.CF_SISTEMAS.COD_SISTEMA = :codSystema ) ",nativeQuery = true)
    List<Object[]> getInfoSystema(String codSystema);
}
