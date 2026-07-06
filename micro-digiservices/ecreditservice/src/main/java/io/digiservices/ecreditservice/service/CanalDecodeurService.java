package io.digiservices.ecreditservice.service;

/**
 * Intégration API Canal+ (partenaire Yigui) — actualisation des chaînes d'un décodeur
 * dont l'abonnement est encore actif. Voir docs/Documentation_API_Actualisation_Decodeur.md.
 */
public interface CanalDecodeurService {

    /** Résultat brut de l'API Canal+ : code HTTP + corps JSON, relayés tels quels au frontend. */
    record CanalApiResult(int status, String body) {}

    /**
     * ÉTAPE 1 (OBLIGATOIRE avant toute actualisation) : consulte le statut de l'abonnement
     * du décodeur (existe ? contrat Active ?). Traitement temps réel côté Canal+ (~60 s).
     * @param numAbonne numéro du décodeur (14 chiffres, déjà normalisé)
     */
    CanalApiResult checkDecoder(String numAbonne);

    /**
     * ÉTAPE 2 : déclenche l'actualisation des chaînes du décodeur.
     * À n'appeler QUE si checkDecoder a renvoyé existe=true et statut=Active
     * (règle imposée par le parcours frontend — enchaîner les deux appels côté
     * serveur doublerait le temps d'attente, ~60 s chacun).
     * @param numAbonne   numéro du décodeur (14 chiffres, déjà normalisé)
     * @param phoneNumber téléphone du client SANS indicatif pays (déjà normalisé)
     */
    CanalApiResult reactivation(String numAbonne, String phoneNumber);
}
