package io.digiservices.authorizationserver;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;

import java.time.Duration;
import java.util.UUID;

@SpringBootApplication
@EnableDiscoveryClient
@Slf4j
public class AuthorizationServerApplication {

	// Scope métier portant les claims agent CRG transmis à KUMY/AgriScore (Variante A OIDC)
	private static final String AGENT_PROFILE_SCOPE = "agent_profile";

	@Value("${ui.app.url}")
	private String redirecturl;

	// Client OIDC fédéré KUMY/AgriScore - environnement de production
	@Value("${kumy.oidc.prod.client-id:kumy-agriscore-prod}")
	private String kumyProdClientId;
	@Value("${kumy.oidc.prod.client-secret:kumy-prod-secret}")
	private String kumyProdClientSecret;
	@Value("${kumy.oidc.prod.redirect-uri:https://idp.kumy.app/creditrural/callback}")
	private String kumyProdRedirectUri;

	// Client OIDC fédéré KUMY/AgriScore - environnement de test
	@Value("${kumy.oidc.test.client-id:kumy-agriscore-test}")
	private String kumyTestClientId;
	@Value("${kumy.oidc.test.client-secret:kumy-test-secret}")
	private String kumyTestClientSecret;
	@Value("${kumy.oidc.test.redirect-uri:https://idp.kumy.app/creditrural-test/callback}")
	private String kumyTestRedirectUri;

	public static void main(String[] args) {
		SpringApplication.run(AuthorizationServerApplication.class, args);
	}


	@Bean
	public ApplicationRunner runner(RegisteredClientRepository registeredClientRepository,
									BCryptPasswordEncoder passwordEncoder){
		return args -> {
			if(registeredClientRepository.findByClientId("client") == null){
				try {
					var registerClient = RegisteredClient.withId(UUID.randomUUID().toString())
						   .clientId("client").clientSecret("secret")
						   .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
						   .authorizationGrantTypes(types -> {
							    types.add(AuthorizationGrantType.AUTHORIZATION_CODE);
								types.add(AuthorizationGrantType.REFRESH_TOKEN);
						   })
						   .scopes(scopes -> {
							    scopes.add(OidcScopes.OPENID);
								scopes.add(OidcScopes.PROFILE);
								scopes.add(OidcScopes.EMAIL);
						   }
						   )
						   .redirectUri(redirecturl)
						   .postLogoutRedirectUri("http://127.0.0.1:8080")
						   .clientSettings(ClientSettings.builder().requireAuthorizationConsent(true).build())
						   .tokenSettings(TokenSettings.builder().refreshTokenTimeToLive(Duration.ofDays(90))
								   .accessTokenTimeToLive(Duration.ofDays(1)).build()).build();
				     registeredClientRepository.save(registerClient);
				}catch (Exception exception){
					log.error(exception.getMessage());
				}
			}

			// Clients fédérés KUMY/AgriScore (Variante A OIDC) - un par environnement
			registerKumyClient(registeredClientRepository, passwordEncoder,
					kumyProdClientId, kumyProdClientSecret, kumyProdRedirectUri);
			registerKumyClient(registeredClientRepository, passwordEncoder,
					kumyTestClientId, kumyTestClientSecret, kumyTestRedirectUri);
		};
	}

	/**
	 * Enregistre de façon idempotente un client confidentiel KUMY/AgriScore.
	 * Client serveur-à-serveur (connecteur KUMY) : CLIENT_SECRET_BASIC/POST + PKCE obligatoire,
	 * scopes openid/profile/email + agent_profile (claims métier agent). Pas d'écran de consentement
	 * (flux fédéré géré par le connecteur). Le secret est encodé en BCrypt comme les autres clients.
	 */
	private void registerKumyClient(RegisteredClientRepository repository,
									BCryptPasswordEncoder passwordEncoder,
									String clientId, String rawSecret, String redirectUri){
		var existing = repository.findByClientId(clientId);
		// Déjà enregistré avec le bon secret -> rien à faire (idempotent).
		if(existing != null && passwordEncoder.matches(rawSecret, existing.getClientSecret())){
			return;
		}
		// Conserve le même id pour METTRE À JOUR la ligne (sinon save() insère un doublon).
		String id = existing != null ? existing.getId() : UUID.randomUUID().toString();
		try {
			var kumyClient = RegisteredClient.withId(id)
					.clientId(clientId)
					.clientSecret(passwordEncoder.encode(rawSecret))
					.clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
					.clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
					.authorizationGrantTypes(types -> {
						types.add(AuthorizationGrantType.AUTHORIZATION_CODE);
						types.add(AuthorizationGrantType.REFRESH_TOKEN);
					})
					.scopes(scopes -> {
						scopes.add(OidcScopes.OPENID);
						scopes.add(OidcScopes.PROFILE);
						scopes.add(OidcScopes.EMAIL);
						scopes.add(AGENT_PROFILE_SCOPE);
					})
					.redirectUri(redirectUri)
					.clientSettings(ClientSettings.builder()
							.requireProofKey(true)               // PKCE obligatoire
							.requireAuthorizationConsent(false)  // flux fédéré via connecteur KUMY
							.build())
					.tokenSettings(TokenSettings.builder()
							.refreshTokenTimeToLive(Duration.ofDays(30))
							.accessTokenTimeToLive(Duration.ofMinutes(15))
							.build())
					.build();
			repository.save(kumyClient);
			log.info("KUMY OIDC client {}: {} (redirect: {})",
					existing != null ? "secret mis à jour" : "enregistré", clientId, redirectUri);
			if (rawSecret == null || rawSecret.startsWith("kumy-") && rawSecret.endsWith("-secret")) {
				log.warn("⚠️ Client KUMY {} utilise le SECRET PAR DÉFAUT — définir KUMY_OIDC_*_CLIENT_SECRET en prod !", clientId);
			}
		}catch (Exception exception){
			log.error("Failed to register KUMY client {}: {}", clientId, exception.getMessage());
		}
	}

}
