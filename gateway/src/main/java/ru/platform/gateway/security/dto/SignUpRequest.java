package ru.platform.gateway.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class SignUpRequest {
    @Size(min = 5, max = 50, message = "Поле логин - непустая строка длины от 5 до 50 символов")
    @NotBlank(message = "Поле логин не должно быть пустым")
    private String username;

    @Size(min = 5, max = 255, message = "Поле пароль - непустая строка длины от 5 до 255 символов")
    @NotBlank(message = "Поле пароль не должно быть пустым")
    private String password;

    @Email
    @Size(max = 255, message = "Поле электронная почта - непустая строка длины до 255 символов")
    @NotBlank
    private String email;
}
