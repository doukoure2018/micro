package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ActifPassifDto {
    private Long actifPassifId;
    private Long collecteId;

    // 5a) Terrains
    private Boolean terrainExiste;
    private BigDecimal terrainValeur;

    // 5b) Batiments
    private Boolean batimentExiste;
    private Boolean batimentPropriete;

    // 5c) Installations
    private Boolean installationExiste;
    private Boolean installationPropriete;

    // 5d) Materiel roulant
    private Boolean materielRoulantExiste;
    private Boolean materielRoulantPropriete;

    // 5e) Mobilier
    private Boolean mobilierExiste;
    private Boolean mobilierPropriete;

    // 5f) Machines
    private Boolean machineExiste;
    private Boolean machinePropriete;

    // 5g) Caution financiere
    private Boolean cautionFinanciereExiste;
    private BigDecimal cautionFinanciereValeur;

    // 5h) Prets employes
    private Boolean pretEmployeExiste;
    private Boolean pretEmployeFondsActivite;
    private BigDecimal pretEmployeValeur;

    // 5i) Stock
    private Boolean stockExiste;
    private Boolean stockConnaitValeur;
    private BigDecimal stockValeurEstimee;
    private Boolean stockEvaluerDetail;

    // 5j) Credit fournisseur
    private Boolean creditFournisseurExiste;
    private Boolean creditFournisseurPrevu;
    private BigDecimal creditFournisseurValeur;

    // 5k) Creances clients
    private Boolean creanceClientExiste;
    private BigDecimal creancePlus3Mois;
    private BigDecimal creanceMoins3Mois;

    // 5l) Cash
    private Boolean cashExiste;
    private BigDecimal cashValeur;

    // 5m) Compte CRG
    private Boolean compteCrgExiste;
    private BigDecimal compteCrgValeur;

    // 5n) Tontinier
    private Boolean tontinierExiste;
    private BigDecimal tontinierValeur;

    // 5o) Compte banque
    private Boolean compteBanqueExiste;
    private BigDecimal compteBanqueValeur;

    // 5p) Emprunt IMF
    private Boolean empruntImfExiste;
    private BigDecimal empruntImfValeur;

    // 5q) Emprunt bancaire LT
    private Boolean empruntBancaireLtExiste;
    private BigDecimal empruntBancaireLtValeur;

    // 5r) Emprunt bancaire CT
    private Boolean empruntBancaireCtExiste;
    private BigDecimal empruntBancaireCtValeur;

    // 5s) Avances clients
    private Boolean avanceClientExiste;
    private BigDecimal avanceClientValeur;

    // 5t) Dettes fournisseurs
    private Boolean detteFournisseurExiste;
    private BigDecimal detteFournisseurValeur;

    // 5u) Impots non payes
    private Boolean impotNonPayeExiste;
    private BigDecimal impotNonPayeValeur;

    // 5v) Loyers non payes
    private Boolean loyerNonPayeExiste;
    private BigDecimal loyerNonPayeValeur;

    // 5w) Factures non payees
    private Boolean factureNonPayeeExiste;
    private BigDecimal factureNonPayeeValeur;

    // 5x) Tontine dette
    private Boolean tontineDetteExiste;
    private BigDecimal tontineDetteValeur;

    // 5y) Autres dettes
    private Boolean autreDetteExiste;
    private BigDecimal autreDetteValeur;

    // Stock articles detail
    private List<StockArticleDto> stockArticles;
}
