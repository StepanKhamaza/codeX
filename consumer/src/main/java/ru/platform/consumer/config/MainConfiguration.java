package ru.platform.consumer.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.net.http.HttpClient;
import java.util.Base64;
import java.util.concurrent.*;


@Configuration
public class MainConfiguration {
    @Bean
    public ObjectMapper objectMapper() {
        return Jackson2ObjectMapperBuilder.json().build();
    }

    @Bean
    public Base64.Encoder encoder() {
        return Base64.getEncoder();
    }

    @Bean
    public Base64.Decoder decoder() {
        return Base64.getDecoder();
    }

    @Bean
    public ExecutorService rabbitMQExecutor() {
        return createExecutorService();
    }

    @Bean
    public HttpClient httpClient() {
        return HttpClient
                .newBuilder()
                .executor(createExecutorService())
                .build();
    }

    private ExecutorService createExecutorService() {
        BlockingQueue<Runnable> queue = new ArrayBlockingQueue<>(100);
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(20, 20, 60L, TimeUnit.SECONDS, queue, new ThreadPoolExecutor.CallerRunsPolicy());
        threadPoolExecutor.allowCoreThreadTimeOut(true);

        return threadPoolExecutor;
    }
}
