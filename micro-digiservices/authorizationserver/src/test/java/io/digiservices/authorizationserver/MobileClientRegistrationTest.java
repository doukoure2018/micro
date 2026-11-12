package io.digiservices.authorizationserver;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Le client OIDC de l'application mobile doit etre REECRIT au demarrage tant qu'il diverge du code.
 *
 * <p>Il a longtemps ete cree « si absent » : la ligne presente en base n'a donc jamais recu le scope
 * {@code agent_profile}, et modifier le code ne changeait rien en production. Ces trois cas gardent
 * la correction du 2026-11-12 : enregistrement complet, mise a jour sans doublon, et silence quand
 * la ligne est deja conforme.</p>
 */
class MobileClientRegistrationTest {

    private static final String MOBILE_CLIENT_ID = "mobile-app-client";
    private static final String REDIRECT = "com.digiservices.digicrg://oauth2redirect";

    /** Repository en memoire : retient ce qui est enregistre, dans l'ordre. */
    private static final class FakeRepository implements RegisteredClientRepository {
        private final Map<String, RegisteredClient> parClientId = new HashMap<>();
        private final List<RegisteredClient> enregistrements = new ArrayList<>();

        @Override
        public void save(RegisteredClient client) {
            enregistrements.add(client);
            parClientId.put(client.getClientId(), client);
        }

        @Override
        public RegisteredClient findById(String id) {
            return parClientId.values().stream().filter(c -> c.getId().equals(id)).findFirst().orElse(null);
        }

        @Override
        public RegisteredClient findByClientId(String clientId) {
            return parClientId.get(clientId);
        }

        List<RegisteredClient> enregistrementsDe(String clientId) {
            return enregistrements.stream().filter(c -> clientId.equals(c.getClientId())).toList();
        }
    }

    /** Lance le runner avec les valeurs par defaut des proprietes, comme au demarrage du service. */
    private static void demarrer(FakeRepository repository) throws Exception {
        var application = new AuthorizationServerApplication();
        Map<String, String> proprietes = Map.of(
                "redirecturl", "https://digi-creditrural-io.com",
                "kumyProdClientId", "kumy-agriscore-prod",
                "kumyProdClientSecret", "kumy-prod-secret",
                "kumyProdRedirectUri", "https://kumy-agripilot-prod.firebaseapp.com/__/auth/handler",
                "kumyTestClientId", "kumy-agriscore-test",
                "kumyTestClientSecret", "kumy-test-secret",
                "kumyTestRedirectUri", "https://kumy-agripilot-dev.firebaseapp.com/__/auth/handler",
                "kumyTestExtraRedirectUri", "",
                "desktopClientId", "crg-rapprochement-desktop",
                "desktopRedirectUri", "http://127.0.0.1:8765/callback");
        proprietes.forEach((champ, valeur) -> ReflectionTestUtils.setField(application, champ, valeur));
        ReflectionTestUtils.setField(application, "rapprochementClientId", "crg-rapprochement-encours");
        ReflectionTestUtils.setField(application, "rapprochementRedirectUri", "http://127.0.0.1:8766/callback");
        ReflectionTestUtils.setField(application, "mobileClientId", MOBILE_CLIENT_ID);
        ReflectionTestUtils.setField(application, "mobileRedirectUri", REDIRECT);
        ReflectionTestUtils.setField(application, "mobileExtraRedirectUri", "");
        application.runner(repository, new BCryptPasswordEncoder()).run(null);
    }

    @Test
    void le_client_mobile_est_public_avec_pkce_et_le_scope_agent_profile() throws Exception {
        var repository = new FakeRepository();

        demarrer(repository);

        RegisteredClient mobile = repository.findByClientId(MOBILE_CLIENT_ID);
        assertNotNull(mobile, "le client mobile doit etre enregistre au demarrage");
        assertTrue(mobile.getScopes().contains("agent_profile"),
                "sans agent_profile, l'application n'a ni le role ni le point de service de l'agent");
        assertTrue(mobile.getScopes().containsAll(
                List.of(OidcScopes.OPENID, OidcScopes.PROFILE, OidcScopes.EMAIL)));
        assertTrue(mobile.getClientSettings().isRequireProofKey(), "PKCE obligatoire : client public (RFC 8252)");
        assertFalse(mobile.getClientSettings().isRequireAuthorizationConsent());
        assertTrue(mobile.getClientAuthenticationMethods().contains(ClientAuthenticationMethod.NONE),
                "aucun secret ne tient dans un APK");
        assertTrue(mobile.getRedirectUris().contains(REDIRECT));
        assertTrue(mobile.getAuthorizationGrantTypes().containsAll(
                List.of(AuthorizationGrantType.AUTHORIZATION_CODE, AuthorizationGrantType.REFRESH_TOKEN)));
        assertEquals(Duration.ofHours(1), mobile.getTokenSettings().getAccessTokenTimeToLive());
        assertEquals(Duration.ofDays(30), mobile.getTokenSettings().getRefreshTokenTimeToLive());
        assertFalse(mobile.getTokenSettings().isReuseRefreshTokens(), "rotation des refresh tokens");
    }

    @Test
    void une_ligne_existante_sans_agent_profile_est_mise_a_jour_sans_doublon() throws Exception {
        var repository = new FakeRepository();
        // La ligne telle qu'elle est en production depuis la creation « si absent ».
        repository.save(RegisteredClient.withId("ligne-de-production")
                .clientId(MOBILE_CLIENT_ID)
                .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .redirectUri(REDIRECT)
                .scope(OidcScopes.OPENID).scope(OidcScopes.PROFILE).scope(OidcScopes.EMAIL)
                .clientSettings(ClientSettings.builder().requireProofKey(true)
                        .requireAuthorizationConsent(false).build())
                .tokenSettings(TokenSettings.builder().accessTokenTimeToLive(Duration.ofHours(1))
                        .refreshTokenTimeToLive(Duration.ofDays(30)).reuseRefreshTokens(false).build())
                .build());

        demarrer(repository);

        RegisteredClient mobile = repository.findByClientId(MOBILE_CLIENT_ID);
        assertTrue(mobile.getScopes().contains("agent_profile"), "la ligne doit avoir ete reecrite");
        assertEquals("ligne-de-production", mobile.getId(),
                "le meme id est conserve, sinon save() insere un second client du meme nom");
    }

    @Test
    void un_client_deja_conforme_n_est_pas_reecrit() throws Exception {
        var repository = new FakeRepository();
        repository.save(RegisteredClient.withId("deja-conforme")
                .clientId(MOBILE_CLIENT_ID)
                .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .redirectUri(REDIRECT)
                .scope(OidcScopes.OPENID).scope(OidcScopes.PROFILE).scope(OidcScopes.EMAIL)
                .scope("agent_profile")
                .clientSettings(ClientSettings.builder().requireProofKey(true)
                        .requireAuthorizationConsent(false).build())
                .tokenSettings(TokenSettings.builder().accessTokenTimeToLive(Duration.ofHours(1))
                        .refreshTokenTimeToLive(Duration.ofDays(30)).reuseRefreshTokens(false).build())
                .build());
        int avant = repository.enregistrementsDe(MOBILE_CLIENT_ID).size();

        demarrer(repository);

        assertEquals(avant, repository.enregistrementsDe(MOBILE_CLIENT_ID).size(),
                "un client conforme ne doit pas etre reecrit a chaque demarrage");
    }
}
