package ru.platform.gateway.security.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import ru.platform.gateway.security.entities.Token;
import ru.platform.gateway.security.repository.TokenRepository;

@Configuration
public class CustomLogoutHandler implements LogoutHandler {
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String HEADER_NAME = "Authorization";
    private final TokenRepository tokenRepository;

    public CustomLogoutHandler(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Override
    public void logout(HttpServletRequest request,
                       HttpServletResponse response,
                       Authentication authentication) {
        String header = request.getHeader(HEADER_NAME);

        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            return;
        }

        String token = StringUtils.substringAfter(header, BEARER_PREFIX);
        Token storedToken = tokenRepository.findByToken(token).orElse(null);

        if (storedToken != null) {
            storedToken.setLoggedOut(true);
            tokenRepository.save(storedToken);
        }
    }
}
