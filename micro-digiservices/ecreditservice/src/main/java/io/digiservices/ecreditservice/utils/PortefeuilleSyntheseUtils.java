package io.digiservices.ecreditservice.utils;

import io.digiservices.clients.portefeuille.EcheancesIndicateursDto;
import io.digiservices.clients.portefeuille.EcheancesSyntheseDto;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository.PointVenteHierarchie;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Agregation de la synthese TT1 (lot 2) : les lignes par code agence SAF produites par
 * ebanking sont rattachees a la hierarchie digi (pointvente → agence → delegation) puis
 * sommees au niveau demande. Un code SAF sans point de service digi est range sous
 * « Non rattache ».
 */
public final class PortefeuilleSyntheseUtils {

    public static final String NIVEAU_PS = "ps";
    public static final String NIVEAU_AGENCE = "agence";
    public static final String NIVEAU_DELEGATION = "delegation";
    private static final String NON_RATTACHE = "Non rattaché";

    private PortefeuilleSyntheseUtils() {
    }

    public static List<EcheancesSyntheseDto> agreger(List<EcheancesSyntheseDto> parCode,
                                                     List<PointVenteHierarchie> hierarchie, String niveau) {
        Map<String, List<PointVenteHierarchie>> parCodeDigi = new LinkedHashMap<>();
        for (PointVenteHierarchie h : hierarchie) {
            parCodeDigi.computeIfAbsent(h.code(), k -> new ArrayList<>()).add(h);
        }
        List<EcheancesSyntheseDto> resultat = new ArrayList<>();
        if (NIVEAU_PS.equals(niveau)) {
            for (EcheancesSyntheseDto ps : parCode) {
                List<PointVenteHierarchie> hs = parCodeDigi.getOrDefault(ps.getCode(), List.of());
                String libelle = ps.getLibelle() != null && !ps.getLibelle().isBlank() ? ps.getLibelle()
                        : hs.stream().map(PointVenteHierarchie::libelle).filter(Objects::nonNull).findFirst().orElse(ps.getCode());
                String rattachement = hs.stream().map(PointVenteHierarchie::agence).filter(Objects::nonNull).findFirst().orElse(NON_RATTACHE);
                resultat.add(new EcheancesSyntheseDto("PS", null, ps.getCode(), libelle, rattachement, 1, ps.getIndicateurs()));
            }
        } else {
            boolean parDelegation = NIVEAU_DELEGATION.equals(niveau);
            Map<Long, EcheancesSyntheseDto> groupes = new LinkedHashMap<>();
            Map<Long, List<EcheancesIndicateursDto>> membres = new LinkedHashMap<>();
            for (EcheancesSyntheseDto ps : parCode) {
                PointVenteHierarchie h = parCodeDigi.getOrDefault(ps.getCode(), List.of()).stream().findFirst().orElse(null);
                Long id = h == null ? null : (parDelegation ? h.delegationId() : h.agenceId());
                String libelle = h == null ? NON_RATTACHE : (parDelegation ? h.delegation() : h.agence());
                String rattachement = h == null || parDelegation ? null : h.delegation();
                EcheancesSyntheseDto g = groupes.computeIfAbsent(id, k -> new EcheancesSyntheseDto(
                        parDelegation ? "DELEGATION" : "AGENCE", id, null,
                        libelle == null ? NON_RATTACHE : libelle, rattachement, 0, null));
                g.setNbPointsService(g.getNbPointsService() + 1);
                membres.computeIfAbsent(id, k -> new ArrayList<>()).add(ps.getIndicateurs());
            }
            for (Map.Entry<Long, EcheancesSyntheseDto> e : groupes.entrySet()) {
                e.getValue().setIndicateurs(somme(membres.get(e.getKey())));
                resultat.add(e.getValue());
            }
        }
        resultat.sort(Comparator.comparing((EcheancesSyntheseDto s) -> s.getIndicateurs().getResteAEncaisser(),
                Comparator.reverseOrder()).thenComparing(EcheancesSyntheseDto::getLibelle, String.CASE_INSENSITIVE_ORDER));
        return resultat;
    }

    public static EcheancesIndicateursDto somme(List<EcheancesIndicateursDto> parts) {
        long nb = 0, nbCredits = 0, nbClients = 0, reglees = 0, aEchoir = 0, impayees = 0;
        BigDecimal attendu = BigDecimal.ZERO, capital = BigDecimal.ZERO, interets = BigDecimal.ZERO,
                regle = BigDecimal.ZERO, reste = BigDecimal.ZERO;
        for (EcheancesIndicateursDto i : parts) {
            if (i == null) continue;
            nb += i.getNbEcheances();
            nbCredits += i.getNbCredits();   // credits et clients distincts par PS : la somme reste juste (un credit vit dans un seul PS)
            nbClients += i.getNbClients();
            reglees += i.getNbReglees();
            aEchoir += i.getNbAEchoir();
            impayees += i.getNbImpayees();
            attendu = attendu.add(nvl(i.getMontantAttendu()));
            capital = capital.add(nvl(i.getCapitalAttendu()));
            interets = interets.add(nvl(i.getInteretsAttendus()));
            regle = regle.add(nvl(i.getMontantRegle()));
            reste = reste.add(nvl(i.getResteAEncaisser()));
        }
        BigDecimal taux = attendu.signum() > 0
                ? regle.multiply(BigDecimal.valueOf(100)).divide(attendu, 1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        return new EcheancesIndicateursDto(nb, nbCredits, nbClients, attendu, capital, interets, regle, reste,
                reglees, aEchoir, impayees, taux);
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
