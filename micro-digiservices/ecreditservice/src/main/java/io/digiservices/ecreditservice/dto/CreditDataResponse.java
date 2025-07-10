package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreditDataResponse {
    // Données de petit_credit
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
    private String referenceCredit;
    private BigDecimal cumulCredit;
    private Integer nbreCredit;

    // Données de frequence
    private Integer frequenceValue;
    private LocalDateTime frequenceCreatedAt;

    // Données de garantieMat
    private String garantieLibele;
    private BigDecimal garantieMontant;
    private LocalDateTime garantieCreatedAt;

    // Données de localisation
    private String itAss;
    private String itPc;

    // Données agrégées en JSON
    private String produitsData;  // JSON string
    private String chargesData;   // JSON string
    private String cautionsData;  // JSON string
}