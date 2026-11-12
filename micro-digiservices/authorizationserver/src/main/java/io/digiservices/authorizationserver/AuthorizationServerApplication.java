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
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@SpringBootApplication
@EnableDiscoveryClient
@Slf4j
public class AuthorizationServerApplication {

	// Scope métier portant les claims agent CRG transmis à KUMY/AgriScore (Variante A OIDC)
	private static final String AGENT_PROFILE_SCOPE = "agent_profile";

	// Scope de l'outil de bureau « Rapprochement des encours » : profil, niveau de perimetre
	// et codes de points de service SAF (proposition DSIG du 2026-10-18).
	private static final String RAPPROCHEMENT_SCOPE = "rapprochement";

	@Value("${ui.app.url}")
	private String redirecturl;

	// Client OIDC fédéré KUMY/AgriScore - environnement de production
	@Value("${kumy.oidc.prod.client-id:kumy-agriscore-prod}")
	private String kumyProdClientId;
	@Value("${kumy.oidc.prod.client-secret:kumy-prod-secret}")
	private String kumyProdClientSecret;
	// Redirect = handler du broker GCIP/Firebase de KUMY (remplace l'ancien callback idp.kumy.app)
	@Value("${kumy.oidc.prod.redirect-uri:https://kumy-agripilot-prod.firebaseapp.com/__/auth/handler}")
	private String kumyProdRedirectUri;

	// Client OIDC fédéré KUMY/AgriScore - environnement de test
	@Value("${kumy.oidc.test.client-id:kumy-agriscore-test}")
	private String kumyTestClientId;
	@Value("${kumy.oidc.test.client-secret:kumy-test-secret}")
	private String kumyTestClientSecret;
	@Value("${kumy.oidc.test.redirect-uri:https://kumy-agripilot-dev.firebaseapp.com/__/auth/handler}")
	private String kumyTestRedirectUri;
	// Redirect supplémentaire pour le client de TEST uniquement (ex. callback Postman pour valider le flux OIDC).
	// Vide => non ajoutée. Réversible : retirer la valeur et redémarrer pour la supprimer du client.
	@Value("${kumy.oidc.test.extra-redirect-uri:https://oauth.pstmn.io/v1/callback}")
	private String kumyTestExtraRedirectUri;

	// Client desktop "Rapprochement Solde" (app Python Tkinter) — client PUBLIC (RFC 8252),
	// PKCE OBLIGATOIRE, redirect boucle locale 127.0.0.1 sur port fixe.
	@Value("${desktop.oidc.client-id:crg-rapprochement-desktop}")
	private String desktopClientId;
	@Value("${desktop.oidc.redirect-uri:http://127.0.0.1:8765/callback}")
	private String desktopRedirectUri;

	// Client desktop "Rapprochement des encours" (comptes clients et credits) — client PUBLIC
	// distinct du precedent : un client par application, pour pouvoir en couper un sans l'autre
	// et garder des journaux d'authentification lisibles.
	@Value("${rapprochement.oidc.client-id:crg-rapprochement-encours}")
	private String rapprochementClientId;
	@Value("${rapprochement.oidc.redirect-uri:http://127.0.0.1:8766/callback}")
	private String rapprochementRedirectUri;

	// Client de l'application mobile des agents de credit et des directeurs d'agence — client
	// PUBLIC (aucun secret ne tient dans un APK), PKCE obligatoire, redirection par schema
	// d'application. Enregistre ici depuis le 2026-11-12 : il l'etait auparavant dans
	// AuthorizationServerConfig, en mode « creer si absent », donc jamais mis a jour.
	@Value("${mobile.oidc.client-id:mobile-app-client}")
	private String mobileClientId;
	@Value("${mobile.oidc.redirect-uri:com.digiservices.digicrg://oauth2redirect}")
	private String mobileRedirectUri;
	// Redirection supplementaire pour les essais (client de developpement Expo, par exemple).
	// Vide => non ajoutee. Reversible : retirer la valeur et redemarrer.
	@Value("${mobile.oidc.extra-redirect-uri:}")
	private String mobileExtraRedirectUri;

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
					kumyProdClientId, kumyProdClientSecret, Set.of(kumyProdRedirectUri));

			// Client de test : redirect KUMY + éventuelle redirect supplémentaire (Postman) pour les essais.
			Set<String> testRedirectUris = new LinkedHashSet<>();
			testRedirectUris.add(kumyTestRedirectUri);
			if (kumyTestExtraRedirectUri != null && !kumyTestExtraRedirectUri.isBlank()) {
				testRedirectUris.add(kumyTestExtraRedirectUri.trim());
			}
			registerKumyClient(registeredClientRepository, passwordEncoder,
					kumyTestClientId, kumyTestClientSecret, testRedirectUris);

			// Client desktop public (app Python de rapprochement solde) — PKCE + loopback
			registerDesktopClient(registeredClientRepository, desktopClientId, desktopRedirectUri,
					AGENT_PROFILE_SCOPE);

			// Client desktop public de l'outil « Rapprochement des encours » — PKCE + loopback,
			// scope rapprochement (profil, niveau, codes de points de service).
			registerDesktopClient(registeredClientRepository, rapprochementClientId, rapprochementRedirectUri,
					RAPPROCHEMENT_SCOPE);

			// Client public de l'application mobile (agents de credit et directeurs d'agence).
			Set<String> mobileRedirectUris = new LinkedHashSet<>();
			mobileRedirectUris.add(mobileRedirectUri);
			if (mobileExtraRedirectUri != null && !mobileExtraRedirectUri.isBlank()) {
				mobileRedirectUris.add(mobileExtraRedirectUri.trim());
			}
			registerMobileClient(registeredClientRepository, mobileClientId, mobileRedirectUris);
		};
	}

	// TokenSettings cibles du client desktop : access court (15 min), refresh 24 h GLISSANTES
	// grâce à la rotation (reuseRefreshTokens=false : chaque renouvellement émet un nouveau
	// refresh token valable 24 h -> session prolongée tant que l'app est utilisée,
	// re-login après 24 h d'inactivité).
	private static final Duration DESKTOP_ACCESS_TTL = Duration.ofMinutes(15);
	private static final Duration DESKTOP_REFRESH_TTL = Duration.ofHours(24);

	/**
	 * Enregistre OU MET À JOUR (idempotent) le client desktop PUBLIC "rapprochement solde" :
	 * authentification NONE (pas de secret embarqué), PKCE OBLIGATOIRE (client public, RFC 8252),
	 * redirect en boucle locale 127.0.0.1 (port non comparé par SAS pour les IP loopback).
	 * Scopes openid/profile/email/agent_profile.
	 * Contrairement à l'ancienne version (create-if-absent), les TokenSettings sont réappliqués
	 * si divergents : indispensable avec le repository JDBC, sinon la ligne existante en base
	 * conserve d'anciennes valeurs quel que soit le code.
	 */
	private void registerDesktopClient(RegisteredClientRepository repository,
									   String clientId, String redirectUri, String businessScope){
		var existing = repository.findByClientId(clientId);
		if(existing != null){
			var ts = existing.getTokenSettings();
			boolean tokenSettingsOk = DESKTOP_ACCESS_TTL.equals(ts.getAccessTokenTimeToLive())
					&& DESKTOP_REFRESH_TTL.equals(ts.getRefreshTokenTimeToLive())
					&& !ts.isReuseRefreshTokens();
			boolean redirectOk = existing.getRedirectUris().contains(redirectUri);
			boolean pkceOk = existing.getClientSettings().isRequireProofKey();
			boolean scopeOk = existing.getScopes().contains(businessScope);
			if(tokenSettingsOk && redirectOk && pkceOk && scopeOk){
				return;
			}
		}
		// Conserve le même id pour METTRE À JOUR la ligne JDBC (sinon save() insère un doublon).
		String id = existing != null ? existing.getId() : UUID.randomUUID().toString();
		try {
			var desktopClient = RegisteredClient.withId(id)
					.clientId(clientId)
					.clientAuthenticationMethod(ClientAuthenticationMethod.NONE)   // client public, pas de secret
					.authorizationGrantTypes(types -> {
						types.add(AuthorizationGrantType.AUTHORIZATION_CODE);
						types.add(AuthorizationGrantType.REFRESH_TOKEN);
					})
					.scopes(scopes -> {
						scopes.add(OidcScopes.OPENID);
						scopes.add(OidcScopes.PROFILE);
						scopes.add(OidcScopes.EMAIL);
						scopes.add(businessScope);
					})
					.redirectUri(redirectUri)
					.clientSettings(ClientSettings.builder()
							.requireProofKey(true)               // PKCE obligatoire (client public)
							.requireAuthorizationConsent(false)
							.build())
					.tokenSettings(TokenSettings.builder()
							.accessTokenTimeToLive(DESKTOP_ACCESS_TTL)
							.refreshTokenTimeToLive(DESKTOP_REFRESH_TTL)
							.reuseRefreshTokens(false)           // rotation des refresh tokens
							.build())
					.build();
			repository.save(desktopClient);
			log.info("Desktop OIDC client {}: {} (redirect: {}, scope {}, access {} / refresh {} / rotation)",
					existing != null ? "mis à jour" : "enregistré", clientId, redirectUri, businessScope,
					DESKTOP_ACCESS_TTL, DESKTOP_REFRESH_TTL);
		}catch (Exception exception){
			log.error("Failed to register desktop client {}: {}", clientId, exception.getMessage());
		}
	}

	// TokenSettings du client mobile : acces 1 h, refresh 30 jours GLISSANTS grace a la rotation
	// (reuseRefreshTokens=false). Un agent en tournee ne doit pas avoir a se reconnecter entre deux
	// visites ; la rotation fait qu'un refresh token copie cesse de servir des que l'application en
	// obtient un nouveau. Le blocage d'un compte (V182) coupe le renouvellement dans la foulee.
	private static final Duration MOBILE_ACCESS_TTL = Duration.ofHours(1);
	private static final Duration MOBILE_REFRESH_TTL = Duration.ofDays(30);

	/**
	 * Enregistre OU MET A JOUR (idempotent) le client PUBLIC de l'application mobile :
	 * authentification NONE (aucun secret ne tient dans un APK), PKCE OBLIGATOIRE (RFC 8252),
	 * redirection par schema d'application {@code com.digiservices.digicrg://oauth2redirect}.
	 *
	 * <p>Scopes openid/profile/email <b>et {@code agent_profile}</b> : l'application recoit dans
	 * l'ID Token le role de l'agent et son rattachement (delegation, agence, point de service),
	 * ce qui lui evite un appel de plus au demarrage et lui permet d'afficher son point de service
	 * hors connexion. Les claims ne sont emis que pour les roles du reseau ; un compte hors
	 * perimetre obtient un jeton sans ces claims, sans erreur.</p>
	 *
	 * <p>Ce client existait deja, cree au demarrage par {@code AuthorizationServerConfig} en mode
	 * « creer si absent » : la ligne presente en base ne changeait donc JAMAIS, quel que soit le
	 * code. C'est le piege deja rencontre sur le client desktop le 2026-07-06. La mise a jour est
	 * ici reappliquee tant que la ligne diverge de ce que le code demande.</p>
	 */
	private void registerMobileClient(RegisteredClientRepository repository,
									  String clientId, Set<String> redirectUris){
		var existing = repository.findByClientId(clientId);
		if(existing != null){
			var ts = existing.getTokenSettings();
			boolean tokenSettingsOk = MOBILE_ACCESS_TTL.equals(ts.getAccessTokenTimeToLive())
					&& MOBILE_REFRESH_TTL.equals(ts.getRefreshTokenTimeToLive())
					&& !ts.isReuseRefreshTokens();
			// equals et non containsAll : la configuration fait autorite sur les redirections d'un
			// client PUBLIC. Une redirection ajoutee a la main en base est donc retiree au demarrage.
			boolean redirectsOk = existing.getRedirectUris().equals(redirectUris);
			boolean pkceOk = existing.getClientSettings().isRequireProofKey();
			boolean scopeOk = existing.getScopes().contains(AGENT_PROFILE_SCOPE);
			boolean publicOk = existing.getClientAuthenticationMethods().contains(ClientAuthenticationMethod.NONE);
			if(tokenSettingsOk && redirectsOk && pkceOk && scopeOk && publicOk){
				return;
			}
		}
		// Conserve le meme id pour METTRE A JOUR la ligne JDBC (sinon save() insere un doublon).
		String id = existing != null ? existing.getId() : UUID.randomUUID().toString();
		try {
			var mobileClient = RegisteredClient.withId(id)
					.clientId(clientId)
					.clientName("DIGI CRG Mobile App")
					.clientAuthenticationMethod(ClientAuthenticationMethod.NONE)   // client public, pas de secret
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
					.redirectUris(uris -> uris.addAll(redirectUris))
					.postLogoutRedirectUris(uris -> uris.addAll(redirectUris))
					.clientSettings(ClientSettings.builder()
							.requireProofKey(true)               // PKCE obligatoire (client public)
							.requireAuthorizationConsent(false)  // application interne, pas d'ecran de consentement
							.build())
					.tokenSettings(TokenSettings.builder()
							.accessTokenTimeToLive(MOBILE_ACCESS_TTL)
							.refreshTokenTimeToLive(MOBILE_REFRESH_TTL)
							.reuseRefreshTokens(false)           // rotation des refresh tokens
							.build())
					.build();
			repository.save(mobileClient);
			log.info("Mobile OIDC client {}: {} (redirects: {}, scope {}, access {} / refresh {} / rotation)",
					existing != null ? "mis a jour" : "enregistre", clientId, redirectUris, AGENT_PROFILE_SCOPE,
					MOBILE_ACCESS_TTL, MOBILE_REFRESH_TTL);
		}catch (Exception exception){
			log.error("Failed to register mobile client {}: {}", clientId, exception.getMessage());
		}
	}

	/**
	 * Enregistre de façon idempotente un client confidentiel KUMY/AgriScore.
	 * Client serveur-à-serveur (connecteur KUMY) : CLIENT_SECRET_BASIC/POST + PKCE obligatoire,
	 * scopes openid/profile/email + agent_profile (claims métier agent). Pas d'écran de consentement
	 * (flux fédéré géré par le connecteur). Le secret est encodé en BCrypt comme les autres clients.
	 */
	private void registerKumyClient(RegisteredClientRepository repository,
									BCryptPasswordEncoder passwordEncoder,
									String clientId, String rawSecret, Set<String> redirectUris){
		var existing = repository.findByClientId(clientId);
		boolean secretOk = existing != null && passwordEncoder.matches(rawSecret, existing.getClientSecret());
		boolean redirectsOk = existing != null && existing.getRedirectUris().equals(redirectUris);
		// PKCE optionnel pour KUMY (broker GCIP confidentiel, n'émet pas de code_challenge).
		boolean pkceOk = existing != null && !existing.getClientSettings().isRequireProofKey();
		// Déjà enregistré avec le bon secret, les bonnes redirect URIs ET PKCE optionnel -> rien à faire.
		if(existing != null && secretOk && redirectsOk && pkceOk){
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
					.redirectUris(uris -> uris.addAll(redirectUris))
					.clientSettings(ClientSettings.builder()
							.requireProofKey(false)              // PKCE optionnel : client confidentiel (broker GCIP KUMY n'émet pas de code_challenge)
							.requireAuthorizationConsent(false)  // flux fédéré via broker KUMY
							.build())
					.tokenSettings(TokenSettings.builder()
							.refreshTokenTimeToLive(Duration.ofDays(30))
							.accessTokenTimeToLive(Duration.ofMinutes(15))
							.build())
					.build();
			repository.save(kumyClient);
			log.info("KUMY OIDC client {}: {} (redirects: {})",
					existing != null ? "mis à jour" : "enregistré", clientId, redirectUris);
			if (rawSecret == null || rawSecret.startsWith("kumy-") && rawSecret.endsWith("-secret")) {
				log.warn("⚠️ Client KUMY {} utilise le SECRET PAR DÉFAUT — définir KUMY_OIDC_*_CLIENT_SECRET en prod !", clientId);
			}
		}catch (Exception exception){
			log.error("Failed to register KUMY client {}: {}", clientId, exception.getMessage());
		}
	}

}
