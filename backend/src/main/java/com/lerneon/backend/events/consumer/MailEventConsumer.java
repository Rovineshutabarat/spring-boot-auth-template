package com.lerneon.backend.events.consumer;

import static com.lerneon.backend.events.configuration.MailEventConfiguration.FORGOT_PASSWORD;
import static com.lerneon.backend.events.configuration.MailEventConfiguration.VERIFY_ACCOUNT;

import java.io.IOException;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.lerneon.backend.events.message.OneTimePasswordMailEvent;
import com.lerneon.backend.services.MailService;
import com.rabbitmq.client.Channel;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@AllArgsConstructor
@Slf4j
public class MailEventConsumer {
    private final MailService mailService;

    @RabbitListener(queues = {
            VERIFY_ACCOUNT,
            FORGOT_PASSWORD
    })
    public void consumeOtpMail(OneTimePasswordMailEvent oneTimePasswordMailEvent, Message message, Channel channel)
            throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        try {
            mailService.sendOTPMail(oneTimePasswordMailEvent);
            channel.basicAck(deliveryTag, false);
        } catch (Exception e) {
            log.error("Failed to send email ({}) to {}: {}", oneTimePasswordMailEvent.getVerificationType(),
                    oneTimePasswordMailEvent.getEmail(), e.getMessage(), e);
            channel.basicNack(deliveryTag, false, false);
        }
    }
}
