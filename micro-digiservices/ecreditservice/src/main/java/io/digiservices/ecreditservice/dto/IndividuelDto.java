package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class IndividuelDto {

    private Long individuelId;
    private LocalDateTime createdAt;
    private String catMembre;
    private String numeroMembre;
    private String nom;
    private String prenom;
    private LocalDateTime dateNaissance;
    private String lieuxNaissance;
    private String nationalite;
    private String telephone;
    private String telephone2;
    private String typePiece;
    private String numeroPiece;
    private String sexe;
    private String profession;
    private String nomPere;
    private String nomMere;
    private String activite;
    private Integer nbreEnfant;
    private Integer nbreParent;
    private Integer nbreAutre;
    private String quartier;
    private String district;
    private String secteur;
    private BigDecimal cotisation;
    private BigDecimal droitEntree;
    private String typeHabitation;
    private Integer nbreAnnee;
    private String statutIndividuel;
    private String prestataire;
    private String codCanton;
    private String ville;
    private String typeEntreprise;
    private String lienParente;
    private String nomParent;
    private String conjoint;
    private Integer nbreAnneeH;
    private String adresse;
    private LocalDateTime expirationDate;
    private Long userId;
}
