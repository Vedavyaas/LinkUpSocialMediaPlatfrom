package com.vedavyaas.authservcie.service;

import com.vedavyaas.authservcie.assests.JWTToken;
import com.vedavyaas.authservcie.assests.LoginRequest;
import com.vedavyaas.authservcie.message.KafkaMessage;
import com.vedavyaas.authservcie.repository.UserEntity;
import com.vedavyaas.authservcie.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final KafkaMessage kafkaMessage;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtEncoder jwtEncoder, KafkaMessage kafkaMessage) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtEncoder = jwtEncoder;
        this.kafkaMessage = kafkaMessage;
    }

    @PreAuthorize("hasAuthority('SCOPE_ROLE_ADMIN')")
    public String createAccount(LoginRequest loginRequest){
        if(userRepository.existsByUsername(loginRequest.username())) return "Username already exists";

        UserEntity user = new UserEntity(loginRequest.username(), passwordEncoder.encode(loginRequest.password()));
        userRepository.save(user);


        kafkaMessage.sendMessage("user-registration", loginRequest.username());
        return "Account created successfully";
    }

    ResponseEntity<JWTToken> authenticate(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));
        String token = createToken(authentication);
        return ResponseEntity.ok(new JWTToken(token));
    }

    private String createToken(Authentication authentication) {
        var claims = JwtClaimsSet.builder().issuer("self").issuedAt(Instant.now()).expiresAt(Instant.now().plusSeconds(60 * 10)).subject(authentication.getName()).claim("scope", createScope(authentication)).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    private String createScope(Authentication authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(" "));
    }

    public String reset(String username, String newPassword) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        if(user.isEmpty()) return "Username not found";
        user.get().setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user.get());
        return "Password changed successfully";
    }
}
