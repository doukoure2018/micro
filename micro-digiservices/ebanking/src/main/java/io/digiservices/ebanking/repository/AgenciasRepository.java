package io.digiservices.ebanking.repository;
import io.digiservices.ebanking.entity.Agencias;
import io.digiservices.ebanking.paylaod.AgenciasPkId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgenciasRepository extends JpaRepository<Agencias, AgenciasPkId> {

}
