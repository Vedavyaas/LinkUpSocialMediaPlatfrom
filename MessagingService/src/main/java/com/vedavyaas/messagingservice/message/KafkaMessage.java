package com.vedavyaas.messagingservice.message;

import com.vedavyaas.messagingservice.repository.RelationShipEntity;
import com.vedavyaas.messagingservice.repository.RelationShipRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class KafkaMessage {
    private final RelationShipRepository relationShipRepository;

    public KafkaMessage(RelationShipRepository relationShipRepository) {
        this.relationShipRepository = relationShipRepository;
    }

    @KafkaListener(topics = "user-relationship", groupId = "msgGroup")
    public void listenRelationship(String message){
        String[] details = message.split(",");

        if(details[2] != null && details[2].equals("deleted")) {
            relationShipRepository.deleteRelationShipEntitiesByFollowerAndFollowing(details[0], details[1]);
            return;
        }

        RelationShipEntity relationShipEntity = new RelationShipEntity(details[0], details[1]);
        relationShipRepository.save(relationShipEntity);
    }

    @KafkaListener(topics = "name-change", groupId = "msgGroup")
    public void usernameChange(String message) {
        String[] messages = message.split(",");

        List<RelationShipEntity> relationShipEntities = relationShipRepository.findAllByFollower(messages[0]);
        for (var i : relationShipEntities) {
            i.setFollower(messages[1]);

        }
        relationShipRepository.saveAll(relationShipEntities);

        List<RelationShipEntity> relationShipEntities1 = relationShipRepository.findAllByFollowing(messages[0]);
        for (var i : relationShipEntities1) {
            i.setFollowing(messages[1]);
        }
        relationShipRepository.saveAll(relationShipEntities1);
    }
}