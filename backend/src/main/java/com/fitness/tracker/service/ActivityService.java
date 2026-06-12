package com.fitness.tracker.service;

import com.fitness.tracker.dto.ActivityDto;
import com.fitness.tracker.entity.Activity;
import com.fitness.tracker.entity.User;
import com.fitness.tracker.repository.ActivityRepository;
import com.fitness.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ActivityDto.Response logActivity(String username, ActivityDto.CreateRequest request) {
        User user = getUser(username);

        Activity activity = Activity.builder()
                .user(user)
                .exerciseType(request.getExerciseType())
                .durationMinutes(request.getDurationMinutes())
                .caloriesBurned(request.getCaloriesBurned())
                .distanceKm(request.getDistanceKm())
                .steps(request.getSteps())
                .intensity(request.getIntensity())
                .notes(request.getNotes())
                .activityDate(request.getActivityDate() != null ? request.getActivityDate() : LocalDate.now())
                .build();

        return toResponse(activityRepository.save(activity));
    }

    public List<ActivityDto.Response> getAllActivities(String username) {
        User user = getUser(username);
        return activityRepository
                .findByUserIdOrderByActivityDateDescLoggedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ActivityDto.Response> getTodayActivities(String username) {
        User user = getUser(username);
        return activityRepository
                .findByUserIdAndActivityDateOrderByLoggedAtDesc(user.getId(), LocalDate.now())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ActivityDto.DailySummary getDailySummary(String username, LocalDate date) {
        User user = getUser(username);
        List<Activity> activities = activityRepository
                .findByUserIdAndActivityDateOrderByLoggedAtDesc(user.getId(), date);

        int totalCals  = activities.stream().mapToInt(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0).sum();
        int totalSteps = activities.stream().mapToInt(a -> a.getSteps() != null ? a.getSteps() : 0).sum();
        int totalMins  = activities.stream().mapToInt(Activity::getDurationMinutes).sum();

        return ActivityDto.DailySummary.builder()
                .date(date)
                .totalCalories(totalCals)
                .totalSteps(totalSteps)
                .totalMinutes(totalMins)
                .totalWorkouts(activities.size())
                .stepGoal(user.getDailyStepGoal()             != null ? user.getDailyStepGoal()             : 10000)
                .calorieGoal(user.getDailyCalorieGoal()       != null ? user.getDailyCalorieGoal()           : 500)
                .minutesGoal(user.getDailyActiveMinutesGoal() != null ? user.getDailyActiveMinutesGoal()     : 60)
                .build();
    }

    public List<ActivityDto.DailySummary> getWeeklySummary(String username) {
        User user = getUser(username);
        LocalDate today     = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);

        return weekStart.datesUntil(today.plusDays(1)).map(date -> {
            List<Activity> acts = activityRepository
                    .findByUserIdAndActivityDateOrderByLoggedAtDesc(user.getId(), date);
            return ActivityDto.DailySummary.builder()
                    .date(date)
                    .totalCalories(acts.stream().mapToInt(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0).sum())
                    .totalSteps(acts.stream().mapToInt(a -> a.getSteps() != null ? a.getSteps() : 0).sum())
                    .totalMinutes(acts.stream().mapToInt(Activity::getDurationMinutes).sum())
                    .totalWorkouts(acts.size())
                    .stepGoal(user.getDailyStepGoal()             != null ? user.getDailyStepGoal()         : 10000)
                    .calorieGoal(user.getDailyCalorieGoal()       != null ? user.getDailyCalorieGoal()       : 500)
                    .minutesGoal(user.getDailyActiveMinutesGoal() != null ? user.getDailyActiveMinutesGoal() : 60)
                    .build();
        }).collect(Collectors.toList());
    }

    public void deleteActivity(String username, Long activityId) {
        User user = getUser(username);
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        if (!activity.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        activityRepository.delete(activity);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ActivityDto.Response toResponse(Activity a) {
        return ActivityDto.Response.builder()
                .id(a.getId())
                .exerciseType(a.getExerciseType())
                .durationMinutes(a.getDurationMinutes())
                .caloriesBurned(a.getCaloriesBurned())
                .distanceKm(a.getDistanceKm())
                .steps(a.getSteps())
                .intensity(a.getIntensity())
                .notes(a.getNotes())
                .activityDate(a.getActivityDate())
                .loggedAt(a.getLoggedAt())
                .build();
    }
}