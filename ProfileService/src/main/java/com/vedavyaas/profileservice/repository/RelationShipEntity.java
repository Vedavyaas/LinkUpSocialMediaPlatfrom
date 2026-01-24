package com.vedavyaas.profileservice.repository;

import com.vedavyaas.profileservice.assets.Status;
import jakarta.persistence.*;

@Entity
@Table(
        name = "relationship",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_follower_following",
                columnNames = {"follower_id", "following_id"}
        )
)
public class RelationShipEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    private UserEntity follower;

    @ManyToOne
    @JoinColumn(name = "following_id")
    private UserEntity following;

    @Enumerated(EnumType.STRING)
    private Status status;
    private boolean blocked;
    private boolean isSent;
    public RelationShipEntity() {
    }

    public RelationShipEntity(UserEntity follower, UserEntity following) {
        this.follower = follower;
        this.following = following;
        this.status = Status.PENDING;
        this.blocked = false;
        this.isSent = true;
    }

    public UserEntity getFollower() {
        return follower;
    }

    public void setFollower(UserEntity follower) {
        this.follower = follower;
    }

    public UserEntity getFollowing() {
        return following;
    }

    public void setFollowing(UserEntity following) {
        this.following = following;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isSent() {
        return isSent;
    }

    public void setSent(boolean sent) {
        isSent = sent;
    }

}
