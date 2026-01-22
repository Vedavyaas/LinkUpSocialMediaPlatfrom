package com.vedavyaas.profileservice.user;

import com.vedavyaas.profileservice.assets.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RelationShipRepository extends JpaRepository<RelationShipEntity, Long> {
    @Query("SELECT r.follower FROM RelationShipEntity r WHERE r.following = :user")
    List<UserEntity> findFollowersOfUsers(@Param("user") UserEntity user);

    @Query("SELECT r FROM RelationShipEntity r WHERE r.follower = :follower AND r.following = :following")
    Optional<RelationShipEntity> findByFollowerAndFollowing(UserEntity follower, UserEntity following);

    void deleteRelationShipEntitiesByFollowerAndFollowing(UserEntity follower, UserEntity following);
    boolean existsByFollowerAndFollowingAndBlocked(UserEntity follower, UserEntity following, boolean blocked);

    @Query("SELECT r.follower FROM RelationShipEntity r WHERE r.following = :user AND r.status = :status")
    List<UserEntity> findFollowersOfUsersAndIsAccepted(UserEntity user, Status status);

    @Query("SELECT r.following FROM RelationShipEntity r WHERE r.follower = :user AND r.status =:status")
    List<UserEntity> findFollowingOfUser(UserEntity user, Status status);
}
