package ru.platform.gateway.main.entities;

import lombok.Getter;

import java.util.Objects;
import java.util.stream.Stream;

@Getter
public enum SubmissionStatus {
    IN_QUEUE(1),
    PROCESSING(2),
    ACCEPTED(3),
    WRONG_ANSWER(4),
    TIME_LIMIT_EXCEEDED(5),
    COMPILATION_ERROR(6),
    RUNTIME_ERROR_SIGSEGV(7),
    RUNTIME_ERROR_SIGXFSZ(8),
    RUNTIME_ERROR_SIGFPE(9),
    RUNTIME_ERROR_SIGABRT(10),
    RUNTIME_ERROR_NZEC(11),
    RUNTIME_ERROR_OTHER(12),
    INTERNAL_ERROR(13),
    EXEC_FORMAT_ERROR(14);

    private Integer id;

    SubmissionStatus(Integer id) {
        this.id = id;
    }

    public static SubmissionStatus of(Integer id) {
        return Stream.of(SubmissionStatus.values())
                .filter(p -> Objects.equals(p.getId(), id))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);

    }
}