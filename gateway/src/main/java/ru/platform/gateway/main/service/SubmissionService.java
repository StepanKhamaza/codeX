package ru.platform.gateway.main.service;

import org.springframework.stereotype.Service;
import ru.platform.gateway.main.entities.Submission;
import ru.platform.gateway.main.repository.SubmissionRepository;

import java.util.List;

@Service
public class SubmissionService {
    private final RabbitService rabbitService;
    private final SubmissionRepository submissionRepository;

    public SubmissionService(RabbitService rabbitService, SubmissionRepository submissionRepository) {
        this.rabbitService = rabbitService;
        this.submissionRepository = submissionRepository;
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository
                .findAllByOrderByCreatedDesc()
                .orElseThrow();
    }

    public void saveSubmission(Submission submission) {
        submissionRepository.save(submission);
        rabbitService.pushToQueue(submission);
    }

    public List<Submission> getSubmissionsByUsername(String username) {
        return submissionRepository
                .findByUsernameOrderByCreatedDesc(username)
                .orElseThrow();
    }

    public List<Submission> getSubmissionsByUsernameAndProblemId(String username, Long problemId) {
        return submissionRepository
                .findByUsernameAndProblemIdOrderByCreatedDesc(username, problemId)
                .orElseThrow();
    }

    public Submission getSubmissionById(Long id) {
        return submissionRepository.
                findById(id)
                .orElseThrow();
    }
}
