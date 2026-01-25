package com.vedavyaas.messagingservice.dto;

import java.time.LocalDateTime;

public class ChatMessageResponse {
    private String fromUser;
    private String message;
    private LocalDateTime timestamp;

    public ChatMessageResponse() {
    }

    public ChatMessageResponse(String fromUser, String message, LocalDateTime timestamp) {
        this.fromUser = fromUser;
        this.message = message;
        this.timestamp = timestamp;
    }

    public String getFromUser() {
        return fromUser;
    }

    public void setFromUser(String fromUser) {
        this.fromUser = fromUser;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
