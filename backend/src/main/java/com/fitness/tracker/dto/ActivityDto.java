package com.fitness.tracker.dto;

import com.fitness.tracker.entity.Activity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ActivityDto {

    @Data
    public static class CreateRequest {
        @NotNull
        private Activity.ExerciseType exerciseType;

        @NotNull
        @Min(1)
        private Integer durationMinutes;

        @Min(0)
        private Integer caloriesBurned;

        private Double distanceKm;
        private Integer steps;
        private Activity.Intensity intensity;
        private String notes;
        private LocalDate activityDate;
    }

    @Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    @lombok.Builder
    public static class Response {
        private Long id;
        private Activity.ExerciseType exerciseType;
        private Integer durationMinutes;
        private Integer caloriesBurned;
        private Double distanceKm;
        private Integer steps;
        private Activity.Intensity intensity;
        private String notes;
        private LocalDate activityDate;
        private LocalDateTime loggedAt;
    }

    @Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    @lombok.Builder
    public static class DailySummary {
        private LocalDate date;
        private Integer totalCalories;
        private Integer totalSteps;
        private Integer totalMinutes;
        private Integer totalWorkouts;
        private Integer stepGoal;
        private Integer calorieGoal;
        private Integer minutesGoal;
    }
}
