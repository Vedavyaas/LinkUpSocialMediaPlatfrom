package com.vedavyaas.messagingservice.repository;

import jakarta.persistence.*;

import java.util.Collections;
import java.util.List;

@Entity
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    private RelationShipEntity relation;
    private List<String> messages;

    public MessageEntity(RelationShipEntity relationShipEntity, String message) {
        this.relation = relationShipEntity;
        this.messages = Collections.singletonList(message);
    }

    public MessageEntity() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public RelationShipEntity getRelation() {
        return relation;
    }

    public void setRelation(RelationShipEntity relation) {
        this.relation = relation;
    }
}
