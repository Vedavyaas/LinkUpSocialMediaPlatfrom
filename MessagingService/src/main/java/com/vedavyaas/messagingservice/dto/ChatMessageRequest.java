package com.vedavyaas.messagingservice.dto;

public class ChatMessageRequest {
    private String toUser;
    private String message;

    public ChatMessageRequest() {
    }

    public ChatMessageRequest(String toUser, String message) {
        this.toUser = toUser;
        this.message = message;
    }

    public String getToUser() {
        return toUser;
    }

    public void setToUser(String toUser) {
        this.toUser = toUser;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
