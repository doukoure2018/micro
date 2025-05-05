package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Clientes;
import io.digiservices.ebanking.paylaod.ClientesPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ClientesRepository extends JpaRepository<Clientes, ClientesPKId> {

    Optional<Clientes> findByClientesPKIdCodCliente(String codCliente); // le nouveau code membre
    Optional<Clientes> findByCodClienteMig(String codClienteMig);  // le code membre
    boolean existsByClientesPKIdCodCliente(String codCliente);

    boolean existsByCodClienteMig(String codClienteMig);

    @Query(value = "SELECT * FROM CL.CL_CLIENTES c WHERE " +
            "c.COD_CLIENTE LIKE CONCAT('%',:query, '%')" +
            "Or c.COD_CLIENTE_MIG LIKE CONCAT('%', :query, '%')",nativeQuery = true)
    List<Clientes> searchClientesSQL(String query);




    Clientes findByCodAgenciaAndClientesPKIdCodCliente(String codAgencia,String query);

    @Query(value = "SELECT c.NOM_CLIENTE, d.COD_DIRECCION, d.DET_DIRECCION, c.CAT_CLIENTE " +
            "FROM CL.CL_CLIENTES c " +
            "JOIN CL.CL_DIR_CLIENTES d ON c.COD_EMPRESA = d.COD_EMPRESA " +
            "AND c.COD_CLIENTE = d.COD_CLIENTE " +
            "WHERE c.COD_EMPRESA = '00000' " +
            "AND c.COD_CLIENTE = :codCliente", nativeQuery = true)
    List<Object[]> getInfoClientes(String codCliente);


    @Query(value = "SELECT COUNT(*) " +
            "FROM CL.CL_CLIENTES " +
            "WHERE FEC_INGRESO BETWEEN :start_date AND :end_date", nativeQuery = true)
    Long getNombreAdhesionWithinDates(Date start_date, Date end_date);


    @Query(value = "SELECT COUNT(*) " +
            "FROM CL.CL_CLIENTES " +
            "WHERE COD_AGENCIA = :codAgencia " +
            "AND FEC_INGRESO BETWEEN :start_date AND :end_date", nativeQuery = true)
    Long getNombreAdhesionWithinDatesByAgence(Date start_date, Date end_date, String codAgencia);



    @Query(value = "SELECT c.COD_AGENCIA, COUNT(*) AS nb_anomalies " +
            "FROM CL.CL_CLIENTES c " +
            "LEFT JOIN CL.CL_PERSONAS_FISICAS pf ON pf.COD_CLIENTE = c.COD_CLIENTE " +
            "LEFT JOIN CL.CL_ID_CLIENTES id ON id.COD_CLIENTE = c.COD_CLIENTE " +
            "LEFT JOIN CL.CL_DATOS_ASOCIADO da ON da.COD_CLIENTE = c.COD_CLIENTE " +
            "WHERE c.COD_AGENCIA = :codAgencia " +
            "AND (" +
            "  (c.TEL_PRINCIPAL IS NULL OR c.TEL_PRINCIPAL NOT LIKE '[0-9]{9}') " +
            "  OR da.FECH_NACIMIENTO > GETDATE() " +
            "  OR pf.COD_PROFESION NOT IN (SELECT COD_PROFESION FROM CL.CL_PERSONAS_FISICAS) " +
            "  OR id.NUM_ID IS NULL " +
            "  OR id.FEC_VENCIM IS NULL " +
            "  OR id.COD_CLIENTE IS NULL " +
            "  OR da.COD_CLIENTE IS NULL" +
            ") " +
            "GROUP BY c.COD_AGENCIA", nativeQuery = true)
    List<Object[]> getNombreAnomalies(String codAgencia);


}
