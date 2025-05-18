package ru.platform.consumer.service;


import org.springframework.stereotype.Service;
import ru.platform.consumer.component.TestSubmission;
import ru.platform.consumer.component.TransformData;
import ru.platform.consumer.dto.JudgeSubmission;
import ru.platform.consumer.dto.SubmissionResult;
import ru.platform.consumer.entities.Problem;
import ru.platform.consumer.entities.Submission;
import ru.platform.consumer.entities.SubmissionStatus;
import ru.platform.consumer.repository.ProblemRepository;
import ru.platform.consumer.repository.SubmissionRepository;

import java.util.List;


@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final TransformData transformData;
    private final TestSubmission testingSubmission;

    public SubmissionService(SubmissionRepository submissionRepository,
                             ProblemRepository problemRepository,
                             TransformData transformData,
                             TestSubmission testingSubmission) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.transformData = transformData;
        this.testingSubmission = testingSubmission;
    }

    public void executeAndSave(Submission submission) {
        Problem problem = problemRepository.findById(submission.getProblemId()).orElse(null);
        submission.setStatus(SubmissionStatus.PROCESSING);
        submissionRepository.save(submission);
        execute(submission, problem);
    }

    private void execute(Submission submission, Problem problem) {
        List<JudgeSubmission> judgeSubmissions = transformData.transform(submission, problem);

        float maxTime = 0.0f, maxMemory = 0.0f;
        for (int i = 0; i < judgeSubmissions.size(); i++) {
            SubmissionResult submissionResult = testingSubmission.submit(judgeSubmissions.get(i));
            maxTime = Math.max(maxTime, submissionResult.getTime());
            maxMemory = Math.max(maxMemory, submissionResult.getMemory());

            submission.setTime(submissionResult.getTime());
            submission.setMemory(submissionResult.getMemory());
            submission.setNumberOfTestcase(i + 1);
            submissionRepository.save(submission);

            if (submissionResult.getStatus() != SubmissionStatus.ACCEPTED) {
                submission.setStatus(submissionResult.getStatus());
                submissionRepository.save(submission);
                return;
            }
        }

        submission.setTime(maxTime);
        submission.setMemory(maxMemory);
        submission.setStatus(SubmissionStatus.ACCEPTED);
        submission.setNumberOfTestcase(null);
        submissionRepository.save(submission);
    }
}
