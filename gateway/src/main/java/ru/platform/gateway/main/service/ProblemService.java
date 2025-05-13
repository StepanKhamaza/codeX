package ru.platform.gateway.main.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.platform.gateway.main.entities.Problem;
import ru.platform.gateway.main.repository.ProblemRepository;

import java.util.List;

@Service
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final TestcaseService testcaseService;

    public ProblemService(ProblemRepository problemRepository, TestcaseService testcaseService) {
        this.problemRepository = problemRepository;
        this.testcaseService = testcaseService;
    }

    @Transactional
    public void saveProblem(Problem problem) {
        try {
            problemRepository.save(problem);
        } catch (Exception e) {
            throw new RuntimeException("Problem save failed", e);
        }

        try {
            testcaseService.saveTestcases(problem.getTestcases());
        } catch (Exception e) {
            throw new RuntimeException("Testcases for problem %s save failed".formatted(problem.getProblemId()), e);
        }
    }

    public List<Problem> getAllProblems() {
        try {
            return problemRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Problems get all failed", e);
        }
    }

    public Problem getProblem(Long id) {
        return problemRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Problem with id %s not found".formatted(id)));
    }
}
