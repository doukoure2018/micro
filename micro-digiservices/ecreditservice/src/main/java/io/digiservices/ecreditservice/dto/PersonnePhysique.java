package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonnePhysique {
    // Primary key
    private Long id;

    // Identification client
    private String codCliente;
    private String numId;
    private String typePiece;

    // Informations personnelles
    private String nomCliente;
    private String nomClient;
    private String prenomClient;

    // Contacts
    private String telPrincipal;
    private String telOtro;

    // Dates importantes
    private LocalDate fecVencim;
    private LocalDate fechNacimiento;
    private LocalDate dateAttente;

    // Lieu de naissance et nationalité
    private String lieuxNaiss;
    private String nationalite;
    private String pays;

    // Informations bénéficiaire
    private String nomBeneficiario;
    private String relacBeneficiario;

    // Adresse et localisation
    private String detDireccion;
    private String codProvincia;
    private String district;
    private String agence;
    private String codeAgence;

    // Informations professionnelles
    private String codActividad;
    private String codProfesion;
    private String codSector;
    private String codCanton;
    // type entrepise
    private String typeEntre;
    private Integer nbrAnnee2;

    // Informations personnelles et familiales
    private String indSexo;
    private String estCivil;
    private String conjoint;
    private Integer nbrEnfant;

    // Informations logement
    private String typeHabit;
    private Integer nbrAnnee;

    // Informations administratives
    private String statutClt;
    private String nature;
    private String provServDestino;

    // Gestion et traçabilité
    private Integer idUser;
    private Integer idManagerAgent;
    private String correctionStatut;

    // Métadonnées
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}