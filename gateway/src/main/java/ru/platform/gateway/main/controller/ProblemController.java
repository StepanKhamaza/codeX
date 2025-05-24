package ru.platform.gateway.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.platform.gateway.main.entities.Problem;
import ru.platform.gateway.main.service.ProblemService;

import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/problem")
public class ProblemController {
    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Map<String, Problem>> getProblem(@PathVariable Long id) {
        Problem problem = problemService.getProblem(id);
        problem.setTestcases(problem
                .getTestcases()
                .stream()
                .limit(2)
                .collect(Collectors.toList())
        );

        return ResponseEntity.ok().body(Map.of("problem", problem));
    }
}
