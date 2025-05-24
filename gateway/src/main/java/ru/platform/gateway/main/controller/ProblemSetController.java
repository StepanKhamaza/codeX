package ru.platform.gateway.main.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.platform.gateway.main.dto.ProblemRequest;
import ru.platform.gateway.main.entities.Problem;
import ru.platform.gateway.main.entities.Testcase;
import ru.platform.gateway.main.service.ProblemService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/problems")
public class ProblemSetController {
    private final ProblemService problemService;

    public ProblemSetController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public ResponseEntity<Page<Problem>> getAllProblems(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit) {

        Page<Problem> problems = problemService.getAllWithoutTestcases(page, limit);
        return ResponseEntity
                .ok()
                .body(problems);
    }

    @PostMapping("/add-problem")
    public ResponseEntity<?> addProblem(@RequestBody @Valid ProblemRequest problemRequest) {
        List<Testcase> testCases = new ArrayList<>(problemRequest
                .getTestcases()
                .stream()
                .map(tCase -> Testcase.builder()
                        .input(tCase.getInput())
                        .output(tCase.getOutput())
                        .build())
                .toList()
        );

        Problem problem = Problem.builder()
                .title(problemRequest.getTitle())
                .text(problemRequest.getText())
                .inputFormat(problemRequest.getInputFormat())
                .outputFormat(problemRequest.getOutputFormat())
                .problemDifficulty(problemRequest.getProblemDifficulty())
                .timeLimit(problemRequest.getTimeLimit())
                .memoryLimit(problemRequest.getMemoryLimit())
                .created(LocalDateTime.now())
                .testcases(testCases)
                .build();

        problemService.saveProblem(problem);
        return ResponseEntity.ok().build();
    }
}
