package ru.platform.gateway.security.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.platform.gateway.security.dto.AuthenticationResponse;
import ru.platform.gateway.security.dto.SignInRequest;
import ru.platform.gateway.security.dto.SignUpRequest;
import ru.platform.gateway.security.service.AuthenticationService;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<AuthenticationResponse> signUp(@RequestBody @Valid SignUpRequest signUpRequest) {
        AuthenticationResponse authenticationResponse = authenticationService.signUp(signUpRequest);
        return ResponseEntity.ok().body(authenticationResponse);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<AuthenticationResponse> signIn(@RequestBody @Valid SignInRequest signInRequest) {
        AuthenticationResponse authenticationResponse = authenticationService.signIn(signInRequest);
        return ResponseEntity.ok().body(authenticationResponse);
    }
}
