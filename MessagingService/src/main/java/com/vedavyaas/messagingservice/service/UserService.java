package com.vedavyaas.messagingservice.service;

import com.vedavyaas.messagingservice.assets.Status;
import com.vedavyaas.messagingservice.user.RelationShipEntity;
import com.vedavyaas.messagingservice.user.RelationShipRepository;
import com.vedavyaas.messagingservice.user.UserEntity;
import com.vedavyaas.messagingservice.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RelationShipRepository relationShipRepository;

    public UserService(UserRepository userRepository, RelationShipRepository relationShipRepository) {
        this.userRepository = userRepository;
        this.relationShipRepository = relationShipRepository;
    }

    public List<UserEntity> getUsers(String username) {
        return userRepository.findAllByUsernameNot(username);
    }

    public String followRequest(String user, Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        if (userEntity.isEmpty()) return "User does not exists";
        Long userId = userRepository.findUserIdByUsername(user).getId();

        RelationShipEntity relationShipEntity = new RelationShipEntity(userRepository.findById(userId).get(), userEntity.get());
        relationShipRepository.save(relationShipEntity);
        return "Wait for approval";
    }

    public List<UserEntity> getRequests(String username) {
        UserEntity user = userRepository.findByUsername(username);
        return relationShipRepository.findFollowersOfUsers(user);
    }

    public String changeFollow(String username, Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        if(userEntity.isEmpty()) return "User not found";

        UserEntity acceptorUser = userRepository.findByUsername(username);

        Optional<RelationShipEntity> relationShipEntity = relationShipRepository.findByFollowerAndFollowing(userEntity.get(), acceptorUser);
        relationShipEntity.get().setStatus(Status.ACCEPTED);
        relationShipRepository.save(relationShipEntity.get());

        return "Follow request accepted successfully";
    }
}
