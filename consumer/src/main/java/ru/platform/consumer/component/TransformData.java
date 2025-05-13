package ru.platform.consumer.component;

import org.springframework.stereotype.Component;
import ru.platform.consumer.dto.JudgeSubmission;
import ru.platform.consumer.entities.Problem;
import ru.platform.consumer.entities.Submission;
import ru.platform.consumer.entities.Testcase;

import java.util.Base64;
import java.util.List;
import java.util.Map;


@Component
public class TransformData {
    private final Base64.Encoder encoder;

    public TransformData(Base64.Encoder encoder) {
        this.encoder = encoder;
    }

    public Map<String, JudgeSubmission[]> transform(Submission submission, Problem problem) {
        List<Testcase> testcases = problem.getTestcases();
        int testcasesSize = testcases.size();
        JudgeSubmission[] judgeSubmissions = new JudgeSubmission[testcasesSize];

        for (int i = 0; i < testcasesSize; i++) {
            judgeSubmissions[i] = JudgeSubmission
                    .builder()
                    .source_code(encoder.encodeToString(submission.getSourceCode().getBytes()))
                    .language_id(submission.getCompilerId())
                    .stdin(encoder.encodeToString(testcases.get(i).getInput().getBytes()))
                    .expected_output(encoder.encodeToString(testcases.get(i).getOutput().getBytes()))
                    .cpu_time_limit(problem.getTimeLimit())
                    .memory_limit(problem.getMemoryLimit())
                    .build();
        }

        return Map.of("submissions", judgeSubmissions);
    }
}
