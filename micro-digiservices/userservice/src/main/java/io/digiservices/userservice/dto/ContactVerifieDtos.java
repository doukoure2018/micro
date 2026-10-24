package io.digiservices.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * Page « Mon profil » et verification des contacts (V172, lot 1 du chantier contacts verifies).
 *
 * <p>Le principe tient en une phrase : une modification de contact n'est enregistree qu'apres
 * la saisie d'un code recu a la NOUVELLE adresse ou au NOUVEAU numero.</p>
 */
public final class ContactVerifieDtos {

    private ContactVerifieDtos() {
    }

    public static final String CANAL_EMAIL = "EMAIL";
    public static final String CANAL_SMS = "SMS";

    /** Ce que la page « Mon profil » affiche : l'identite en lecture seule, les contacts modifiables. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProfilContactDto {
        private Long userId;
        private String nom;                     // prenom + nom
        private String role;
        private String service;
        private String pointVente;
        private String agence;
        private String delegation;

        private String email;
        private boolean emailEnEchec;           // l'adresse a rebondi : bandeau a la connexion
        private OffsetDateTime emailVerifieAt;  // null = jamais prouvee par un code
        private String telephone;
        private OffsetDateTime telephoneVerifieAt;

        /** Ancien identifiant encore accepte, et jusqu'a quand. */
        private String ancienEmail;
        private OffsetDateTime ancienEmailExpireAt;

        /** Demande en cours, s'il y en a une (canal et destination masquee). */
        private DemandeEnCoursDto demandeEmail;
        private DemandeEnCoursDto demandeTelephone;

        /** Vrai si l'utilisateur doit corriger quelque chose : adresse en echec ou numero absent. */
        public boolean isAcorriger() {
            return emailEnEchec || telephone == null || telephone.isBlank();
        }
    }

    /** Une demande de code encore ouverte. Le code lui-meme n'est jamais renvoye. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DemandeEnCoursDto {
        private String canal;
        private String destinationMasquee;      // r***t@gmail.com, 62*****89
        private OffsetDateTime expireAt;
        private int essais;
        private int essaisMax;
    }

    /** Demande d'un code pour une nouvelle adresse ou un nouveau numero. */
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DemandeCodeRequest {
        @NotBlank(message = "Le canal est obligatoire")
        @Pattern(regexp = "EMAIL|SMS", message = "Canal invalide (EMAIL ou SMS)")
        private String canal;

        @NotBlank(message = "La nouvelle adresse ou le nouveau numero est obligatoire")
        @Size(max = 255)
        private String destination;
    }

    /** Saisie du code recu. */
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ConfirmationCodeRequest {
        @NotBlank(message = "Le canal est obligatoire")
        @Pattern(regexp = "EMAIL|SMS", message = "Canal invalide (EMAIL ou SMS)")
        private String canal;

        @NotBlank(message = "Le code est obligatoire")
        @Pattern(regexp = "\\d{6}", message = "Le code comporte six chiffres")
        private String code;
    }

    /** Reponse a une demande de code. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DemandeCodeDto {
        private String canal;
        private String destinationMasquee;
        private OffsetDateTime expireAt;
        private int essaisMax;
        private String message;
    }

    /** Reponse a une confirmation : le profil a jour, et ce que l'utilisateur doit retenir. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ConfirmationDto {
        private ProfilContactDto profil;
        /** Vrai quand l'identifiant de connexion vient de changer. */
        private boolean identifiantChange;
        private String message;
    }
}
