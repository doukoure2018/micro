package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Credit SAF dont le compte de remboursement est mal adosse (script DSIG du 31/10/2026).
 *
 * <p>Le compte de remboursement est {@code PR.PR_CREDITOS.ID_CUENTA}. Il doit etre un compte
 * courant ({@code 014}) ou d'epargne ({@code 011}) du client lui-meme, et actif : c'est de lui
 * que SAF preleve l'echeance. Quand il ne l'est pas, le prelevement ne peut pas aboutir et le
 * credit entre dans le PAR pour une raison qui n'a rien a voir avec la capacite du client.</p>
 *
 * <p>Lu dans la base de PRODUCTION : une saisie fautive du matin doit se voir le matin meme.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteMalAdosseDto {

    /** Les cinq familles d'anomalie, de la plus grave a la plus benigne. */
    public static final String PAS_DE_COMPTE = "PAS_DE_COMPTE";
    public static final String COMPTE_INEXISTANT = "COMPTE_INEXISTANT";
    public static final String COMPTE_AUTRE_CLIENT = "COMPTE_AUTRE_CLIENT";
    public static final String COMPTE_NON_ACTIF = "COMPTE_NON_ACTIF";
    public static final String TYPE_NON_AUTORISE = "TYPE_NON_AUTORISE";

    private String codAgencia;
    private String desAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private Integer tipCredito;
    private BigDecimal monCredito;
    private BigDecimal monSaldo;
    /** D en cours, A en cours, I apure, J contentieux, T transfere ; vide ou inconnu = en cours. */
    private String indEstado;
    private LocalDate fecApertura;
    private LocalDate fecVencimiento;

    /** Le compte de remboursement tel qu'il a ete saisi, sans retouche. */
    private String idCuenta;
    /** Les positions 4 a 6 du numero de compte, qui en donnent la nature ; null si illisible. */
    private String typeCompte;
    /** L'une des cinq constantes ci-dessus. */
    private String famille;

    /** Le proprietaire reel du compte rattache, quand ce compte existe. */
    private String compteClient;
    private String compteAgencia;
    private String compteEtat;
    private BigDecimal compteSolde;

    /** L'usager SAF qui a saisi le credit ({@code COD_USUARIO}) : l'anomalie a un auteur. */
    private String saisiPar;
    private LocalDateTime dateSaisie;
    /** L'agent de credit porteur du dossier ({@code COD_OFICIAL}). */
    private String agentCredit;
}
