package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.ReqCredito;
import io.digiservices.ebanking.paylaod.ReqCreditoPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReqCreditoRepository extends JpaRepository<ReqCredito, ReqCreditoPKId> {
    @Query("SELECT r FROM ReqCredito r WHERE r.reqCreditoPKId.COD_EMPRESA = :codEmpresa " +
            "AND r.reqCreditoPKId.codAgencia = :codAgencia " +
            "AND r.reqCreditoPKId.numCredito = :numCredito")
    List<ReqCredito> findByCredito(@Param("codEmpresa") String codEmpresa,
                                   @Param("codAgencia") String codAgencia,
                                   @Param("numCredito") Integer numCredito);

    @Query("SELECT r FROM ReqCredito r WHERE r.reqCreditoPKId.COD_EMPRESA = :codEmpresa " +
            "AND r.reqCreditoPKId.codAgencia = :codAgencia " +
            "AND r.reqCreditoPKId.numCredito = :numCredito " +
            "AND r.reqCreditoPKId.codRequisito = :codRequisito")
    ReqCredito findByIdComplete(@Param("codEmpresa") String codEmpresa,
                                @Param("codAgencia") String codAgencia,
                                @Param("numCredito") Integer numCredito,
                                @Param("codRequisito") String codRequisito);
}
