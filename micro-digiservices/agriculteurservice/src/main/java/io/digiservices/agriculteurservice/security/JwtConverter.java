package io.digiservices.agriculteurservice.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import static org.springframework.security.core.authority.AuthorityUtils.commaSeparatedStringToAuthorityList;

/**
 * Extrait les autorites du JWT (claim {@code authorities}, valeurs separees par
 * des virgules) - meme convention que les autres microservices du SI.
 *
 * <p>Pour que {@code hasRole('AGRIPILOT')} fonctionne, le claim doit contenir
 * {@code ROLE_AGRIPILOT}.</p>
 */
@Component
public class JwtConverter implements Converter<Jwt, JwtAuthenticationToken> {

    private static final String AUTHORITY_KEY = "authorities";

    @Override
    public JwtAuthenticationToken convert(Jwt jwt) {
        var claims = (String) jwt.getClaims().get(AUTHORITY_KEY);
        var authorities = commaSeparatedStringToAuthorityList(claims);
        return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
    }
}
