package io.digiservices.authorizationserver.security;

import lombok.NoArgsConstructor;
import org.springframework.security.crypto.keygen.Base64StringKeyGenerator;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Base64;

@Component
@NoArgsConstructor
public class ClientOAuth2RefreshTokenGenerator implements OAuth2TokenGenerator<OAuth2RefreshToken> {
    private final StringKeyGenerator refreshTokenGenerator = new Base64StringKeyGenerator(Base64.getUrlEncoder().withoutPadding());

    @Override
    public OAuth2RefreshToken generate(OAuth2TokenContext context) {
        if(!OAuth2TokenType.REFRESH_TOKEN.equals(context.getTokenType())) {
            return null;
        } else {
            var issueAt = Instant.now();
            // Durée de vie du REFRESH token (et non de l'access token) : l'ancien code utilisait
            // getAccessTokenTimeToLive(), ce qui plafonnait la session de TOUS les clients à la durée
            // de leur access token (ex. 30 min pour le desktop au lieu des 24 h configurées) et rendait
            // le refreshTokenTimeToLive des TokenSettings totalement inopérant.
            var expiresAt = issueAt.plus(context.getRegisteredClient().getTokenSettings().getRefreshTokenTimeToLive());
            return new OAuth2RefreshToken(refreshTokenGenerator.generateKey(), issueAt, expiresAt);
        }
    }
}
