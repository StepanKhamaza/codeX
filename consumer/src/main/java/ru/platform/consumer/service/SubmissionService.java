package ru.platform.consumer.service;


import org.springframework.stereotype.Service;
import ru.platform.consumer.component.TestingSubmission;
import ru.platform.consumer.component.TransformData;
import ru.platform.consumer.dto.JudgeSubmission;
import ru.platform.consumer.dto.SubmissionResult;
import ru.platform.consumer.entities.Problem;
import ru.platform.consumer.entities.Submission;
import ru.platform.consumer.entities.SubmissionStatus;
import ru.platform.consumer.repository.ProblemRepository;
import ru.platform.consumer.repository.SubmissionRepository;


import java.util.*;


@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final TransformData transformData;
    private final TestingSubmission testingSubmission;

    public SubmissionService(SubmissionRepository submissionRepository,
                             ProblemRepository problemRepository,
                             TransformData transformData,
                             TestingSubmission testingSubmission) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.transformData = transformData;
        this.testingSubmission = testingSubmission;
    }

    public void executeAndSave(Submission submission) {
        Problem problem = problemRepository.findById(submission.getProblemId()).orElse(null);
        submission.setStatus(SubmissionStatus.PROCESSING);
        submissionRepository.save(submission);

        SubmissionResult submissionResult = execute(submission, problem);
        submission.setStatus(submissionResult.getStatus());
        submission.setTime(submissionResult.getTime());
        submission.setMemory(submissionResult.getMemory());
        submission.setNumberOfTestcase(submissionResult.getNumberOfTestcase());

        submissionRepository.save(submission);
    }

    public SubmissionResult execute(Submission submission, Problem problem) {
        Map<String, JudgeSubmission[]> transformFuture = transformData.transform(submission, problem);
        SubmissionResult testingFuture = testingSubmission.submit(transformFuture);
        return testingFuture;
    }
}
