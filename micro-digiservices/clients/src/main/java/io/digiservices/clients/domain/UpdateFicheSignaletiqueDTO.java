package io.digiservices.clients.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFicheSignaletiqueDTO {


    private String telPrincipal;

    private String codClientes;

    private String telOtro;

    private String nomCliente;

    private String nomClient;

    private String prenomClient;

    private LocalDate fecVencim;

    private LocalDate fechNacimiento;

    private String lieuxNaiss;

    private String nationalite;

    private String numId;

    private String nomBeneficiario;

    private String relacBeneficiario;

    private String detDireccion;

    private String codProvincia;

    private String codActividad;

    private String codProfesion;

    private String codSector;

    private String indSexo;

    private String estCivil;
    private String typeHabit;

    private Integer nbrAnnee;
    private String typeEntre;
    private Integer nbrAnnee2;
    private Integer nbrEnfant;
    private String district;
    private String agence;
    private String pays;

    private String typePiece;

    private Integer idUser;
    private String statutClt;
    private Integer idManagerAgent;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateAttente;
    private String nature;
    private String codeAgence;
    private String provServDestino;
    private String conjoint;
}