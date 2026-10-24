package io.digiservices.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

        /**
         * Le compte doit corriger son adresse ET son numero avant de pouvoir travailler (V174) :
         * il est conduit a cette page a la connexion et n'en sort qu'une fois les deux prouves.
         */
        private boolean correctionObligatoire;

        /** Contact saisi par le directeur d'agence, en attente de confirmation par l'agent (V173). */
        private String emailSaisiPar;
        private OffsetDateTime emailSaisiAt;
        private String telephoneSaisiPar;
        private OffsetDateTime telephoneSaisiAt;

        /** Demande en cours, s'il y en a une (canal et destination masquee). */
        private DemandeEnCoursDto demandeEmail;
        private DemandeEnCoursDto demandeTelephone;

        /**
         * Vrai si l'utilisateur a quelque chose a faire : adresse en echec, numero absent, ou
         * contact saisi par son directeur d'agence et pas encore confirme par un code.
         *
         * <p>Un contact ancien jamais verifie ne declenche rien : on ne harcele pas les 340
         * agents du reseau, on s'occupe de ce qui est casse ou en attente.</p>
         */
        public boolean isAcorriger() {
            return emailEnEchec
                    || telephone == null || telephone.isBlank()
                    || aConfirmer();
        }

        /** Ce qu'il reste a faire pour lever l'obligation. */
        public boolean isEmailAverifier() {
            return emailVerifieAt == null;
        }

        public boolean isTelephoneAverifier() {
            return telephoneVerifieAt == null;
        }

        /** Contact pose par le directeur d'agence, que l'agent doit encore prouver. */
        public boolean isAconfirmer() {
            return aConfirmer();
        }

        private boolean aConfirmer() {
            return (emailSaisiAt != null && emailVerifieAt == null)
                    || (telephoneSaisiAt != null && telephoneVerifieAt == null);
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

    /** Une ligne de la liste des contacts de l'equipe (V173). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EquipeContactDto {
        private Long userId;
        private String nom;
        private String role;
        private String pointVente;
        private String agence;
        private String delegation;

        private String email;
        private boolean emailEnEchec;
        private boolean emailVerifie;
        private String emailSaisiPar;           // non null = saisi par le DA, a confirmer

        private String telephone;
        private boolean telephoneVerifie;
        private String telephoneSaisiPar;

        private String derniereConnexion;

        /** Ce que le directeur doit regarder en premier. */
        public boolean isAtraiter() {
            return emailEnEchec || telephone == null || telephone.isBlank()
                    || (emailSaisiPar != null && !emailVerifie)
                    || (telephoneSaisiPar != null && !telephoneVerifie);
        }
    }

    /** Decompte d'un perimetre : ce qui est en ordre, ce qui ne l'est pas. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class IndicateursContactsDto {
        private String libelle;                 // agence ou delegation, pour la synthese
        private long nbAgents;
        private long nbEmailEnEchec;
        private long nbSansTelephone;
        private long nbAconfirmer;              // saisis par le DA, pas encore prouves
        private long nbContactsVerifies;        // adresse ET numero verifies
    }

    /** Reponse de la vue d'equipe : les lignes, le decompte, et ce que l'on peut y faire. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EquipeContactsDto {
        private String niveau;                  // AGENCE, DELEGATION ou RESEAU
        private boolean peutSaisir;             // directeur d'agence, ou DSIG
        private IndicateursContactsDto indicateurs;
        private java.util.List<IndicateursContactsDto> synthese;   // par delegation, au niveau reseau
        private java.util.List<EquipeContactDto> lignes;
    }

    /** Saisie d'un contact par le directeur d'agence, a la place d'un agent. */
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SaisieContactRequest {
        @NotNull(message = "L'agent est obligatoire")
        private Long agentUserId;

        @NotBlank(message = "Le canal est obligatoire")
        @Pattern(regexp = "EMAIL|SMS", message = "Canal invalide (EMAIL ou SMS)")
        private String canal;

        @NotBlank(message = "La valeur est obligatoire")
        @Size(max = 255)
        private String valeur;
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
