package ru.platform.consumer.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitConfiguration {
    @Value("${app.queue-name}")
    private String queueName;

    @Value("${app.routing-key}")
    private String routingKey;

    @Value("${app.direct-exchange}")
    private String directExchange;

    @Bean
    public Queue problemsQueue() {
        return new Queue(queueName);
    }

    @Bean
    DirectExchange exchange() {
        return new DirectExchange(directExchange, true, false);
    }

    @Bean
    Binding binding(Queue problemsQueue, DirectExchange exchange) {
        return BindingBuilder.bind(problemsQueue).to(exchange).with(routingKey);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
