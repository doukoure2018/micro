package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Piece d'identite d'un agriculteur (contrat public AgriPilot).
 *
 * <p>Un client peut en avoir PLUSIEURS — carte d'identite et passeport, ou une ancienne carte
 * jamais retiree. La fiche les rend toutes, les valables d'abord : le premier element est celui
 * qu'on veut citer, et aucune n'est cachee.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PieceIdentiteDto {

    /** Code du type dans SAF. */
    private String codeType;
    /** Le type en clair : carte d'identite, passeport... */
    private String type;
    /** Le numero porte sur la piece. */
    private String numero;
    /** Date d'expiration ; vide quand SAF ne la porte pas. */
    private LocalDate dateExpiration;
    /**
     * Perimee a la date du jour. Vaut {@code null} quand aucune date n'est connue : ne pas
     * savoir n'est pas la meme chose qu'etre valide.
     */
    private Boolean expiree;
}
