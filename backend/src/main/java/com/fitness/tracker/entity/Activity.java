package com.fitness.tracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_type", nullable = false)
    private ExerciseType exerciseType;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "steps")
    private Integer steps;

    @Enumerated(EnumType.STRING)
    @Column(name = "intensity")
    private Intensity intensity;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "logged_at", updatable = false)
    private LocalDateTime loggedAt;

    @PrePersist
    protected void onCreate() {
        loggedAt = LocalDateTime.now();
        if (activityDate == null) {
            activityDate = LocalDate.now();
        }
    }

    public enum ExerciseType {
        RUNNING, WALKING, CYCLING, SWIMMING, GYM_WEIGHTS, YOGA, HIIT, OTHER
    }

    public enum Intensity {
        LOW, MODERATE, HIGH
    }
}
