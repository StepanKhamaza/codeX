package ru.platform.consumer.controller;


import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.platform.consumer.entities.Submission;
import ru.platform.consumer.service.SubmissionService;


import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@Component
public class MainController {
    private final SubmissionService submissionService;
    private final ExecutorService rabbitMQService;

    @Value("${app.judge-url-post}")
    private String judgeUrlPost;

    @Value("${app.judge-url-get}")
    private String judgeUrlGet;

    public MainController(SubmissionService submissionService, @Qualifier("rabbitMQExecutor") ExecutorService rabbitMQService) {
        this.submissionService = submissionService;
        this.rabbitMQService = rabbitMQService;
    }

    @RabbitListener(queues = "${app.queue-name}")
    public void processMessage(Submission submission) {
        CompletableFuture.runAsync(() -> {
            submissionService.executeAndSave(submission);
        }, rabbitMQService);
    }
}