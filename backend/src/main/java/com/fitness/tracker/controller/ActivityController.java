package com.fitness.tracker.controller;

import com.fitness.tracker.dto.ActivityDto;
import com.fitness.tracker.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityDto.Response> logActivity(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ActivityDto.CreateRequest request) {
        return ResponseEntity.ok(activityService.logActivity(userDetails.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityDto.Response>> getAllActivities(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(activityService.getAllActivities(userDetails.getUsername()));
    }

    @GetMapping("/today")
    public ResponseEntity<List<ActivityDto.Response>> getTodayActivities(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(activityService.getTodayActivities(userDetails.getUsername()));
    }

    @GetMapping("/summary/daily")
    public ResponseEntity<ActivityDto.DailySummary> getDailySummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        return ResponseEntity.ok(activityService.getDailySummary(userDetails.getUsername(), date));
    }

    @GetMapping("/summary/weekly")
    public ResponseEntity<List<ActivityDto.DailySummary>> getWeeklySummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(activityService.getWeeklySummary(userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        activityService.deleteActivity(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
