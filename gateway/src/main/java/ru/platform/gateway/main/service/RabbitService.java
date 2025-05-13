package ru.platform.gateway.main.service;

import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import ru.platform.gateway.main.entities.Submission;


@Service
@EnableAsync
public class RabbitService {
    private final RabbitTemplate rabbitTemplate;

    @Value("${app.direct-exchange}")
    private String directExchange;

    @Value("${app.routing-key}")
    private String routingKey;

    public RabbitService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Async
    public void pushToQueue(Submission submission) {
        try {
            rabbitTemplate.convertSendAndReceiveAsType(
                    directExchange,
                    routingKey,
                    submission,
                    new ParameterizedTypeReference<>() {
                    }
            );
        } catch (AmqpException ex) {
            throw new RuntimeException("RabbitService exception", ex);
        }
    }
}
