package com.fitness.tracker.controller;

import com.fitness.tracker.dto.UserGoalsDto;
import com.fitness.tracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/goals")
    public UserGoalsDto getGoals(
            Authentication authentication
    ) {
        return userService.getGoals(
                authentication.getName()
        );
    }

    @PutMapping("/goals")
    public UserGoalsDto updateGoals(
            Authentication authentication,
            @RequestBody UserGoalsDto request
    ) {
        return userService.updateGoals(
                authentication.getName(),
                request
        );
    }
}