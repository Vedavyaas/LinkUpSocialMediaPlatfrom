package com.vedavyaas.messagingservice.user;

import com.vedavyaas.messagingservice.assets.Status;
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
    private Long Id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    private UserEntity follower;

    @ManyToOne
    @JoinColumn(name = "following_id")
    private UserEntity following;

    @Enumerated(EnumType.STRING)
    private Status status;

    public RelationShipEntity() {
    }

    public RelationShipEntity(UserEntity follower, UserEntity following) {
        this.follower = follower;
        this.following = following;
        this.status = Status.PENDING;
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
}
