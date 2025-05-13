package ru.platform.gateway.main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.platform.gateway.main.entities.ProblemDifficulty;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class ProblemRequest {
    @Size(min = 5, max = 50, message = "Название задачи должно содержать от 5 до 50 символов")
    @NotBlank(message = "Название задачи не должно быть пустым")
    private String title;

    @Size(min = 5, max = 15000, message = "Описание задачи должно содержать от 5 до 15000 символов")
    @NotBlank(message = "Название задачи не должно быть пустым")
    private String text;

    @Size(min = 5, max = 1000, message = "Формат входных данных должен содержать от 5 до 1000 символов")
    @NotBlank(message = "Формат входных данных не должен быть пустым")
    private String inputFormat;

    @Size(min = 5, max = 1000, message = "Формат выходных данных должен содержать от 5 до 1000 символов")
    @NotBlank(message = "Формат выходных данных не должен быть пустым")
    private String outputFormat;

    @NotNull(message = "Выберите сложность задачи: [EASY, MEDIUM, HARD]")
    private ProblemDifficulty problemDifficulty;

    @NotNull(message = "Введите ограничение по времени выполнения задачи в секундах")
    private Float timeLimit;

    @NotNull(message = "Введите ограничение по памяти выполнения задачи в килобайтах")
    private Float memoryLimit;

    @NotNull(message = "Добавьте тесты к задаче")
    private List<TestcaseRequest> testcases;
}
