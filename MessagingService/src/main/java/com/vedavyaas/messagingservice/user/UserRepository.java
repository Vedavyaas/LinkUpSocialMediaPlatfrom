package com.vedavyaas.messagingservice.user;

import com.vedavyaas.messagingservice.projections.UserID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByUsername(String username);

    List<UserEntity> findAllByUsernameNot(String username);

    UserID findUserIdByUsername(String username);

    Optional<UserEntity> findById(Long userId);

    UserEntity findByUsername(String username);
}
