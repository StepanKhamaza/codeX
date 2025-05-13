package ru.platform.gateway.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.platform.gateway.security.dto.AuthenticationResponse;
import ru.platform.gateway.security.dto.SignInRequest;
import ru.platform.gateway.security.dto.SignUpRequest;
import ru.platform.gateway.security.entities.Role;
import ru.platform.gateway.security.entities.Token;
import ru.platform.gateway.security.entities.User;
import ru.platform.gateway.security.exception.AuthenticationException;
import ru.platform.gateway.security.repository.TokenRepository;
import ru.platform.gateway.security.repository.UserRepository;

import java.util.List;

@Service
public class AuthenticationService {
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthenticationService(TokenRepository tokenRepository,
                                 UserRepository userRepository,
                                 JwtService jwtService,
                                 PasswordEncoder passwordEncoder,
                                 AuthenticationManager authenticationManager) {

        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse signUp(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername()) ||
                userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new AuthenticationException("Пользователь уже существует");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setEmail(signUpRequest.getEmail());
        user.setRole(Role.ROLE_USER);
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        saveToken(jwtToken, user);

        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse signIn(SignInRequest signInRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    signInRequest.getUsername(),
                    signInRequest.getPassword()
            ));
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Неверный логин/пароль");
        }

        User user = userRepository.findByUsername(signInRequest.getUsername()).orElseThrow();
        String jwtToken = jwtService.generateToken(user);

        revokeAllTokensByUser(user);
        saveToken(jwtToken, user);

        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    private void saveToken(String jwtToken, User user) {
        Token token = new Token();
        token.setToken(jwtToken);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRepository.save(token);
    }

    private void revokeAllTokensByUser(User user) {
        List<Token> validTokens = tokenRepository
                .findAllTokensByUser(user.getUsername())
                .orElseThrow();

        if (validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(token -> {
            token.setLoggedOut(true);
        });

        tokenRepository.saveAll(validTokens);
    }
}
