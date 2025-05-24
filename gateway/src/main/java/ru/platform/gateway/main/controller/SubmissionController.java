package ru.platform.gateway.main.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.platform.gateway.main.entities.SubmissionStatus;
import ru.platform.gateway.main.dto.SubmissionRequest;
import ru.platform.gateway.main.entities.Submission;
import ru.platform.gateway.main.service.SubmissionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/submission")
public class SubmissionController {
    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> processProblem(@RequestBody @Valid SubmissionRequest submissionRequest, @PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Submission submission = Submission
                .builder()
                .problemId(submissionRequest.getProblemId())
                .username(username)
                .sourceCode(submissionRequest.getSourceCode())
                .compilerId(submissionRequest.getCompilerId())
                .created(LocalDateTime.now())
                .status(SubmissionStatus.IN_QUEUE)
                .build();

        submissionService.saveSubmission(submission);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<Page<Submission>> getAllSubmissions(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "50") Integer limit) {
        Page<Submission> submissions = submissionService.getAllSubmissions(page, limit);
        return ResponseEntity
                .ok()
                .body(submissions);
    }

    @GetMapping("/get/{username}")
    public ResponseEntity<Map<String, List<Submission>>> getSubmissionsByUsername(@PathVariable String username) {
        return ResponseEntity
                .ok()
                .body(Map.of("submissions", submissionService.getSubmissionsByUsername(username)));
    }

    @GetMapping("/get/{username}/{id}")
    public ResponseEntity<Map<String, List<Submission>>> getSubmissionsByUsernameAndProblemId(
            @PathVariable String username,
            @PathVariable Long id) {

        return ResponseEntity
                .ok()
                .body(Map.of("submissions", submissionService.getSubmissionsByUsernameAndProblemId(username, id)));
    }
}
