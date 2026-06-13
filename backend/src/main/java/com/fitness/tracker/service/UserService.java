package com.fitness.tracker.service;

import com.fitness.tracker.dto.UserGoalsDto;
import com.fitness.tracker.entity.User;
import com.fitness.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserGoalsDto getGoals(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserGoalsDto.builder()
                .dailyStepGoal(user.getDailyStepGoal())
                .dailyCalorieGoal(user.getDailyCalorieGoal())
                .dailyActiveMinutesGoal(user.getDailyActiveMinutesGoal())
                .build();
    }

    public UserGoalsDto updateGoals(
            String username,
            UserGoalsDto request
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setDailyStepGoal(request.getDailyStepGoal());
        user.setDailyCalorieGoal(request.getDailyCalorieGoal());
        user.setDailyActiveMinutesGoal(
                request.getDailyActiveMinutesGoal()
        );

        userRepository.save(user);

        return UserGoalsDto.builder()
                .dailyStepGoal(user.getDailyStepGoal())
                .dailyCalorieGoal(user.getDailyCalorieGoal())
                .dailyActiveMinutesGoal(
                        user.getDailyActiveMinutesGoal()
                )
                .build();
    }
}