package io.digiservices.bcrgservice.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Référentiel officiel des agences CRG de la plateforme BCRG (reçu le 27/08/2026,
 * participant GN/101, 182 agences), embarqué dans {@code resources/bcrg/agences_crg.csv}.
 *
 * <p>Les codes agences BCRG (001..182) sont DIFFÉRENTS des codes SAF (COD_AGENCIA) :
 * la correspondance se fait par LIBELLÉ normalisé (CF_AGENCIAS.DES_AGENCIA côté SAF,
 * colonne libelle côté BCRG). Une agence non appariée est journalisée et CodAgce est
 * émis null — jamais un code hors référentiel (300 rejets SYN002 le 20/08, et les 50
 * codes SAF « acceptés » correspondaient en réalité à des agences d'autres institutions).</p>
 */
@Component
@Slf4j
public class ReferentielAgencesCrg {

    private final Map<String, String> codeParLibelle = new LinkedHashMap<>();

    public ReferentielAgencesCrg() {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource("bcrg/agences_crg.csv").getInputStream(), StandardCharsets.UTF_8))) {
            reader.readLine(); // en-tête code;libelle
            String ligne;
            while ((ligne = reader.readLine()) != null) {
                String[] parts = ligne.split(";", 2);
                if (parts.length < 2) continue;
                String libelle = normaliser(parts[1]);
                if (libelle != null) {
                    codeParLibelle.put(libelle, parts[0].trim());
                }
            }
            log.info("[BCRG] Referentiel agences CRG charge : {} agences", codeParLibelle.size());
        } catch (Exception e) {
            log.error("[BCRG] Referentiel agences CRG illisible : CodAgce sera null partout - {}", e.getMessage());
        }
    }

    /**
     * Code agence BCRG correspondant à une agence SAF : appariement exact sur le
     * libellé normalisé, puis par inclusion (dans les deux sens) en repli.
     */
    public String codeBcrg(String codAgenciaSaf, String desAgencia) {
        String lib = normaliser(desAgencia);
        if (lib == null) {
            log.info("[BCRG] Agence SAF {} sans libelle : CodAgce null", codAgenciaSaf);
            return null;
        }
        String code = codeParLibelle.get(lib);
        if (code != null) return code;
        for (Map.Entry<String, String> e : codeParLibelle.entrySet()) {
            if (lib.contains(e.getKey()) || e.getKey().contains(lib)) {
                log.info("[BCRG] Agence SAF {} '{}' appariee par inclusion a '{}' (code {})",
                        codAgenciaSaf, desAgencia, e.getKey(), e.getValue());
                return e.getValue();
            }
        }
        log.info("[BCRG] Agence SAF {} '{}' absente du referentiel agences BCRG : CodAgce null",
                codAgenciaSaf, desAgencia);
        return null;
    }

    private static String normaliser(String s) {
        if (!StringUtils.hasText(s)) return null;
        String v = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase()
                .replaceAll("[^A-Z0-9]+", " ")
                .trim();
        return v.isEmpty() ? null : v;
    }
}
