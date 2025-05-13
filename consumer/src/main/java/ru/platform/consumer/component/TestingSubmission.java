package ru.platform.consumer.component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.platform.consumer.dto.JudgeResponse;
import ru.platform.consumer.dto.JudgeSubmission;
import ru.platform.consumer.dto.SubmissionResult;
import ru.platform.consumer.entities.SubmissionStatus;

import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.concurrent.*;


@Component
public class TestingSubmission {
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${app.judge-url-post}")
    private String judgeUrlPost;

    @Value("${app.judge-url-get}")
    private String judgeUrlGet;

    public TestingSubmission(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder().executor(Executors.newFixedThreadPool(10)).build();
    }

    public SubmissionResult submit(Map<String, JudgeSubmission[]> submissions) {
        String postMethodResult = null;
        try {
            while (postMethodResult == null) {
                postMethodResult = postMethod(submissions).get();
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }


        float maxTime = 0.0f, maxMemory = 0.0f;
        if (postMethodResult != null) {
            try {
                Map<String, String>[] responseMap = objectMapper.readValue(postMethodResult, Map[].class);
                for (int i = 0; i < responseMap.length; i++) {
                    String token = responseMap[i].get("token");
                    JudgeResponse submissionResponse;

                    submissionResponse = getMethod(token).get();

                    Integer id = submissionResponse.getStatus().getId();
                    if (id.equals(SubmissionStatus.IN_QUEUE.getId()) || id.equals(SubmissionStatus.PROCESSING.getId())) {
                        i--;
                    } else {
                        if (!id.equals(SubmissionStatus.ACCEPTED.getId())) {
                            return SubmissionResult
                                    .builder()
                                    .status(SubmissionStatus.of(id))
                                    .time(submissionResponse.getTime())
                                    .memory(submissionResponse.getMemory())
                                    .numberOfTestcase(i + 1)
                                    .build();
                        } else {
                            maxTime = Math.max(maxTime, submissionResponse.getTime());
                            maxMemory = Math.max(maxMemory, submissionResponse.getMemory());
                        }
                    }
                }
            } catch (JsonProcessingException | ExecutionException | InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

        return SubmissionResult
                .builder()
                .status(SubmissionStatus.ACCEPTED)
                .time(maxTime)
                .memory(maxMemory)
                .build();
    }

    public CompletableFuture<String> postMethod(Map<String, JudgeSubmission[]> submissions) {
        try {
            HttpRequest request = HttpRequest
                    .newBuilder()
                    .uri(URI.create(judgeUrlPost))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(objectMapper.writeValueAsBytes(submissions)))
                    .build();

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(HttpResponse::body);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public CompletableFuture<JudgeResponse> getMethod(String token) {
        try {
            HttpRequest request = HttpRequest
                    .newBuilder()
                    .uri(URI.create(judgeUrlGet.formatted(token)))
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        try {
                            return objectMapper.readValue(response.body(), JudgeResponse.class);
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException(e);
                        }
                    });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
