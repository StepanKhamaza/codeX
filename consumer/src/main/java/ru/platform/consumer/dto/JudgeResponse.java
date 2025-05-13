package ru.platform.consumer.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class JudgeResponse {
    private String stdout;
    private Float time;
    private Float memory;
    private String stderr;
    private String token;
    private String compile_output;
    private String message;
    private JudgeStatus status;
}
