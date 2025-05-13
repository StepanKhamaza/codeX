package ru.platform.gateway.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.platform.gateway.main.entities.Problem;
import ru.platform.gateway.main.service.ProblemService;
import ru.platform.gateway.main.service.TestcaseService;

import java.util.Map;


@RestController
@RequestMapping("/problem")
public class ProblemController {
    private final ProblemService problemService;

    public ProblemController(ProblemService problemService, TestcaseService testcaseService) {
        this.problemService = problemService;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Map<String, Problem>> getProblem(@PathVariable Long id) {
        Problem problem = problemService.getProblem(id);
        return ResponseEntity.ok().body(Map.of("problem", problem));
    }
}
