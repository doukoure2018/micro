package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreditProcessParams {

    private String numeroMembre;
    private String referenceCredit;
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
    private Integer frequence;
    private String garantieLibele;
    private BigDecimal garantieMontant;
    private String itAss;
    private String itPc;

    // Arrays for multiple products
    private String[] produitsLibele;
    private BigDecimal[] produitsPrixUnit;
    private Integer[] produitsQte;
    private String[] produitsObservation;

    // Arrays for multiple charges
    private String[] chargesLibele;
    private BigDecimal[] chargesPrixUnit;
    private Integer[] chargesQte;

    // Arrays for multiple guarantors
    private String[] cautionsNom;
    private String[] cautionsPrenom;
    private String[] cautionsTelephone;
    private String[] cautionsActivite;
    private Long[] cautionsAge;
    private String[] cautionsProfession;
}
