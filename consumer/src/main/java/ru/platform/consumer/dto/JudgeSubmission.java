package ru.platform.consumer.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JudgeSubmission {
    private String source_code;
    private Integer language_id;
    private String stdin;
    private String expected_output;
    private Float cpu_time_limit;
    private Float memory_limit;
}
