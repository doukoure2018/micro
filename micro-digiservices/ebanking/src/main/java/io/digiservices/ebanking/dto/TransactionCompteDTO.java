package io.digiservices.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Un mouvement d'un compte client, vu depuis la Production (CC.CC_MOVIMTO_MENSUAL)
 * ou depuis le Middleware (TRANSACTIONSAF). Les deux sources sont ramenees a la
 * meme forme pour etre affichees cote a cote sur la fiche signaletique.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionCompteDTO {

    /** PRODUCTION ou MIDDLEWARE. */
    private String source;

    /** NUM_MOVIMIENTO (production) ou NUMTRANSACTION (middleware). */
    private Long numero;

    private LocalDateTime date;

    /** DEPOT, RETRAIT ou INCONNU. */
    private String sens;

    private BigDecimal montant;

    /** Libelle SAF (DES_MOVIMIENTO) ou type d'operation middleware (TYPEOPERATION). */
    private String libelle;

    /** Solde du compte apres l'operation : connu cote middleware seulement. */
    private BigDecimal soldeApres;

    /** COD_USUARIO (production) ou FAITPAR (middleware). */
    private String utilisateur;

    /** DES_REFERENCIA (production) ou MOTIFS (middleware). */
    private String reference;

    /**
     * Trace : IND_APL_CARGO en production (constant 'N', sans valeur debit/credit — constat
     * du 2026-10-10), TYPEOPERATION au middleware.
     */
    private String indicateurBrut;
}
