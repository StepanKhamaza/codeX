package ru.platform.gateway.main.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Setter
@Getter
public class SubmissionRequest implements Serializable {
    @NotNull(message = "Выберите ID задачи")
    private Long problemId;

    @Size(min = 1, max = 15000, message = "Код решения задачи должен содержать от 1 до 15000 символов")
    @NotBlank(message = "Код решения задачи не должен быть пустым")
    private String sourceCode;

    @NotNull(message = "Выберите язык программирования для решения задачи")
    private Integer compilerId;

    @JsonIgnore
    private String username;
}
