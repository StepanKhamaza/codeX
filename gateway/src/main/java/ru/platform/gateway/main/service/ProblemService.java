package ru.platform.gateway.main.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.platform.gateway.main.entities.Problem;
import ru.platform.gateway.main.entities.Testcase;
import ru.platform.gateway.main.repository.ProblemRepository;

import java.util.List;

@Service
@Slf4j
public class ProblemService {
    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Transactional
    public void saveProblem(Problem problem) {
        List<Testcase> testcases = problem.getTestcases();
        testcases.forEach(testcase -> testcase.setProblem(problem));

        try {
            problemRepository.save(problem);
        } catch (Exception e) {
            throw new RuntimeException("Problem save failed", e);
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
