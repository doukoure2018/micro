package io.digiservices.ecreditservice.service;

/**
 * Intégration API Canal+ (partenaire Yigui) — actualisation des chaînes d'un décodeur
 * dont l'abonnement est encore actif. Voir docs/Documentation_API_Actualisation_Decodeur.md.
 */
public interface CanalDecodeurService {

    /** Résultat brut de l'API Canal+ : code HTTP + corps JSON, relayés tels quels au frontend. */
    record CanalApiResult(int status, String body) {}

    /**
     * Déclenche l'actualisation des chaînes du décodeur.
     * @param numAbonne   numéro du décodeur (14 chiffres, déjà normalisé)
     * @param phoneNumber téléphone du client SANS indicatif pays (déjà normalisé)
     */
    CanalApiResult reactivation(String numAbonne, String phoneNumber);
}
