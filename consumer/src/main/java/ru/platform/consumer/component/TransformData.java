package ru.platform.consumer.component;

import org.springframework.stereotype.Component;
import ru.platform.consumer.dto.JudgeSubmission;
import ru.platform.consumer.entities.Problem;
import ru.platform.consumer.entities.Submission;
import ru.platform.consumer.entities.Testcase;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;


@Component
public class TransformData {
    private final Base64.Encoder encoder;

    public TransformData(Base64.Encoder encoder) {
        this.encoder = encoder;
    }

    public List<JudgeSubmission> transform(Submission submission, Problem problem) {
        List<Testcase> testcases = problem.getTestcases();
        List<JudgeSubmission> result = new ArrayList<>();

        for (Testcase testcase : testcases) {
            result.add(JudgeSubmission
                    .builder()
                    .source_code(encoder.encodeToString(submission.getSourceCode().getBytes()))
                    .language_id(submission.getCompilerId())
                    .stdin(encoder.encodeToString(testcase.getInput().getBytes()))
                    .expected_output(encoder.encodeToString(testcase.getOutput().getBytes()))
                    .cpu_time_limit(problem.getTimeLimit())
                    .memory_limit(problem.getMemoryLimit())
                    .build()
            );
        }

        return result;
    }
}
