package ru.platform.gateway.main.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class TestcaseRequest {
    private String input;

    @NotBlank(message = "Выходные данные теста не должны быть пустыми")
    private String output;
}
