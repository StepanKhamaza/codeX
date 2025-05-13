package ru.platform.gateway.security.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class SignInRequest {
    @Size(min = 5, max = 50, message = "Поле логин - непустая строка длины от 5 до 50 символов")
    @NotBlank(message = "Поле логин не должно быть пустым")
    private String username;

    @Size(min = 5, max = 255, message = "Поле пароль - непустая строка длины от 5 до 255 символов")
    @NotBlank(message = "Поле пароль не должно быть пустым")
    private String password;
}
