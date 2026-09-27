package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** Signalement d'un numero de telephone client par un DA, DR ou DE (V156). */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignalementTelephoneDto {

    private Long id;
    private String codCliente;
    private String nomClient;
    private Long numCredito;

    private String codAgencia;
    private Long pointVenteId;
    private String pointVente;
    private Long agenceId;
    private Long delegationId;

    private String telPrincipalConstate;
    private String telSecundarioConstate;
    private String telOtroConstate;

    /** INJOIGNABLE, ERRONE, ABSENT, CHANGE ou AUTRE. */
    private String motif;
    private String commentaire;
    /** NOUVEAU, PRIS_EN_CHARGE, TRAITE ou CLASSE. */
    private String statut;

    private Long signaleParUserId;
    private String signalePar;
    private String signaleParRole;
    private LocalDateTime signaleAt;

    private Long prisParUserId;
    private String prisPar;
    private LocalDateTime prisAt;
    /** Demande de changement de telephone creee par l'agent (V109). */
    private Long demandeId;
    private String demandeStatut;

    private LocalDateTime traiteAt;
    private LocalDateTime classeAt;
    private String motifClassement;
    private LocalDateTime vuAt;
}
