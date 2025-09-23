package io.digiservices.ebanking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFicheSignaletiqueDTO {

    @Size(max = 15, message = "Le téléphone principal ne doit pas dépasser 15 caractères")
    private String telPrincipal;

    @Size(max = 15, message = "Le code client ne doit pas dépasser 15 caractères")
    private String codCliente;

    @Size(max = 15, message = "L'autre téléphone ne doit pas dépasser 15 caractères")
    private String telOtro;

    @Size(max = 80, message = "Le nom du client ne doit pas dépasser 80 caractères")
    private String nomCliente;

    @Size(max = 20, message = "Le nom ne doit pas dépasser 20 caractères")
    private String nomClient;

    @Size(max = 20, message = "Le prénom ne doit pas dépasser 20 caractères")
    private String prenomClient;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecVencim;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechNacimiento;

    @Size(max = 30, message = "Le lieu de naissance ne doit pas dépasser 30 caractères")
    private String lieuxNaiss;

    @Size(max = 30, message = "La nationalité ne doit pas dépasser 30 caractères")
    private String nationalite;

    @Size(max = 30, message = "Le numéro d'identification ne doit pas dépasser 30 caractères")
    private String numId;

    @Size(max = 40, message = "Le nom du bénéficiaire ne doit pas dépasser 40 caractères")
    private String nomBeneficiario;

    @Size(max = 20, message = "La relation du bénéficiaire ne doit pas dépasser 20 caractères")
    private String relacBeneficiario;

    @Size(max = 240, message = "L'adresse détaillée ne doit pas dépasser 240 caractères")
    private String detDireccion;

    @Size(max = 5, message = "Le code province ne doit pas dépasser 5 caractères")
    private String codProvincia;

    @Size(max = 5, message = "Le code activité ne doit pas dépasser 5 caractères")
    private String codActividad;

    @Size(max = 5, message = "Le code profession ne doit pas dépasser 5 caractères")
    private String codProfesion;

    @Size(max = 5, message = "Le code secteur ne doit pas dépasser 5 caractères")
    private String codSector;

    @Size(max = 1, message = "L'indicateur de sexe doit être 'M' ou 'F'")
    private String indSexo;

    @Size(max = 1, message = "L'état civil doit être un seul caractère")
    private String estCivil;

    @Size(max = 2, message = "Le type d'habitation ne doit pas dépasser 2 caractères")
    private String typeHabit;

    private Integer nbrAnnee;

    @Size(max = 2, message = "Le type d'entreprise ne doit pas dépasser 2 caractères")
    private String typeEntre;

    private Integer nbrAnnee2;
    private Integer nbrEnfant;

    @Size(max = 5, message = "Le district ne doit pas dépasser 5 caractères")
    private String district;

    @Size(max = 80, message = "L'agence ne doit pas dépasser 80 caractères")
    private String agence;

    @Size(max = 5, message = "Le pays ne doit pas dépasser 5 caractères")
    private String pays;

    @Size(max = 5, message = "Le type de pièce ne doit pas dépasser 5 caractères")
    private String typePiece;

    private Integer idUser;

    @Size(max = 1, message = "Le statut client doit être un seul caractère")
    private String statutClt;

    private Integer idManagerAgent;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateAttente;

    @Size(max = 50, message = "La nature ne doit pas dépasser 50 caractères")
    private String nature;

    @Size(max = 5, message = "Le code agence ne doit pas dépasser 5 caractères")
    private String codeAgence;

    @Size(max = 15, message = "Le service de destination ne doit pas dépasser 15 caractères")
    private String provServDestino;

    @Size(max = 15, message = "Le code conjoint ne doit pas dépasser 15 caractères")
    private String conjoint;
}