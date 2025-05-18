package ru.platform.gateway.main.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "problems")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "problemId")
public class Problem implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "problem_id")
    private Long problemId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String text;

    @Column(nullable = false, name = "input_format", columnDefinition = "text")
    private String inputFormat;

    @Column(nullable = false, name = "output_format", columnDefinition = "text")
    private String outputFormat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "difficulty")
    private ProblemDifficulty problemDifficulty;

    @Column(nullable = false, name = "time_limit")
    private Float timeLimit;

    @Column(nullable = false, name = "memory_limit")
    private Float memoryLimit;

    @Column(nullable = false, name = "created")
    private LocalDateTime created;

    @Column(nullable = false)
    @OneToMany(fetch = FetchType.EAGER,
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "problem"
    )
    private List<Testcase> testcases = new ArrayList<>();

    public void addTestcase(Testcase testcase) {
        testcases.add(testcase);
        testcase.setProblem(this);
    }

    public void removeTestcase(Testcase testcase) {
        testcases.remove(testcase);
        testcase.setProblem(null);
    }
}
