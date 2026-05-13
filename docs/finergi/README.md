# CRG × Finergi — Documentation d'intégration mobile

Documentation complète pour l'intégration du service **Finergi Token Advance** dans l'application mobile CRG Credit Money.

> **Status** : ✅ Backend validé end-to-end sur DEV — Spec mobile prête pour développement.

---

## 📚 Documents disponibles

### 🎬 [Workflow utilisateur](./user-workflow.md)
**Pour qui** : tous (PM, designers, devs, support)

Description narrative pas à pas du parcours utilisateur. Idéal comme **première lecture** pour comprendre le projet avant de plonger dans les détails techniques.

### 🎨 [Maquettes UI](./index.html)
**Pour qui** : designers, devs mobiles

Mockups visuels des 13 écrans clés (Token Advance + Repayment + États d'erreur), avec annotations API. Chaque écran montre quel endpoint Finergi est appelé à ce moment-là.

> 🔗 [Voir les maquettes en ligne](https://doukoure2018.github.io/micro/docs/finergi/)

### 🔧 [Spec technique mobile](./integration-spec.md)
**Pour qui** : développeurs mobiles (iOS / Android)

Référence détaillée des endpoints API, payloads, gestion d'erreur, checklist d'intégration. À utiliser pendant l'implémentation.

### 🧪 [Guide de test Postman](./postman-test-guide.md)
**Pour qui** : développeurs backend, QA

Setup d'une collection Postman pour tester le flux complet en local. Inclut les scripts pre-request, les tests scripts, et le troubleshooting des erreurs connues.

---

## 🏗 Architecture en un coup d'œil

```
┌──────────────────┐
│   App mobile CRG │
└────────┬─────────┘
         │ 1 seul appel API
         ▼
┌──────────────────┐
│     Finergi      │  ◀── orchestre tout
└────┬──────┬──────┘
     │      │
     │      │ B2B backend (invisible pour l'app)
     ▼      ▼
  ┌─────┐ ┌─────────────┐
  │ EDG │ │ Mobile Money│
  └─────┘ └─────────────┘
```

**L'app mobile parle uniquement à Finergi.** Finergi orchestre EDG (génération du token) et Mobile Money en backend.

---

## 🔑 Credentials & environnements

| Env | URL | Credentials |
|---|---|---|
| **DEV** | `https://api-dev.finergi.cloud/integration` | Demander à l'équipe backend |
| **PROD** | À fournir par Finergi | Demander à l'équipe backend |

> 🚨 **Les `clientSecret` et `clientId` ne sont pas dans cette doc publique.** Demande-les directement à l'équipe backend CRG via un canal sécurisé (Slack DM, gestionnaire de secrets, etc.).

---

## 🚀 Pour commencer

1. **Lire le workflow** pour comprendre le contexte → [user-workflow.md](./user-workflow.md)
2. **Visualiser les écrans cibles** → [maquettes en ligne](https://doukoure2018.github.io/micro/docs/finergi/)
3. **Coder selon la spec** → [integration-spec.md](./integration-spec.md)
4. **Tester avec Postman** → [postman-test-guide.md](./postman-test-guide.md)

---

## 📞 Contacts

| Sujet | Contact |
|---|---|
| Backend CRG / API Finergi | Doukouré Salifou |
| Maintainer Finergi | *À compléter* |
| Design UI/UX | Voir maquettes HTML |

---

*Last updated: May 2026*
