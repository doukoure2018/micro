package io.digiservices.clients.agri;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Identite et contacts d'un membre, lus dans CL.CL_CLIENTES et, pour une personne physique,
 * CL.CL_PERSONAS_FISICAS (nom et prenom separes). Les adresses viennent de CL.CL_DIR_CLIENTES.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdentiteMembreDto {

    private String codeMembre;
    /** Nom complet tel que SAF le stocke. */
    private String nomComplet;
    /** Renseignes pour une personne physique ; null pour une personne morale. */
    private String nom;
    private String prenom;
    /** F = personne physique, J = personne morale. */
    private String typePersonne;
    private String libelleTypePersonne;
    /** Raison sociale, pour une personne morale. */
    private String raisonSociale;
    private String sexe;
    private String nationalite;
    private String profession;

    private String codeAgence;
    private String libelleAgence;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateAdhesion;

    /** Les trois numeros de SAF ; null quand le champ est vide. */
    private String telephonePrincipal;
    private String telephoneSecondaire;
    private String telephoneAutre;
    /** Numeros reellement renseignes, dans l'ordre principal, secondaire, autre. */
    private List<String> telephones;
    /** TRUE si aucun numero n'est renseigne : le membre est injoignable. */
    private boolean sansTelephone;

    private List<AdresseMembreDto> adresses;

    /** Renseigne quand le membre est introuvable dans le core banking. */
    private String message;
}
