package com.lerneon.backend.events.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MailEventConfiguration {

    public static final String MAIL_EXCHANGE = "mail.exchange";
    public static final String MAIL_DLX = "mail.exchange.dlx";

    public static final String VERIFY_ACCOUNT = "mail.verify-account-queue";
    public static final String FORGOT_PASSWORD = "mail.forgot-password-queue";
    public static final String VERIFY_ACCOUNT_DLQ = "mail.verify-account-queue.dlq";
    public static final String FORGOT_PASSWORD_DLQ = "mail.forgot-password-queue.dlq";

    public static final String VERIFY_ACCOUNT_ROUTING_KEY = "mail.verify-account";
    public static final String FORGOT_PASSWORD_ROUTING_KEY = "mail.forgot-password";

    @Bean
    public TopicExchange mailExchange() {
        return ExchangeBuilder.topicExchange(MAIL_EXCHANGE).durable(true).build();
    }

    @Bean
    TopicExchange mailDeadLetterExchange() {
        return ExchangeBuilder.topicExchange(MAIL_DLX).durable(true).build();
    }

    @Bean
    Queue verifyAccountQueue() {
        return QueueBuilder.durable(VERIFY_ACCOUNT)
                .deadLetterExchange(MAIL_DLX)
                .deadLetterRoutingKey(VERIFY_ACCOUNT_ROUTING_KEY)
                .build();
    }

    @Bean
    Queue forgotPasswordQueue() {
        return QueueBuilder.durable(FORGOT_PASSWORD)
                .deadLetterExchange(MAIL_DLX)
                .deadLetterRoutingKey(FORGOT_PASSWORD_ROUTING_KEY)
                .build();
    }

    @Bean
    Queue verifyAccountDlq() {
        return QueueBuilder.durable(VERIFY_ACCOUNT_DLQ).build();
    }

    @Bean
    Queue forgotPasswordDlq() {
        return QueueBuilder.durable(FORGOT_PASSWORD_DLQ).build();
    }

    @Bean
    Binding verifyAccountBinding() {
        return BindingBuilder.bind(verifyAccountQueue())
                .to(mailExchange())
                .with(VERIFY_ACCOUNT_ROUTING_KEY);
    }

    @Bean
    Binding forgotPasswordBinding() {
        return BindingBuilder.bind(forgotPasswordQueue())
                .to(mailExchange())
                .with(FORGOT_PASSWORD_ROUTING_KEY);
    }

    @Bean
    Binding verifyAccountDlqBinding() {
        return BindingBuilder.bind(verifyAccountDlq())
                .to(mailDeadLetterExchange())
                .with(VERIFY_ACCOUNT_ROUTING_KEY);
    }

    @Bean
    Binding forgotPasswordDlqBinding() {
        return BindingBuilder.bind(forgotPasswordDlq())
                .to(mailDeadLetterExchange())
                .with(FORGOT_PASSWORD_ROUTING_KEY);
    }
}