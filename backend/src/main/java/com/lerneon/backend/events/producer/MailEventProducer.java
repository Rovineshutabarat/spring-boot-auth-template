package com.lerneon.backend.events.producer;

import static com.lerneon.backend.events.configuration.MailEventConfiguration.FORGOT_PASSWORD_ROUTING_KEY;
import static com.lerneon.backend.events.configuration.MailEventConfiguration.MAIL_EXCHANGE;
import static com.lerneon.backend.events.configuration.MailEventConfiguration.VERIFY_ACCOUNT_ROUTING_KEY;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import com.lerneon.backend.events.message.OneTimePasswordMailEvent;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class MailEventProducer {
    private RabbitTemplate rabbitTemplate;

    public void produceVerifyAccountEvent(OneTimePasswordMailEvent oneTimePasswordMailEvent) {
        rabbitTemplate.convertAndSend(MAIL_EXCHANGE, VERIFY_ACCOUNT_ROUTING_KEY, oneTimePasswordMailEvent);
    }

    public void produceForgotPasswordEvent(OneTimePasswordMailEvent oneTimePasswordMailEvent) {
        rabbitTemplate.convertAndSend(MAIL_EXCHANGE, FORGOT_PASSWORD_ROUTING_KEY, oneTimePasswordMailEvent);
    }
}
