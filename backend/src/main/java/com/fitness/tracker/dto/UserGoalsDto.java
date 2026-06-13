package com.fitness.tracker.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGoalsDto {

    private Integer dailyStepGoal;

    private Integer dailyCalorieGoal;

    private Integer dailyActiveMinutesGoal;
}