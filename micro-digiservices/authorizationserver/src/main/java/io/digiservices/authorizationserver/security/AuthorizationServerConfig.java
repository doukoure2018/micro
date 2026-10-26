package io.digiservices.authorizationserver.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.authorizationserver.perimetre.AgentPerimetreService;
import io.digiservices.authorizationserver.perimetre.RapprochementProfilService;
import io.digiservices.authorizationserver.model.User;
import io.digiservices.authorizationserver.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.core.oidc.endpoint.OidcParameterNames;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.client.JdbcRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.security.oauth2.server.authorization.token.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import io.digiservices.authorizationserver.controller.LoginController;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.http.Cookie;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

import static com.google.common.net.HttpHeaders.X_REQUESTED_WITH;
import static org.springframework.http.HttpHeaders.*;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.oauth2.server.authorization.OAuth2TokenType.ACCESS_TOKEN;


import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Configuration
@RequiredArgsConstructor
public class AuthorizationServerConfig {
    private static final String AUTHORITY_KEY = "authorities";

    // Scope métier KUMY/AgriScore (SSO fédéré OIDC) et rôles CRG concernés par AgriScore.
    private static final String AGENT_PROFILE_SCOPE = "agent_profile";
    /** Scope de l'outil de bureau « Rapprochement des encours » (DSIG, 2026-10-18). */
    private static final String RAPPROCHEMENT_SCOPE = "rapprochement";

    private final JwtConfiguration jwtConfiguration;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${UI_APP_URL:https://digi-creditrural-io.com}")
    private String uiAppUrl;

    @Value("${oauth.issuer:http://localhost:8080}")
    private String oauthIssuer;

    /** Code challenge PKCE fixe de la SPA digi (identique à celui du frontend). */
    @Value("${DIGI_SPA_CODE_CHALLENGE:HK02sitqCRpUlfLEX2xl4JGqaVQhNDsfTWH-oQzJHGw}")
    private String digiSpaCodeChallenge;

    private final UserRepository userRepository;
    private final AgentPerimetreService agentPerimetreService;
    private final RapprochementProfilService rapprochementProfilService;

    @Bean
    @Order(1)
    public SecurityFilterChain oauth2ServerConfig(HttpSecurity http, RegisteredClientRepository registeredClientRepository, OAuth2TokenCustomizer<JwtEncodingContext> customizer) throws Exception {
        http.cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()));

        var authorizationConfig = new OAuth2AuthorizationServerConfigurer();

        http
                .securityMatcher(authorizationConfig.getEndpointsMatcher())
                .with(authorizationConfig, authorizationServer -> authorizationServer
                        .oidc(oidc -> oidc.userInfoEndpoint(userInfo -> userInfo.userInfoMapper(this::mapUserInfo)))
                        .authorizationServerSettings(authorizationServerSettings())
                        .registeredClientRepository(registeredClientRepository)
                        .tokenGenerator(tokenGenerator())
                        .clientAuthentication(authentication -> {
                            authentication.authenticationConverter(new ClientRefreshTokenAuthenticationConverter());
                            authentication.authenticationProvider(new ClientAuthenticationProvider(registeredClientRepository));
                        }))
                .authorizeHttpRequests(authorize -> authorize.anyRequest().authenticated());
        http.exceptionHandling(exceptions -> exceptions.accessDeniedPage("/accessdenied")
                .defaultAuthenticationEntryPointFor(new LoginUrlAuthenticationEntryPoint("/login"),
                        new MediaTypeRequestMatcher(MediaType.TEXT_HTML)));
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http, AuthenticationConfiguration authConfig) throws Exception {
        http.cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()));

        http.securityMatcher("/api/**", "/user/**")
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/login").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                        }))
                .addFilterBefore(jsonAuthenticationFilter(authConfig), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
        http.cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()));

        http.securityMatcher("/**")
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/login", "/oauth2/authorize/**", "/oauth2/authorize").permitAll()
                        .requestMatchers("/images/**", "/css/**", "/js/**", "/favicon.ico").permitAll()
                        .requestMatchers(POST, "/logout").permitAll()
                        .requestMatchers("/mfa").hasAuthority("MFA_REQUIRED")
                        .anyRequest().authenticated());

        http.formLogin(login -> login
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .successHandler((request, response, authentication) -> {
                    log.info("========================================");
                    log.info("🎉 Login Success Handler");
                    log.info("User: {}", authentication.getName());

                    // Chercher le cookie mobile
                    String mobileOAuthUrl = null;
                    Cookie[] cookies = request.getCookies();
                    if (cookies != null) {
                        for (Cookie cookie : cookies) {
                            if ("MOBILE_OAUTH_URL".equals(cookie.getName())) {
                                mobileOAuthUrl = java.net.URLDecoder.decode(
                                        cookie.getValue(),
                                        java.nio.charset.StandardCharsets.UTF_8
                                );
                                log.info("📱 Found mobile OAuth cookie");
                                break;
                            }
                        }
                    }

                    log.info("Mobile OAuth URL: {}", mobileOAuthUrl);

                    // Priorité 1: Redirection mobile via cookie
                    if (mobileOAuthUrl != null && !mobileOAuthUrl.isEmpty()) {
                        log.info("📱 Redirecting to mobile OAuth URL");

                        // IMPORTANT: Ajouter un cookie pour indiquer que le login est fait
                        Cookie loginDoneCookie = new Cookie("MOBILE_LOGIN_DONE", "true");
                        loginDoneCookie.setPath("/");
                        loginDoneCookie.setMaxAge(60); // 1 minute
                        loginDoneCookie.setHttpOnly(true);
                        loginDoneCookie.setSecure(true);
                        response.addCookie(loginDoneCookie);

                        response.sendRedirect(mobileOAuthUrl);
                        return;
                    }

                    // Priorités 2 à 4 : reprise d'un flux OAuth2 en attente (SavedRequest standard, repli
                    // session, repli cookie) — MAIS uniquement si ce flux est celui pour lequel la page de
                    // login a été affichée (champ caché flow_client, posé par LoginController).
                    // Incident du 2026-10-12 : une autorisation KUMY laissée en attente dans la session par
                    // l'onglet AgriScore était consommée par un login fait sur /auth/login pour digi ;
                    // l'utilisateur atterrissait sur le handler Firebase sans état (« missing initial state »).
                    String flowClient = request.getParameter(MobileOAuthSessionFilter.FLOW_CLIENT_PARAM);
                    if (flowClient == null || flowClient.isBlank()) {
                        flowClient = MobileOAuthSessionFilter.DIGI_SPA_CLIENT_ID;
                    }
                    HttpSession session = request.getSession(false);
                    String continuation = null;
                    String origine = null;
                    if (session != null) {
                        SavedRequest savedRequest = (SavedRequest) session.getAttribute("SPRING_SECURITY_SAVED_REQUEST");
                        if (savedRequest != null && savedRequest.getRedirectUrl().contains("/oauth2/authorize")) {
                            continuation = savedRequest.getRedirectUrl();
                            origine = "SavedRequest";
                        }
                        if (continuation == null) {
                            Object webOAuthUrl = session.getAttribute(MobileOAuthSessionFilter.WEB_AUTH_SESSION_KEY);
                            if (webOAuthUrl != null && !webOAuthUrl.toString().isEmpty()) {
                                continuation = webOAuthUrl.toString();
                                origine = "repli session";
                            }
                        }
                    }
                    if (continuation == null && cookies != null) {
                        for (Cookie cookie : cookies) {
                            if (MobileOAuthSessionFilter.WEB_AUTH_COOKIE.equals(cookie.getName())
                                    && cookie.getValue() != null && !cookie.getValue().isEmpty()) {
                                String url = java.net.URLDecoder.decode(cookie.getValue(), java.nio.charset.StandardCharsets.UTF_8);
                                if (url.contains("/oauth2/authorize")) {
                                    continuation = url;
                                    origine = "repli cookie";
                                }
                                break;
                            }
                        }
                    }
                    // Les replis ne servent qu'une fois, quel que soit l'issue.
                    if (session != null) {
                        session.removeAttribute(MobileOAuthSessionFilter.WEB_AUTH_SESSION_KEY);
                        session.removeAttribute(MobileOAuthSessionFilter.WEB_AUTH_CLIENT_KEY);
                        session.removeAttribute(MobileOAuthSessionFilter.WEB_AUTH_AT_KEY);
                        session.removeAttribute(LoginController.LOGIN_FLOW_CLIENT_KEY);
                    }
                    clearWebOAuthCookie(response);

                    if (continuation != null) {
                        String clientDuFlux = clientIdDe(continuation);
                        if (flowClient.equals(clientDuFlux)) {
                            log.info("➡️ Reprise du flux OAuth2 ({}) pour le client '{}'", origine, clientDuFlux);
                            response.sendRedirect(continuation);
                            return;
                        }
                        log.warn("⚠️ Flux OAuth2 en attente pour '{}' ({}) ignoré : le login a été fait pour '{}'",
                                clientDuFlux, origine, flowClient);
                        if (session != null) {
                            session.removeAttribute("SPRING_SECURITY_SAVED_REQUEST");
                        }
                    }

                    // Vérifier MFA
                    if (authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("MFA_REQUIRED"))) {
                        log.info("🔐 MFA required");
                        response.sendRedirect("/mfa");
                        return;
                    }

                    // Login fait pour digi sans flux en attente : repartir sur l'autorisation digi plutôt
                    // que sur l'accueil sans code (cause du « double login »).
                    if (MobileOAuthSessionFilter.DIGI_SPA_CLIENT_ID.equals(flowClient)) {
                        String url = digiAuthorizeUrl();
                        log.info("🌐 Login digi sans flux en attente : redirection vers l'autorisation digi");
                        response.sendRedirect(url);
                        return;
                    }

                    // Redirection par défaut
                    log.info("🌐 Default redirect to: {}", uiAppUrl);
                    response.sendRedirect(uiAppUrl);
                })
                .failureHandler(new SimpleUrlAuthenticationFailureHandler("/login?error")));

        http.logout(logout -> logout
                .logoutSuccessUrl(uiAppUrl)
                .addLogoutHandler(new CookieClearingLogoutHandler("JSESSIONID")));

        return http.build();
    }

    @Bean
    public JsonAuthenticationFilter jsonAuthenticationFilter(AuthenticationConfiguration authConfig) throws Exception {
        JsonAuthenticationFilter filter = new JsonAuthenticationFilter();
        filter.setAuthenticationManager(authConfig.getAuthenticationManager());
        filter.setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/api/login", "POST"));

        filter.setAuthenticationSuccessHandler((request, response, authentication) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"status\": \"success\", \"message\": \"Authentication successful\"}");
        });

        filter.setAuthenticationFailureHandler((request, response, exception) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"status\": \"error\", \"message\": \"" + exception.getMessage() + "\"}");
        });

        return filter;
    }

    public class JsonAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
        @Override
        public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
                throws AuthenticationException {
            if (!request.getMethod().equals("POST")) {
                throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
            }

            try {
                Map<String, String> credentials = objectMapper.readValue(
                        request.getInputStream(),
                        new TypeReference<Map<String, String>>() {}
                );

                String username = credentials.getOrDefault(getUsernameParameter(), "");
                String password = credentials.getOrDefault(getPasswordParameter(), "");

                UsernamePasswordAuthenticationToken authRequest =
                        UsernamePasswordAuthenticationToken.unauthenticated(username, password);

                setDetails(request, authRequest);

                return this.getAuthenticationManager().authenticate(authRequest);
            } catch (IOException e) {
                throw new AuthenticationServiceException("Authentication failed: " + e.getMessage(), e);
            }
        }
    }

    @Bean
    public OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator() {
        var jwtGenerator = UserJwtGenerator.init(new NimbusJwtEncoder((jwtConfiguration.jwkSource())), userRepository);
        jwtGenerator.setJwtCustomizer(customizer());
        OAuth2TokenGenerator<OAuth2RefreshToken> refreshTokenOAuth2TokenGenerator = new ClientOAuth2RefreshTokenGenerator();
        return new DelegatingOAuth2TokenGenerator(jwtGenerator, refreshTokenOAuth2TokenGenerator);
    }

    @Bean
    public SavedRequestAwareAuthenticationSuccessHandler authenticationSuccessHandler() {
        return new SavedRequestAwareAuthenticationSuccessHandler();
    }

    /** Efface le cookie de fallback web OAuth2 (apres reprise du flux ou redirection standard). */
    /** client_id d'une URL /oauth2/authorize mémorisée (vide si absent). */
    private static String clientIdDe(String authorizeUrl) {
        int q = authorizeUrl.indexOf('?');
        if (q < 0) return "";
        for (String param : authorizeUrl.substring(q + 1).split("&")) {
            if (param.startsWith("client_id=")) {
                return java.net.URLDecoder.decode(param.substring("client_id=".length()),
                        java.nio.charset.StandardCharsets.UTF_8);
            }
        }
        return "";
    }

    /** Autorisation de la SPA digi, telle que son bouton « Se connecter » la construit. */
    private String digiAuthorizeUrl() {
        return oauthIssuer + "/oauth2/authorize?response_type=code&client_id="
                + MobileOAuthSessionFilter.DIGI_SPA_CLIENT_ID + "&scope=openid&redirect_uri="
                + java.net.URLEncoder.encode(uiAppUrl, java.nio.charset.StandardCharsets.UTF_8)
                + "&code_challenge_method=S256&code_challenge=" + digiSpaCodeChallenge;
    }

    private static void clearWebOAuthCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(MobileOAuthSessionFilter.WEB_AUTH_COOKIE, "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
    }

    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
                .issuer(oauthIssuer)  // ← Utiliser la variable
                .build();
    }

    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> customizer() {
        return context -> {
            Authentication principal = context.getPrincipal();

            // Add authorities to access token
            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
                context.getClaims().claims(claims ->
                        claims.put(AUTHORITY_KEY, getAuthoritiesAsString(context))
                );
            }

            // Add user info to ID token for Flutter app
            if (OidcParameterNames.ID_TOKEN.equals(context.getTokenType().getValue())) {
                try {
                    // The principal IS the User object!
                    Object principalObj = principal.getPrincipal();

                    if (principalObj instanceof User) {
                        User user = (User) principalObj;

                        log.info("✅ Adding user claims to ID token for user: {} (ID: {})",
                                user.getEmail(), user.getUserId());

                        context.getClaims()
                                .claim("sub", user.getUserId().toString())
                                .claim("name", user.getFirstName() + " " + user.getLastName())
                                .claim("given_name", user.getFirstName())
                                .claim("family_name", user.getLastName())
                                .claim("email", user.getEmail())
                                .claim("preferred_username", user.getEmail());
                    } else {
                        log.warn("⚠️ Principal is not a User object: {}", principalObj.getClass().getName());
                    }
                } catch (Exception e) {
                    log.error("❌ Error adding user claims to ID token: {}", e.getMessage(), e);
                }
            }

            // Claims métier agent CRG pour la fédération KUMY/AgriScore — uniquement dans l'ID Token
            // et uniquement si le scope agent_profile a été accordé (les autres clients ne les reçoivent pas).
            if (OidcParameterNames.ID_TOKEN.equals(context.getTokenType().getValue())
                    && context.getAuthorizedScopes().contains(AGENT_PROFILE_SCOPE)
                    && principal.getPrincipal() instanceof User user) {
                addAgentProfileClaims(context, user);
            }

            // Claims de l'outil de rapprochement des encours — ID Token, scope rapprochement.
            if (OidcParameterNames.ID_TOKEN.equals(context.getTokenType().getValue())
                    && context.getAuthorizedScopes().contains(RAPPROCHEMENT_SCOPE)
                    && principal.getPrincipal() instanceof User user) {
                addRapprochementClaims(context, user);
            }
        };
    }

    /**
     * Ajoute les claims du scope {@code rapprochement} : profil de l'utilisateur dans l'outil
     * de rapprochement, niveau de perimetre, codes de points de service SAF et droit de
     * recalculer l'etat consolide du reseau. N'emet rien si l'utilisateur n'est pas habilite.
     */
    private void addRapprochementClaims(JwtEncodingContext context, User user) {
        try {
            RapprochementProfilService.Resolution resolution =
                    rapprochementProfilService.resolve(user.getUserId());
            if (resolution.horsOutil()) {
                log.warn("⚠️ Utilisateur {} (role '{}') non habilité au rapprochement — claims non émis",
                        user.getUserId(), user.getRole());
                return;
            }
            rapprochementProfilService.claims(resolution)
                    .forEach((name, value) -> context.getClaims().claim(name, value));
            log.info("✅ Claims rapprochement ajoutés pour {} (profil {}, niveau {})",
                    user.getUserId(), resolution.profil(), resolution.niveau());
        } catch (Exception e) {
            log.error("❌ Erreur ajout des claims rapprochement pour user {}: {}", user.getUserId(), e.getMessage(), e);
        }
    }

    /**
     * Ajoute les claims du scope {@code agent_profile} transmis à KUMY/AgriScore : identité,
     * rôle AgriScore, niveau de périmètre et rattachement géographique limité à ce niveau
     * (cf. {@link AgentPerimetreService}). N'émet rien si l'agent est hors périmètre AgriScore
     * (seuls AGENT_CREDIT, RA, DA, DR, DG et MANAGER du service DE sont concernés).
     */
    private void addAgentProfileClaims(JwtEncodingContext context, User user) {
        try {
            AgentPerimetreService.Resolution resolution = agentPerimetreService.resolve(user.getUserId());
            if (resolution.horsPerimetre()) {
                log.warn("⚠️ Agent {} (role '{}') hors périmètre AgriScore — claims agent_profile non émis",
                        user.getUserId(), user.getRole());
                return;
            }
            agentPerimetreService.idTokenClaims(user.getUserId(), resolution)
                    .forEach((name, value) -> context.getClaims().claim(name, value));
            log.info("✅ Claims agent_profile ajoutés pour agent CR-{} (role {}, niveau {})",
                    user.getUserId(), resolution.role(), resolution.niveau());
        } catch (Exception e) {
            log.error("❌ Erreur ajout des claims agent_profile pour user {}: {}", user.getUserId(), e.getMessage(), e);
        }
    }

    // Claims techniques propres au JWT, à ne pas exposer sur /userinfo.
    private static final Set<String> JWT_TECHNICAL_CLAIMS =
            Set.of("iss", "aud", "exp", "iat", "nbf", "jti", "azp", "nonce", "sid", "auth_time", "at_hash", "c_hash");

    /**
     * Mapper /userinfo : renvoie les claims métier de l'ID Token (dont agent_id, role, agence_*
     * quand le scope agent_profile est accordé) afin que KUMY puisse rafraîchir le profil de l'agent.
     * On retire les claims purement techniques du JWT.
     */
    private org.springframework.security.oauth2.core.oidc.OidcUserInfo mapUserInfo(
            org.springframework.security.oauth2.server.authorization.oidc.authentication.OidcUserInfoAuthenticationContext context) {
        var authorization = context.getAuthorization();
        var idToken = authorization.getToken(org.springframework.security.oauth2.core.oidc.OidcIdToken.class).getToken();
        Map<String, Object> claims = new HashMap<>(idToken.getClaims());
        claims.keySet().removeAll(JWT_TECHNICAL_CLAIMS);

        // Périmètre géographique complet (arbre delegations -> agences -> points_de_service) :
        // uniquement pour le scope agent_profile (KUMY). Rattachement manquant => null explicite.
        if (authorization.getAuthorizedScopes().contains(AGENT_PROFILE_SCOPE)) {
            Long userId = parseUserId(claims.get("sub"));
            if (userId != null) {
                try {
                    AgentPerimetreService.Resolution resolution = agentPerimetreService.resolve(userId);
                    claims.putAll(agentPerimetreService.userInfoClaims(userId, resolution));
                } catch (Exception e) {
                    log.error("❌ Erreur calcul du périmètre /userinfo pour user {}: {}", userId, e.getMessage(), e);
                }
            }
        }

        // Profil et périmètre de l'outil de rapprochement : la liste des points de service y est
        // recalculée à chaque appel, pour qu'une mutation dans digi s'applique sans nouveau login.
        if (authorization.getAuthorizedScopes().contains(RAPPROCHEMENT_SCOPE)) {
            Long userId = parseUserId(claims.get("sub"));
            if (userId != null) {
                try {
                    claims.putAll(rapprochementProfilService.claims(rapprochementProfilService.resolve(userId)));
                } catch (Exception e) {
                    log.error("❌ Erreur calcul du profil rapprochement /userinfo pour user {}: {}",
                            userId, e.getMessage(), e);
                }
            }
        }
        return new org.springframework.security.oauth2.core.oidc.OidcUserInfo(claims);
    }

    private static Long parseUserId(Object sub) {
        if (sub == null) {
            return null;
        }
        try {
            return Long.parseLong(sub.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // Method for access token authorities (returns String)
    private String getAuthoritiesAsString(JwtEncodingContext context) {
        return context.getPrincipal().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
    }


    @Bean
    public RegisteredClientRepository registeredClientRepository(JdbcTemplate jdbcTemplate) {
        JdbcRegisteredClientRepository repository = new JdbcRegisteredClientRepository(jdbcTemplate);

        // Check if mobile client exists, if not create it
        try {
            RegisteredClient existingClient = repository.findByClientId("mobile-app-client");
            if (existingClient == null) {
                RegisteredClient mobileClient = RegisteredClient.withId(UUID.randomUUID().toString())
                        .clientId("mobile-app-client")
                        .clientName("DIGI CRG Mobile App")
                        .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
                        .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                        .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                        .redirectUri("com.digiservices.digicrg://oauth2redirect")
                        .postLogoutRedirectUri("com.digiservices.digicrg://oauth2redirect")
                        .scope(OidcScopes.OPENID)
                        .scope(OidcScopes.PROFILE)
                        .scope(OidcScopes.EMAIL)
                        .clientSettings(ClientSettings.builder()
                                .requireProofKey(true)
                                .requireAuthorizationConsent(false)
                                .build())
                        .tokenSettings(TokenSettings.builder()
                                .accessTokenTimeToLive(Duration.ofHours(1))
                                .refreshTokenTimeToLive(Duration.ofDays(30))
                                .reuseRefreshTokens(false)
                                .build())
                        .build();

                repository.save(mobileClient);
                log.info("Mobile client registered successfully");
            } else {
                log.info("Mobile client already exists");
            }
        } catch (Exception e) {
            log.error("Error checking/creating mobile client: {}", e.getMessage());
        }

        return repository;
    }



    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(List.of(
                "http://localhost:4200",
                "http://51.91.254.218:4200",
                "http://digi-creditrural-io.com",
                "https://digi-creditrural-io.com",
                "http://www.digi-creditrural-io.com",
                "https://www.digi-creditrural-io.com",
                // Add mobile origins
                "http://localhost", // For local mobile testing
                "capacitor://localhost",
                "com.digiservices.digicrg://"  // ← AJOUTEZ CE SCHÉMA
        ));
        corsConfiguration.setAllowedHeaders(Arrays.asList(
                ORIGIN, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_TYPE,
                ACCEPT, AUTHORIZATION, X_REQUESTED_WITH,
                ACCESS_CONTROL_REQUEST_METHOD, ACCESS_CONTROL_REQUEST_HEADERS,
                ACCESS_CONTROL_ALLOW_CREDENTIALS, "X-XSRF-TOKEN"
        ));
        corsConfiguration.setExposedHeaders(Arrays.asList(
                ORIGIN, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_TYPE,
                ACCEPT, AUTHORIZATION, X_REQUESTED_WITH,
                ACCESS_CONTROL_REQUEST_METHOD, ACCESS_CONTROL_REQUEST_HEADERS,
                ACCESS_CONTROL_ALLOW_CREDENTIALS
        ));
        corsConfiguration.setAllowedMethods(Arrays.asList(
                GET.name(), POST.name(), PUT.name(), PATCH.name(),
                DELETE.name(), OPTIONS.name()
        ));
        corsConfiguration.setMaxAge(3600L);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    private String getAuthorities(JwtEncodingContext context) {
        return context.getPrincipal().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
    }
}


