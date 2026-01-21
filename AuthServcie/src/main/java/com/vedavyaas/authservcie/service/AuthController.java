package com.vedavyaas.authservcie.service;

import com.vedavyaas.authservcie.assests.JWTToken;
import com.vedavyaas.authservcie.assests.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/create/account")
    public String createAccount(@RequestBody LoginRequest loginRequest){
        return authService.createAccount(loginRequest);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> login(@RequestBody LoginRequest loginRequest){
        return authService.authenticate(loginRequest);
    }
    @PostMapping("/forget/password")
    public String passwordReset(@RequestBody LoginRequest loginRequest){
        return authService.reset(loginRequest.username(), loginRequest.password());
    }
}
