package com.vedavyaas.messagingservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RelationShipRepository extends JpaRepository<RelationShipEntity, Long> {
    void deleteRelationShipEntitiesByFollowerAndFollowing(String follower, String following);

    List<RelationShipEntity> findAllByFollower(String follower);

    List<RelationShipEntity> findAllByFollowing(String following);
}