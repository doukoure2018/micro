package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.SG_USUARIOS;
import io.digiservices.ebanking.paylaod.UsariosPKId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<SG_USUARIOS, UsariosPKId> {

    List<SG_USUARIOS> findByUsariosPKIdCodAgenciaAndCodPuestoAndIndActivo(String codAgencia, String codPuesto, String indActivo);

    boolean existsByUsariosPKIdCodUsuarios(String codUsuario);

}
