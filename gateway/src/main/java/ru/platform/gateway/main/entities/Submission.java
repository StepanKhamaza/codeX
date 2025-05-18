package ru.platform.gateway.main.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "submissions")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "submissionId")
public class Submission implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Long submissionId;

    @Column(nullable = false, name = "problem_id")
    private Long problemId;

    @Column(nullable = false, name = "username")
    private String username;

    @Column(nullable = false, name = "source_code", columnDefinition = "text")
    private String sourceCode;

    @Column(nullable = false, name = "compiler_id")
    private Integer compilerId;

    @Column(nullable = false, name = "created")
    private LocalDateTime created;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "status")
    private SubmissionStatus status;

    @Column(name = "time")
    private Float time;

    @Column(name = "memory")
    private Float memory;

    @Column(name = "test")
    private Integer numberOfTestcase;
}
