package com.vedavyaas.authservcie.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByUsername(String username);

    Optional<UserEntity> findByUsername(String username);

    List<UserEntity> findAllBySent(boolean sent);
}
