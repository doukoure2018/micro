package io.digiservices.ecreditservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

/**
 * La synthese hebdomadaire de direction (V198, lot 1).
 *
 * <p>Une semaine tient dans un seul objet, image de la ligne gardee en base. Le courriel se
 * construit a partir de DEUX de ces objets : la semaine decrite et celle d'avant. C'est la
 * difference entre les deux qui fait l'interet d'une synthese — un chiffre sans sa variation
 * n'apprend rien a un directeur.</p>
 */
public final class DirectionSyntheseDtos {

    private DirectionSyntheseDtos() {
    }

    /**
     * Les chiffres d'une semaine. Un champ nul signifie « non mesurable cette semaine-la »,
     * jamais zero : la distinction est le coeur de l'honnetete de ce courriel.
     */
    public record SemaineDto(
            LocalDate semaineDu,
            LocalDate semaineAu,

            // Bloc 1 : situation des credits
            Integer demRecu,
            Integer demInstruction,
            Integer demAccorde,
            Integer demRefuse,
            Integer demAnnule,
            Integer demNouveauxSemaine,
            Integer demAccordesSemaine,
            Integer demAnnulesSemaine,

            // Bloc 2 : niveau du portefeuille du reseau
            LocalDate pfDatePhoto,
            Integer pfCredits,
            BigDecimal pfEncours,
            Integer pfNbRetard,
            BigDecimal pfImpaye,
            Integer pfContentieux,

            // Bloc 3 : portefeuille a risque par tranche
            BigDecimal par30Encours, Integer par30Nb,
            BigDecimal par60Encours, Integer par60Nb,
            BigDecimal par90Encours, Integer par90Nb,
            BigDecimal par120Encours, Integer par120Nb,

            // Bloc 4 : assainissement
            Integer assEnAttente,
            Integer assValide,
            Integer assRejete,
            Integer assValideSemaine,
            Integer assRejeteSemaine,

            // Bloc 5 : arretes de caisse
            LocalDate arrDateLimite,
            Integer arrAJour,
            Integer arrAValider,
            Integer arrEnRetard,
            Integer arrJamaisRemonte,
            BigDecimal arrRetardMoyen,

            // Les octrois SAF de la semaine. La seule donnee venant de SAF : quand il n'a pas
            // repondu, octIndisponible porte la raison et les deux chiffres restent nuls.
            Integer octNb,
            BigDecimal octMontant,
            String octIndisponible,

            OffsetDateTime envoyeAt,
            Integer nbDestinataires,
            boolean essai) {

        /** Le taux de portefeuille a risque d'une tranche, en pourcentage de l'encours. */
        public BigDecimal taux(BigDecimal encoursTranche) {
            if (encoursTranche == null || pfEncours == null
                    || pfEncours.compareTo(BigDecimal.ZERO) == 0) {
                return null;
            }
            return encoursTranche.multiply(BigDecimal.valueOf(100))
                    .divide(pfEncours, 2, java.math.RoundingMode.HALF_UP);
        }

        /** Le nombre de points de service couverts par le suivi des arretes. */
        public Integer arrTotal() {
            if (arrAJour == null) {
                return null;
            }
            return arrAJour + nvl(arrAValider) + nvl(arrEnRetard) + nvl(arrJamaisRemonte);
        }

        private static int nvl(Integer v) {
            return v == null ? 0 : v;
        }
    }

    /**
     * Une delegation et ce qu'elle pese dans chaque bloc. Une synthese nationale dit qu'un
     * indicateur se degrade ; ce detail dit ou, ce qui est la premiere question d'un directeur.
     * Les champs nuls signifient « non mesure pour cette delegation », jamais zero.
     */
    public record DelegationDto(Long delegationId, String delegation,
                                Integer demInstruction, Integer demAccordesSemaine,
                                Integer octNb, BigDecimal octMontant,
                                Integer pfCredits, BigDecimal pfEncours, BigDecimal pfImpaye,
                                BigDecimal par30Encours, BigDecimal par90Encours,
                                Integer assEnAttente, Integer assValideSemaine,
                                Integer arrEnRetard, Integer arrJamaisRemonte) {

        /** Le taux de portefeuille a risque de la delegation, sur son propre encours. */
        public BigDecimal taux(BigDecimal tranche) {
            if (tranche == null || pfEncours == null || pfEncours.compareTo(BigDecimal.ZERO) == 0) {
                return null;
            }
            return tranche.multiply(BigDecimal.valueOf(100))
                    .divide(pfEncours, 2, java.math.RoundingMode.HALF_UP);
        }
    }

    /**
     * Ce que le courriel a besoin de savoir : la semaine decrite, celle d'avant quand elle
     * existe, le detail par delegation, et le nombre de destinataires que la matrice a designes.
     */
    public record SyntheseDto(SemaineDto courante, SemaineDto precedente,
                              java.util.List<DelegationDto> delegations, int nbDestinataires) {

        /** Vrai quand aucune semaine de reference n'existe : les variations sont alors taues. */
        public boolean premiereSemaine() {
            return precedente == null;
        }
    }
}
