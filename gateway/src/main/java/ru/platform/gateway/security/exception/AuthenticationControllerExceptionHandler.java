package ru.platform.gateway.security.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.platform.gateway.security.dto.AuthenticationResponse;

@ControllerAdvice(basePackages = "ru.platform.gateway.security")
public class AuthenticationControllerExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AuthenticationResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        return ResponseEntity
                .badRequest()
                .body(AuthenticationResponse
                        .builder()
                        .error(ex.getBindingResult()
                                .getAllErrors()
                                .get(0)
                                .getDefaultMessage())
                        .build()
                );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<AuthenticationResponse> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity
                .badRequest()
                .body(AuthenticationResponse
                        .builder()
                        .error(ex.getMessage())
                        .build()
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        return ResponseEntity
                .internalServerError()
                .body(ex.getMessage());
    }
}
