package ru.platform.gateway.main.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.platform.gateway.security.dto.AuthenticationResponse;

@ControllerAdvice(basePackages = "ru.platform.gateway.main")
public class MainControllerExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AuthenticationResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {

        return ResponseEntity
                .badRequest()
                .body(AuthenticationResponse
                        .builder()
                        .error(ex.getBindingResult()
                                .getAllErrors()
                                .getFirst()
                                .getDefaultMessage())
                        .build()
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handle(Exception e) {
        return ResponseEntity
                .internalServerError()
                .body(e.getMessage());
    }
}
