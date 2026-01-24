package com.vedavyaas.profileservice.service;

import com.vedavyaas.profileservice.repository.UserEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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
    public List<UserEntity> getFollowRequest(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.getRequests(username);
    }

    @PutMapping("/accept/followRequest")
    public String acceptFollowRequest(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.changeFollow(username, id);
    }

    @DeleteMapping("/request/Unfollow")
    public String unFollow(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.unfollow(username, id);
    }

    @DeleteMapping("/request/delete")
    public String deleteFollower(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.deleteFollow(username, id);
    }

    @GetMapping("/get/user/username")
    public List<UserEntity> findByUsername(@RequestParam String username) {
        return userService.getByUsername(username);
    }

    @GetMapping("/get/user/id")
    public UserEntity findById(@RequestParam Long id) {
        return userService.getById(id);
    }

    @PutMapping("/update/username")
    public String updateUsername(@RequestParam String newUsername, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.changeUsername(username, newUsername);
    }

    @PutMapping("/block/user")
    public String blockUser(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.blockUserOrUnblockUser(username, id, true);
    }

    @PutMapping("/unblock/user")
    public String unblockUser(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.blockUserOrUnblockUser(username, id, false);
    }

    @GetMapping("/get/followers")
    public List<UserEntity> getListFollowers(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.getFollowers(username);
    }

    @GetMapping("/get/following")
    public List<UserEntity> getListFollowing(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.getFollowing(username);
    }

    @GetMapping("/get/followers/count")
    public int getCountFollowers(@AuthenticationPrincipal Jwt jwt){
        String username = jwt.getSubject();
        return userService.countOfFollowers(username);
    }

    @GetMapping("/count/following/count")
    public int getCountFollowing(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.countOfFollowing(username);
    }

    @GetMapping("/is/blocked")
    public boolean isBlocked(@RequestParam Long id, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return userService.isBlocked(username, id);
    }

    @GetMapping("/get/stats/followers")
    public int getStatsFollowers(@RequestParam(required = false) Long id, @AuthenticationPrincipal Jwt jwt) {
        if (id != null) {
            return userService.getFollowerCount(id);
        }
        return userService.countOfFollowers(jwt.getSubject());
    }

    @GetMapping("/get/stats/following")
    public int getStatsFollowing(@RequestParam(required = false) Long id, @AuthenticationPrincipal Jwt jwt) {
        if (id != null) {
            return userService.getFollowingCount(id);
        }
        return userService.countOfFollowing(jwt.getSubject());
    }
}