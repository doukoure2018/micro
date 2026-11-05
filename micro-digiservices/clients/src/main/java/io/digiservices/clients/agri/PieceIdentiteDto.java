package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Une piece d'identite d'un client, telle que SAF la porte ({@code CL.CL_ID_CLIENTES}).
 *
 * <p>Un client peut en avoir PLUSIEURS — carte d'identite et passeport, ou deux cartes dont
 * l'ancienne n'a jamais ete retiree. L'API les rend toutes plutot que d'en choisir une : qui
 * lit la fiche doit pouvoir constater qu'il y en a deux, et laquelle est encore valable.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PieceIdentiteDto {

    /** Code du type dans SAF ({@code COD_TIPO_ID}). */
    private String codeType;
    /** Le type en clair ({@code CL.CL_TIPOS_ID.DES_TIPO_ID}) : carte d'identite, passeport... */
    private String type;
    /** Le numero porte sur la piece ({@code NUM_ID}). */
    private String numero;
    /** Date d'expiration ({@code FEC_VENCIM}) ; vide quand SAF ne la porte pas. */
    private LocalDate dateExpiration;

    /**
     * La piece est-elle perimee a la date du jour ?
     *
     * <p>Calcule ici plutot que laisse au consommateur : une date d'expiration sans verdict
     * oblige chaque appelant a refaire la comparaison, et l'un d'eux la fera a l'envers. Vaut
     * {@code null} quand SAF ne porte aucune date — ne pas savoir n'est pas la meme chose
     * qu'etre valide.</p>
     */
    private Boolean expiree;

    public PieceIdentiteDto(String codeType, String type, String numero, LocalDate dateExpiration) {
        this.codeType = codeType;
        this.type = type;
        this.numero = numero;
        this.dateExpiration = dateExpiration;
        this.expiree = dateExpiration == null ? null : dateExpiration.isBefore(LocalDate.now());
    }
}
