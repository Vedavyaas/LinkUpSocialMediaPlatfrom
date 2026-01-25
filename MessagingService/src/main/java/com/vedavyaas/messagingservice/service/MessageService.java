package com.vedavyaas.messagingservice.service;

import com.vedavyaas.messagingservice.dto.ChatMessageResponse;
import com.vedavyaas.messagingservice.repository.MessageEntity;
import com.vedavyaas.messagingservice.repository.MessageRepository;
import com.vedavyaas.messagingservice.repository.RelationShipEntity;
import com.vedavyaas.messagingservice.repository.RelationShipRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.vedavyaas.messagingservice.dto.ChatMessageRequest;

import java.util.Optional;

@Service
public class MessageService {
    private final SimpMessagingTemplate brokerMessagingTemplate;
    private final MessageRepository messageRepository;
    private final RelationShipRepository relationShipRepository;

    public MessageService(SimpMessagingTemplate brokerMessagingTemplate, MessageRepository messageRepository, RelationShipRepository relationShipRepository) {
        this.brokerMessagingTemplate = brokerMessagingTemplate;
        this.messageRepository = messageRepository;
        this.relationShipRepository = relationShipRepository;
    }

    public void sendLiveMessage(String fromUser, ChatMessageRequest request) {
        String toUser = request.getToUser();
        String content = request.getMessage();

        ChatMessageResponse response = new ChatMessageResponse(
                fromUser,
                content,
                java.time.LocalDateTime.now()
        );
        brokerMessagingTemplate.convertAndSendToUser(toUser, "/queue/chat", response);

        // 2. Persist asynchronously
        saveMessageAsync(fromUser, toUser, content);
    }

    @Async
    public void saveMessageAsync(String fromUser, String toUser, String content) {
        Optional<RelationShipEntity> relationShipEntity = relationShipRepository.findByFollowerAndFollowing(fromUser, toUser);
        if (relationShipEntity.isEmpty()) relationShipEntity = relationShipRepository.findByFollowerAndFollowing(toUser, fromUser);
        
        if (relationShipEntity.isPresent()) {
            messageRepository.save(new MessageEntity(relationShipEntity.get(), content));
        } else {
            // Handle case where relationship is not found, or log it
            System.err.println("Could not save message: Relationship not found between " + fromUser + " and " + toUser);
        }
    }
}