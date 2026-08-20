# Mail d'annonce — v1.5 PM V2

**Objet : Centrale des Risques BCRG — Mise en production de la version 1.5 (amélioration des Personnes Morales)**

---

Bonjour,

Nous vous remercions pour votre retour sur les personnes physiques : le passage de 10 % à 80 % de données éligibles confirme la pertinence de la démarche engagée ensemble.

Comme convenu, nous avons appliqué le même procédé aux **personnes morales** (module M1). La **version 1.5** de notre API est en production ce jour, sans aucun changement de contrat : les mêmes endpoints renvoient désormais des données enrichies.

**Améliorations apportées aux personnes morales :**

1. **`VilleSiegeSocial`** — jusqu'ici émis à `ND`, ce champ obligatoire est désormais renseigné avec le libellé de la préfecture du siège social (référentiel géographique de notre SI, ex. « CONAKRY », « BOKE »). La donnée est disponible pour la quasi-totalité de nos personnes morales : c'est le principal gain d'éligibilité attendu.

2. **`CommuneAdresse`** — désormais renseigné avec le libellé du district (à défaut, du canton) de l'adresse du siège, lorsqu'il est disponible.

3. **`RCCM`** — désormais repris de la pièce d'identification « Numéro du RCCM » enregistrée dans notre SI lorsqu'elle existe ; `ND` sinon.

**Limites vérifiées et documentées (audit complet de notre SI réalisé à cette occasion) :**

- **`NIF` / `NIFP` / `NumAgrement`** : aucune source dans le SI bancaire — ces champs restent émis à `ND` ;
- **`DatCreat`** (date de création juridique) : non portée par le SI — reste à `ND` ;
- **`Mandataires` / `Actionnaires`** : notre SI ne porte pas de table de relations ou d'associés — listes vides (champs facultatifs).

**Point d'attention** : le RCCM n'est aujourd'hui saisi que pour une très faible part de nos personnes morales (clientèle essentiellement composée de groupements et d'associations ruraux). Un chantier interne de collecte et de saisie du RCCM/NIF est à l'étude au CRG ; dans l'intervalle, nous vous confirmons notre demande de **tolérance de la valeur `ND` sur `RCCM`/`NIF` en régime transitoire** (point 3 du § 5 de la documentation).

La documentation technique mise à jour (version 1.5 du 20 août 2026) est jointe au présent message. La collection Postman reste inchangée, le contrat JSON étant identique.

Nous restons à votre disposition pour toute vérification de votre côté, et sommes preneurs du nouveau taux d'éligibilité des personnes morales après ingestion.

Bien cordialement,

**Salifou Doukouré**
Direction des Systèmes d'Information
Crédit Rural de Guinée S.A.

---

*Pièce jointe : Documentation_API_BCRG.md (v1.5) — PDF*
