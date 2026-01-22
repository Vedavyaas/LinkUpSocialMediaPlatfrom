package com.vedavyaas.profileservice.user;

import com.vedavyaas.profileservice.projections.UserID;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Page<UserEntity> findAllByUsernameNot(String username, Pageable pageable);

    UserID findUserIdByUsername(String username);

    @NonNull
    Optional<UserEntity> findById(Long userId);

    UserEntity findByUsername(String username);

    List<UserEntity> findByUsernameContaining(String username);
}
