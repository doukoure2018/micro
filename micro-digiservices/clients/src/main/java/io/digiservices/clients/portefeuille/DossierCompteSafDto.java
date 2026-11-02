package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Le dossier d'un credit mal adosse, tel que SAF le montre a l'instant.
 *
 * <p>Il repond aux deux seules questions qui permettent de corriger : qu'est-ce que le compte
 * saisi EST reellement, et quels comptes du client conviendraient. Sans la seconde, il faut
 * rouvrir SAF pour chercher, et la correction attend.</p>
 *
 * <p>Lu dans la base de PRODUCTION : la correction se fait dans SAF maintenant, c'est donc
 * l'etat du moment qui compte, pas celui de la copie de la veille.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DossierCompteSafDto {

    /** Un compte SAF, qu'il soit celui saisi a tort ou un candidat a la correction. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompteSafDto {
        private String numCuenta;
        private String codProducto;
        private String nomProducto;
        private String codAgencia;
        private String desAgencia;
        private String codCliente;
        private String nomCliente;
        /** A pour actif ; toute autre valeur signifie ferme ou bloque. */
        private String indEstado;
        private BigDecimal salDisponible;
        private LocalDate fecApertura;
        private LocalDate fecUltMovimiento;
        /** Les positions 4 a 6 du numero, qui donnent la nature du compte. */
        private String typeCompte;
    }

    // Le credit, tel que SAF le porte maintenant
    private String codAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private BigDecimal monCredito;
    private BigDecimal monSaldo;
    private String indEstado;
    private LocalDate fecApertura;
    private LocalDate fecVencimiento;
    private String idCuenta;
    private String codUsuario;
    private String codOficial;

    /** Le compte saisi, tel qu'il est reellement. Absent si le numero ne correspond a rien. */
    private CompteSafDto compteSaisi;

    /**
     * Les comptes du client qui conviendraient : courant ou epargne, et actifs. Une liste vide
     * est une information en soi — le client n'a aucun compte de remboursement utilisable, et la
     * correction demande d'en ouvrir un.
     */
    @Builder.Default
    private List<CompteSafDto> comptesEligibles = new ArrayList<>();

    /** Tous les autres comptes du client, pour le cas ou aucun eligible n'existe. */
    @Builder.Default
    private List<CompteSafDto> autresComptes = new ArrayList<>();
}
