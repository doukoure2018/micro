package io.digiservices.authorizationserver.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.authorizationserver.model.AgentProfile;
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
    private static final Set<String> AGENT_PROFILE_ROLES = Set.of("AGENT_CREDIT", "RA", "DA", "DR");

    private final JwtConfiguration jwtConfiguration;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${UI_APP_URL:https://digi-creditrural-io.com}")
    private String uiAppUrl;

    @Value("${oauth.issuer:http://localhost:8080}")
    private String oauthIssuer;

    private final UserRepository userRepository;

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

                    // Priorité 2: Saved Request standard
                    HttpSession session = request.getSession(false);
                    if (session != null) {
                        SavedRequest savedRequest = (SavedRequest) session.getAttribute("SPRING_SECURITY_SAVED_REQUEST");
                        if (savedRequest != null) {
                            String redirectUrl = savedRequest.getRedirectUrl();
                            log.info("📋 Found saved request: {}", redirectUrl);
                            if (redirectUrl.contains("/oauth2/authorize")) {
                                log.info("➡️ Redirecting to OAuth2 flow");
                                response.sendRedirect(redirectUrl);
                                return;
                            }
                        }
                    }

                    // Vérifier MFA
                    if (authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("MFA_REQUIRED"))) {
                        log.info("🔐 MFA required");
                        response.sendRedirect("/mfa");
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
        var jwtGenerator = UserJwtGenerator.init(new NimbusJwtEncoder((jwtConfiguration.jwkSource())));
        jwtGenerator.setJwtCustomizer(customizer());
        OAuth2TokenGenerator<OAuth2RefreshToken> refreshTokenOAuth2TokenGenerator = new ClientOAuth2RefreshTokenGenerator();
        return new DelegatingOAuth2TokenGenerator(jwtGenerator, refreshTokenOAuth2TokenGenerator);
    }

    @Bean
    public SavedRequestAwareAuthenticationSuccessHandler authenticationSuccessHandler() {
        return new SavedRequestAwareAuthenticationSuccessHandler();
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
        };
    }

    /**
     * Ajoute les claims du scope {@code agent_profile} (identité + rattachement géographique de l'agent)
     * transmis à KUMY/AgriScore. N'émet rien si le rôle est hors périmètre AgriScore
     * (seuls AGENT_CREDIT, RA, DA, DR sont concernés).
     */
    private void addAgentProfileClaims(JwtEncodingContext context, User user) {
        String role = user.getRole();
        if (role == null || !AGENT_PROFILE_ROLES.contains(role)) {
            log.warn("⚠️ Agent {} (role '{}') hors périmètre AgriScore — claims agent_profile non émis",
                    user.getUserId(), role);
            return;
        }
        try {
            // agent_id stable, jamais réattribué : basé sur la PK user_id (cf. accord KUMY)
            context.getClaims()
                    .claim("agent_id", "CR-" + user.getUserId())
                    .claim("role", role);

            AgentProfile profile = userRepository.getAgentProfile(user.getUserId());
            if (profile != null) {
                addClaimIfPresent(context, "agence_region", profile.delegationLibele());
                addClaimIfPresent(context, "agence_name", profile.agenceLibele());
                addClaimIfPresent(context, "agence_code", profile.pointventeCode());
                addClaimIfPresent(context, "point_de_service", profile.pointventeLibele());
            }
            log.info("✅ Claims agent_profile ajoutés pour agent CR-{} (role {})", user.getUserId(), role);
        } catch (Exception e) {
            log.error("❌ Erreur ajout des claims agent_profile pour user {}: {}", user.getUserId(), e.getMessage(), e);
        }
    }

    private void addClaimIfPresent(JwtEncodingContext context, String name, String value) {
        if (value != null && !value.isBlank()) {
            context.getClaims().claim(name, value);
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
        var idToken = context.getAuthorization().getToken(org.springframework.security.oauth2.core.oidc.OidcIdToken.class).getToken();
        Map<String, Object> claims = new HashMap<>(idToken.getClaims());
        claims.keySet().removeAll(JWT_TECHNICAL_CLAIMS);
        return new org.springframework.security.oauth2.core.oidc.OidcUserInfo(claims);
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


