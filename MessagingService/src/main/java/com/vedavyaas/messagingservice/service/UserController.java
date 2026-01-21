package com.vedavyaas.messagingservice.service;

import com.vedavyaas.messagingservice.user.UserEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/get/allUsers")
    public List<UserEntity> getUsers(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.getUsers(username);
    }

    @PutMapping("/follow/user")
    public String followRequest(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.followRequest(username, id);
    }

    @GetMapping("/get/followRequest")
    public List<UserEntity> getFollowRequest(@AuthenticationPrincipal Jwt jwt){
        String username = jwt.getSubject();
        return userService.getRequests(username);
    }
    @PutMapping("/accept/followRequest")
    public String acceptFollowRequest(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt){
        String username = jwt.getSubject();
        return userService.changeFollow(username, id);
    }
}
