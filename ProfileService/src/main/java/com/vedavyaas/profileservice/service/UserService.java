package com.vedavyaas.profileservice.service;

import com.vedavyaas.profileservice.assets.Status;
import com.vedavyaas.profileservice.user.RelationShipEntity;
import com.vedavyaas.profileservice.user.RelationShipRepository;
import com.vedavyaas.profileservice.user.UserEntity;
import com.vedavyaas.profileservice.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
        List<UserEntity> userEntities = new ArrayList<>();
        int page = 0;
        int size = 50;
        Page<UserEntity> userEntityPage;
        do {
            Pageable pageable = PageRequest.of(page, size);
            userEntityPage = userRepository.findAllByUsernameNot(username, pageable);
            userEntities.addAll(userEntityPage.getContent());
            page++;
        } while (userEntityPage.hasNext());

        return userEntities;
    }

    @Transactional
    public String followRequest(String user, Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        if (userEntity.isEmpty()) return "User does not exists";
        Long userId = userRepository.findUserIdByUsername(user).getId();

        if (relationShipRepository.existsByFollowerAndFollowingAndBlocked((userRepository.findById(userId).get()), userEntity.get(), true))
            return "Blocked";

        RelationShipEntity relationShipEntity = new RelationShipEntity(userRepository.findById(userId).get(), userEntity.get());
        relationShipRepository.save(relationShipEntity);
        return "Wait for approval";
    }

    public List<UserEntity> getRequests(String username) {
        UserEntity user = userRepository.findByUsername(username);
        return relationShipRepository.findFollowersOfUsers(user);
    }

    @Transactional
    public String changeFollow(String username, Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        if (userEntity.isEmpty()) return "User not found";

        UserEntity acceptorUser = userRepository.findByUsername(username);

        Optional<RelationShipEntity> relationShipEntity = relationShipRepository.findByFollowerAndFollowing(userEntity.get(), acceptorUser);
        relationShipEntity.get().setStatus(Status.ACCEPTED);
        relationShipRepository.save(relationShipEntity.get());

        return "Follow request accepted successfully";
    }

    @Transactional
    public String unfollow(String username, Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        if (userEntity.isEmpty()) return "User not found";
        relationShipRepository.deleteRelationShipEntitiesByFollowerAndFollowing(userRepository.findByUsername(username), userEntity.get());

        return "Unfollowed";
    }

    @Transactional
    public String deleteFollow(String username, Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        if (userEntity.isEmpty()) return "User not found";
        relationShipRepository.deleteRelationShipEntitiesByFollowerAndFollowing(userEntity.get(), userRepository.findByUsername(username));

        return "Deleted request";
    }

    public List<UserEntity> getByUsername(String username) {
        return userRepository.findByUsernameContaining(username);
    }

    public UserEntity getById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public String changeUsername(String username, String newUsername) {
        UserEntity userEntity = userRepository.findByUsername(username);

        userEntity.setUsername(newUsername);
        userRepository.save(userEntity);

        return "Username changed successfully";
    }


    public String unblockUserOrUnblockUser(String username, Long id, boolean doBlock) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        if (userEntity.isEmpty()) return "User not found";


        UserEntity user = userRepository.findByUsername(username);
        Optional<RelationShipEntity> relationShipEntity = relationShipRepository.findByFollowerAndFollowing(user, userEntity.get());
        if (relationShipEntity.isEmpty())
            relationShipEntity = relationShipRepository.findByFollowerAndFollowing(userEntity.get(), user);

        if (relationShipEntity.isEmpty()) return "User not found.(User not in list of follower/following)";

        relationShipEntity.get().setBlocked(doBlock);
        relationShipRepository.save(relationShipEntity.get());

        return doBlock ? "User blocked successfully" : "User unblocked successfully";
    }

    public List<UserEntity> getFollowers(String username) {
        UserEntity user = userRepository.findByUsername(username);

        return relationShipRepository.findFollowersOfUsersAndIsAccepted(user, Status.ACCEPTED);
    }

    public List<UserEntity> getFollowing(String username) {
        UserEntity user = userRepository.findByUsername(username);

        return relationShipRepository.findFollowingOfUser(user, Status.ACCEPTED);
    }

    public int countOfFollowers(String username) {
        return getFollowers(username).size();
    }

    public int countOfFollowing(String username) {
        return getFollowing(username).size();
    }
}
