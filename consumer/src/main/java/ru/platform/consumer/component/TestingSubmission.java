package ru.platform.consumer.component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import ru.platform.consumer.dto.JudgeResponse;
import ru.platform.consumer.dto.JudgeSubmission;
import ru.platform.consumer.dto.SubmissionResult;
import ru.platform.consumer.entities.SubmissionStatus;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.concurrent.*;


@Component
@Slf4j
public class TestingSubmission {
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final SubmissionResult INTERNAL_ERROR_RESULT = SubmissionResult
            .builder()
            .status(SubmissionStatus.INTERNAL_ERROR)
            .build();

    @Value("${app.judge-url-post}")
    private String judgeUrlPost;

    @Value("${app.judge-url-get}")
    private String judgeUrlGet;

    public TestingSubmission(ObjectMapper objectMapper, @Qualifier("httpClient") HttpClient httpClient) {
        this.objectMapper = objectMapper;
        this.httpClient = httpClient;
    }

    public SubmissionResult submit(Map<String, JudgeSubmission[]> submissions) {
        HttpResponse<String> postMethodResponse = null;
        try {
            do {
                postMethodResponse = postMethod(submissions).get();
            } while (postMethodResponse == null ||
                    postMethodResponse.statusCode() == HttpStatus.SERVICE_UNAVAILABLE.value());
        } catch (InterruptedException | ExecutionException e) {
            log.error(e.getMessage(), e);
            return INTERNAL_ERROR_RESULT;
        }

        if (postMethodResponse.statusCode() != HttpStatus.CREATED.value()) {
            return INTERNAL_ERROR_RESULT;
        }

        float maxTime = 0.0f, maxMemory = 0.0f;
        try {
            Map<String, String>[] responseMap = objectMapper.readValue(postMethodResponse.body(), Map[].class);
            for (int i = 0; i < responseMap.length; i++) {
                String token = responseMap[i].get("token");
                HttpResponse<String> getMethodResponse = getMethod(token).get();

                if (getMethodResponse.statusCode() != HttpStatus.OK.value()) {
                    return INTERNAL_ERROR_RESULT;
                }

                JudgeResponse submissionResponse = objectMapper.readValue(getMethodResponse.body(), JudgeResponse.class);
                Integer id = submissionResponse.getStatus().getId();
                if (id.equals(SubmissionStatus.IN_QUEUE.getId()) ||
                        id.equals(SubmissionStatus.PROCESSING.getId())) {

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
            log.error(e.getMessage(), e);
            return INTERNAL_ERROR_RESULT;
        }

        return SubmissionResult
                .builder()
                .status(SubmissionStatus.ACCEPTED)
                .time(maxTime)
                .memory(maxMemory)
                .build();
    }

    public CompletableFuture<HttpResponse<String>> postMethod(Map<String, JudgeSubmission[]> submissions) {
        HttpRequest request = null;
        try {
            request = HttpRequest
                    .newBuilder()
                    .uri(URI.create(judgeUrlPost))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(objectMapper.writeValueAsBytes(submissions)))
                    .build();
        } catch (JsonProcessingException e) {
            log.error(e.getMessage(), e);
            return CompletableFuture.completedFuture(null);
        }

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }

    public CompletableFuture<HttpResponse<String>> getMethod(String token) {
        HttpRequest request = HttpRequest
                .newBuilder()
                .uri(URI.create(judgeUrlGet.formatted(token)))
                .header("Content-Type", "application/json")
                .GET()
                .build();

        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }
}
