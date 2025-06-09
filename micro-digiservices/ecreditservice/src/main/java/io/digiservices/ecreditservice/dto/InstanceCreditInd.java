package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class InstanceCreditInd {

    // Credit table fields
    private Long creditId;
    private String referenceCredit;
    // Add other credit fields as needed

    // Petit_credit table fields
    private String moyenPerson;
    private String bien;
    private BigDecimal capital;
    private BigDecimal creance;
    private BigDecimal dette;
    private String statutActivite;
    private String experience;
    private String lieuxAct;
    private String personEmp;
    private String lien;
    private String nombre;
    private BigDecimal cumulCredit;
    private Integer nbreCredit;

    // Frequence table fields
    private Integer frequence;
    private LocalDateTime frequenceCreatedAt;

    // GarantieMat table fields
    private String garantieLibele;
    private BigDecimal garantieMontant;
    private LocalDateTime garantieCreatedAt;

    // Localisation table fields
    private String itAss;
    private String itPc;

    // Occurence_credit table fields
    private String stateCredit;
    private String stateNote;
    private String noteProfile;
    private String noteAnalyse;
    private String noteGarantie;
    private String occurenceStatut;
}
