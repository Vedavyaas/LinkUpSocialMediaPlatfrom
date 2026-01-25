package com.vedavyaas.messagingservice.service;

import com.vedavyaas.messagingservice.dto.ChatMessageRequest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/chat")
    public void liveChat(@Payload ChatMessageRequest request, @AuthenticationPrincipal Jwt jwt){
        String fromUser = jwt.getSubject();
        messageService.sendLiveMessage(fromUser, request);
    }
}
