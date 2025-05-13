package ru.platform.gateway.main.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.platform.gateway.main.entities.Testcase;
import ru.platform.gateway.main.repository.TestcaseRepository;

import java.util.List;

@Service
public class TestcaseService {
    private final TestcaseRepository testcaseRepository;

    public TestcaseService(TestcaseRepository testcaseRepository) {
        this.testcaseRepository = testcaseRepository;
    }

    @Transactional
    public void saveTestcases(List<Testcase> testcases) {
        try {
            testcaseRepository.saveAll(testcases);
        } catch (Exception e) {
            throw e;
        }
    }
}
