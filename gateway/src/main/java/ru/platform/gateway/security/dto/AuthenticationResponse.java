package ru.platform.gateway.security.dto;

import lombok.*;

@Setter
@Getter
@Builder
@ToString
public class AuthenticationResponse {
    private final String error;
    private final String token;
}
