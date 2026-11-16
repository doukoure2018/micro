package io.digiservices.ecreditservice.agri.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

/** Ce que la collecte agricole échange entre le terrain et la plateforme (V212). */
public final class AgriDtos {

    private AgriDtos() {
    }

    /** Une parcelle telle que l'agent la déclare, avec l'identifiant créé sur le téléphone. */
    public record ParcelleRecue(
            String identifiantClient,
            String codCliente,
            String codAgencia,
            Long numCredito,
            Long demandeindividuelId,
            String culture,
            BigDecimal surfaceHa,
            String localite,
            BigDecimal latitude,
            BigDecimal longitude,
            Integer precisionM,
            LocalDate dateSemis,
            OffsetDateTime saisieAt) {
    }

    /** Un passage sur la parcelle pendant la campagne. */
    public record VisiteCampagneRecue(
            String identifiantClient,
            String parcelleIdentifiant,
            String stade,
            String etatCulture,
            String sinistre,
            BigDecimal surfaceToucheeHa,
            String intrants,
            String remarque,
            BigDecimal latitude,
            BigDecimal longitude,
            Integer precisionM,
            OffsetDateTime saisieAt) {
    }

    /** Ce que la parcelle a donné. */
    public record RecolteRecue(
            String identifiantClient,
            String parcelleIdentifiant,
            BigDecimal quantite,
            String unite,
            BigDecimal prixUnitaire,
            Integer partVenduePct,
            LocalDate dateRecolte,
            String acheteur,
            String remarque,
            OffsetDateTime saisieAt) {
    }

    /** Une parcelle telle qu'on la relit, avec son suivi et ce qu'elle a donné. */
    public record ParcelleVue(
            Long id,
            String identifiantClient,
            String codCliente,
            String nomMembre,
            String codAgencia,
            Long numCredito,
            Long demandeindividuelId,
            String culture,
            String cultureLibelle,
            BigDecimal surfaceHa,
            String localite,
            BigDecimal latitude,
            BigDecimal longitude,
            LocalDate dateSemis,
            String campagne,
            String agent,
            OffsetDateTime saisieAt,
            int nbVisites,
            String dernierStade,
            String dernierEtat,
            OffsetDateTime derniereVisiteAt,
            RecolteVue recolte,
            Rapprochement rapprochement) {
    }

    public record VisiteCampagneVue(
            Long id,
            String stade,
            String etatCulture,
            String sinistre,
            BigDecimal surfaceToucheeHa,
            String intrants,
            String remarque,
            String agent,
            OffsetDateTime saisieAt) {
    }

    public record RecolteVue(
            Long id,
            BigDecimal quantite,
            String unite,
            BigDecimal quantiteKg,
            BigDecimal prixUnitaire,
            Integer partVenduePct,
            LocalDate dateRecolte,
            String acheteur,
            String remarque,
            String agent,
            OffsetDateTime saisieAt) {
    }

    /**
     * Le prévisionnel du dossier face au réalisé du terrain. C'est la raison d'être de tout ce
     * lot : une prévision tenue dit, sur un membre, ce qu'aucun solde bancaire ne dit.
     *
     * <p>{@code ecartPct} est négatif quand la récolte est inférieure à ce qui était annoncé.
     * Vide quand le dossier ne porte pas de prévision chiffrée — et c'est fréquent.</p>
     */
    public record Rapprochement(
            BigDecimal quantitePrevueKg,
            BigDecimal quantiteReelleKg,
            BigDecimal ecartPct,
            BigDecimal prixPrevu,
            BigDecimal prixReel) {
    }

    /** Le détail d'une parcelle : la fiche, ses passages, sa récolte. */
    public record FicheParcelle(ParcelleVue parcelle, List<VisiteCampagneVue> visites) {
    }
}
