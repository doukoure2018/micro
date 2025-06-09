package io.digiservices.clients.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreditRequest {
    private String codAgencia;
    private Integer tipCredito;
    private String codCliente;
    private BigDecimal monCredito;
    private Integer cantCuotas;
    private String codUsuario;
    private String codOrigen;
    private String codPlanInversion;
    private String codPlazo;
    private String codActividad;
    private String codSubactiv;
    private String codSubsubactividad;
    private String codTasaInt;
    private String codTasaMora;
    private String tipModalidadCobro;
    private String tipInteres;
    private Integer tipCalendario;
    private String tipCuota;
    private Integer plazoCredito;
    private String tipTasa;
    private BigDecimal tasaInteres;
    private BigDecimal tasaMora;
    private String indLinea;
    private String observaciones;
    private String codEjecutivo;
    private List<RequisitoRequest> requisitos;
}

