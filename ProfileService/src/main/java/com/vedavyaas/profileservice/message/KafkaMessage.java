package com.vedavyaas.profileservice.message;

import com.vedavyaas.profileservice.repository.RelationShipEntity;
import com.vedavyaas.profileservice.repository.RelationShipRepository;
import com.vedavyaas.profileservice.repository.UserEntity;
import com.vedavyaas.profileservice.repository.UserRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class KafkaMessage {
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final RelationShipRepository relationShipRepository;

    public KafkaMessage(UserRepository userRepository, KafkaTemplate<String, String> kafkaTemplate, RelationShipRepository relationShipRepository) {
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.relationShipRepository = relationShipRepository;
    }

    @KafkaListener(topics = "user-registration", groupId = "msgGroup")
    public void saveMessage(String message) {
        userRepository.save(new UserEntity(message));
    }

    @Scheduled(fixedRate = 1_000)
    public void sendMessage(){
        List<RelationShipEntity> relationShipEntities = relationShipRepository.findAllByIsSent(false);
        for (var relation : relationShipEntities) {
            String message = relation.getFollower().getUsername() + "," + relation.getFollowing().getUsername();
            kafkaTemplate.send("user-relationship", message).whenComplete((result, ex) -> {
                if (ex == null) {
                    relation.setSent(true);
                    relationShipRepository.save(relation);
                } else {
//                      log.error("Kafka send failed for user {}", user.getId(), ex);
                }
            });
        }
    }

    public void sendDeleted(String message) {
        kafkaTemplate.send("user-relationship",message);
    }

    public void sendUsernameChange(String message) {
        kafkaTemplate.send("name-change", message);
    }
}