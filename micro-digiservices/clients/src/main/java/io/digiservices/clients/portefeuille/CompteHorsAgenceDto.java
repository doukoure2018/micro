package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Compte SAF ouvert dans une agence differente de celle du client (script DSIG du 17/11/2026).
 *
 * <p>Dans SAF2000 les trois premiers chiffres du numero de membre donnent l'agence du client :
 * le membre {@code 33600023271} est de l'agence 336. Un compte dont {@code COD_AGENCIA} n'est pas
 * ces trois chiffres a ete ouvert ailleurs, et l'usager qui l'a ouvert est connu
 * ({@code COD_USUARIO}), son agence aussi quand les trois derniers caracteres de son code sont
 * une agence existante.</p>
 *
 * <p>Lu dans la base de PRODUCTION : un compte ouvert ce matin doit se voir a l'heure suivante.
 * La situation (laquelle des quatre) n'est pas calculee ici mais dans ecreditservice, en Java,
 * pour etre testee sans base.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteHorsAgenceDto {

    /** Le numero de compte, sans retouche. */
    private String numCuenta;
    /** Les positions 4 a 6 du numero, qui en donnent la nature (014 courant, 011 epargne, 002...). */
    private String typeCompte;
    /** L'intitule du compte ({@code NOM_CHEQUERA}). */
    private String intitule;
    private String codCliente;
    private String nomCliente;
    /** Les trois premiers chiffres du numero de membre : l'agence d'origine du client. */
    private String agenceClient;
    /**
     * L'agence portee par la fiche client ({@code CL.CL_CLIENTES.COD_AGENCIA}). Quand elle est
     * celle du compte, le client a ete transfere et le compte est a sa place : ce n'est pas une
     * anomalie.
     */
    private String agenceClientFiche;
    private String agenceCompte;
    private String desAgenceCompte;
    /** L'usager SAF qui a ouvert le compte ({@code COD_USUARIO}) : l'anomalie a un auteur. */
    private String creePar;
    /** Son nom ({@code SG.SG_USUARIOS.NOM_USUARIO}) ; vide si le code ne correspond plus a personne. */
    private String nomCreePar;
    /**
     * L'agence de l'usager : les trois derniers caracteres de son code, retenus seulement s'ils
     * designent une agence existante ({@code CF.CF_AGENCIAS}). {@code null} = inconnue
     * (administrateur, siege, code sans agence).
     */
    private String agenceAgent;
    private LocalDate dateOuverture;
    /** A actif ; tout autre etat = ferme, bloque ou transfere, donc plus rien a corriger. */
    private String etatCompte;
    private BigDecimal solde;
    /** L'une des quatre situations de {@code CompteHorsAgenceVerdict}, posee par ecreditservice. */
    private String situation;
}
