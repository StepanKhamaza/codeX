package ru.platform.consumer.controller;


import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import ru.platform.consumer.entities.Submission;
import ru.platform.consumer.service.SubmissionService;


import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@Component
public class MainController {
    private final SubmissionService submissionService;
    private final ExecutorService rabbitMQExecutor;

    public MainController(SubmissionService submissionService, @Qualifier("rabbitMQExecutor") ExecutorService rabbitMQExecutor) {
        this.submissionService = submissionService;
        this.rabbitMQExecutor = rabbitMQExecutor;
    }

    @RabbitListener(queues = "${app.queue-name}")
    public void processMessage(Submission submission) {
        CompletableFuture.runAsync(() -> {
            submissionService.executeAndSave(submission);
        }, rabbitMQExecutor);
    }
}