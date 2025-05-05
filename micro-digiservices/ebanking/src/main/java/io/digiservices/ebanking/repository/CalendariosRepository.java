package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Calendarios;
import io.digiservices.ebanking.paylaod.CalendariosPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CalendariosRepository extends JpaRepository<Calendarios, CalendariosPKId> {

    @Query(value = "SELECT  CF.CF_CALENDARIOS.COD_EMPRESA , CF.CF_CALENDARIOS.COD_AGENCIA ,           \n" +
            "CF.CF_CALENDARIOS.COD_SISTEMA , CF.CF_CALENDARIOS.FEC_HOY ,\n" +
            "CF.CF_CALENDARIOS.NOM_DIA ,CF.CF_CALENDARIOS.FEC_ANTERIOR ,          \n" +
            "CF.CF_CALENDARIOS.PRIMER_DIA_MES , CF.CF_CALENDARIOS.PRIMER_HABIL_MES , \n" +
            "CF.CF_CALENDARIOS.ULT_DIA_MES , CF.CF_CALENDARIOS.ULT_HABIL_MES     \n" +
            "FROM CF.CF_CALENDARIOS WHERE ( CF.CF_CALENDARIOS.COD_EMPRESA = '00000' ) and          \n" +
            "( CF.CF_CALENDARIOS.COD_AGENCIA =:codAgencia ) and          \n" +
            "( CF.CF_CALENDARIOS.COD_SISTEMA =:codSystema )  ",nativeQuery = true)
    Calendarios getInfoCalendarios(String codAgencia, String codSystema);


    @Query(value = "SELECT DATEADD ( SS , DATEDIFF ( SS , DATEADD ( DD , 0 , DATEDIFF ( DD , 0 , F.FEC_SERVIDOR ) ) , F.FEC_SERVIDOR ) \n" +
            ", DATEADD ( DD , 0 , DATEDIFF ( DD , 0 , C.FEC_HOY ) ) ) FEC_HOY FROM CF.CF_CALENDARIOS C , ( SELECT GETDATE ( ) FEC_SERVIDOR ) F \n" +
            "WHERE ( COD_EMPRESA ='00000' ) AND ( COD_AGENCIA =:codAgencia ) AND ( COD_SISTEMA =:codSystema ) ",nativeQuery = true)
    Object getCurrenteDate(String codAgencia,String codSystema);
}
