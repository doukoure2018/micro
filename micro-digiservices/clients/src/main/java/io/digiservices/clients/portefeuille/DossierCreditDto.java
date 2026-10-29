package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Dossier complet d'un credit dans SAF : les cinq tables que la DSIG extrayait a la main avec
 * son script PowerShell, pour comprendre pourquoi un solde est negatif.
 *
 * <p>Chaque table est rendue telle quelle, une ligne = une carte colonne/valeur, pour deux
 * raisons. La fiche du credit porte cent vingt-six colonnes : les typer une par une n'apporterait
 * rien et figerait le jour ou SAF en ajoute une. Et l'export doit reproduire exactement ce que le
 * script donnait, c'est-a-dire toutes les colonnes.</p>
 *
 * <p>Les liens entre le credit et les deux dernieres tables sont ceux du script : le compte du
 * credit ou son numero cite dans le libelle du mouvement pour le compte courant, son numero cite
 * dans la reference pour les ecritures comptables. Ce sont des recherches dans du texte libre :
 * un mouvement qui ne cite pas le credit echappe, et {@code complet} le dit.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DossierCreditDto {

    private String codAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private String desAgencia;
    private String idCuenta;            // compte rattache au credit, cle du lien avec le compte courant
    private LocalDate fecApertura;      // plancher de date des deux recherches en texte libre
    private LocalDate dateLecture;
    private boolean trouve;             // false si le credit n'existe pas dans SAF

    /** La fiche du credit : toutes les colonnes de PR.PR_CREDITOS, dans l'ordre de la table. */
    private Map<String, Object> fiche;

    private List<Map<String, Object>> echeancier;        // PR.PR_PLAN_PAGOS
    private List<Map<String, Object>> mouvements;        // PR.PR_MOVIMIENTOS
    private List<Map<String, Object>> mouvementsCompte;  // CC.CC_MOVIMTO_MENSUAL
    private List<Map<String, Object>> ecritures;         // CG.CG_ASTO_DETALLE

    /** Faux quand une table a atteint le plafond de lignes : l'ecran doit le dire. */
    private boolean echeancierComplet;
    private boolean mouvementsComplets;
    private boolean mouvementsCompteComplets;
    private boolean ecrituresCompletes;

    /** Temps de lecture de chaque table, en millisecondes : la mesure vit avec la donnee. */
    private Map<String, Long> millisecondes;
}
