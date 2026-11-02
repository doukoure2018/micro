package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Les credits octroyes dans SAF sur une periode, par point de service.
 *
 * <p>Lu dans la copie de SAUVEGARDE et non dans la production : la synthese hebdomadaire porte
 * sur une semaine close, dont la sauvegarde rend compte aussi bien, et elle ne depend ainsi pas
 * de l'ouverture du compte de lecture de la production — ferme des 13 h le 31/10/2026 pour la
 * cloture de fin de mois.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OctroiSemaineDto {
    private String codAgencia;
    private String desAgencia;
    private Integer nbCredits;
    private BigDecimal montant;
}
