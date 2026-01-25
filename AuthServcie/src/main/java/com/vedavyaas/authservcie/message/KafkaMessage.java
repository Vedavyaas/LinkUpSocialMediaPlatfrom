package com.vedavyaas.authservcie.message;


import com.vedavyaas.authservcie.repository.UserEntity;
import com.vedavyaas.authservcie.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class KafkaMessage {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final UserRepository userRepository;

    public KafkaMessage(KafkaTemplate<String, String> kafkaTemplate, UserRepository userRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.userRepository = userRepository;
    }

    @Scheduled(fixedDelay = 700)
    @Transactional
    public void sendMessage() {
        List<UserEntity> users = userRepository.findAllBySent(false);
        for (UserEntity user : users) {
            kafkaTemplate.send("user-registration", user.getUsername())
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            user.setSent(true);
                            userRepository.save(user);
                        } else {
//                      log.error("Kafka send failed for user {}", user.getId(), ex);
                        }
                    });
        }
    }

    @KafkaListener(topics = "name-change", groupId = "authGroup")
    public void usernameChange(String message){
        String[] messages = message.split(",");
        Optional<UserEntity> user = userRepository.findByUsername(messages[0]);
        if (user.isEmpty()) {
            // will be true made for suppressing warnings
        }

        user.get().setUsername(messages[1]);
        userRepository.save(user.get());
    }
}
