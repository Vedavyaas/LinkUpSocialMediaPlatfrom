package com.vedavyaas.messagingservice.message;

import com.vedavyaas.messagingservice.user.UserEntity;
import com.vedavyaas.messagingservice.user.UserRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaMessage {
    private final UserRepository userRepository;

    public KafkaMessage(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @KafkaListener(topics = "user-registration", groupId = "msgGroup")
    public void saveMessage(String message) {
        userRepository.save(new UserEntity(message));
    }
}