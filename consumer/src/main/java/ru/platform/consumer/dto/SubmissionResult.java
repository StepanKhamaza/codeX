package ru.platform.consumer.dto;

import lombok.*;
import ru.platform.consumer.entities.SubmissionStatus;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResult {
    private SubmissionStatus status;
    private Float time;
    private Float memory;
    private Integer numberOfTestcase;
}
