package io.digiservices.agriculteurservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Identité et contacts d'un membre, à partir de son code membre.
 *
 * <p>Le nom complet et les numéros de téléphone viennent de la fiche client du core banking ;
 * le nom et le prénom séparés de la fiche personne physique, quand le membre en est une.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdentiteMembreDto {

    private String codeMembre;
    private String nomComplet;
    private String nom;
    private String prenom;
    private String typePersonne;
    private String raisonSociale;
    private String sexe;
    private String nationalite;
    private String profession;

    private String codeAgence;
    private String libelleAgence;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateAdhesion;

    private String telephonePrincipal;
    private String telephoneSecondaire;
    private String telephoneAutre;
    /** Numéros réellement renseignés, dans l'ordre principal, secondaire, autre. */
    private List<String> telephones;
    /** Vrai si le membre n'a aucun numéro : il est injoignable. */
    private boolean sansTelephone;

    private List<AdresseDto> adresses;
    /** Renseigné quand le membre est introuvable. */
    private String message;
}
