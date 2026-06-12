package com.fitness.tracker.repository;

import com.fitness.tracker.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByUserIdOrderByActivityDateDescLoggedAtDesc(Long userId);

    List<Activity> findByUserIdAndActivityDateOrderByLoggedAtDesc(Long userId, LocalDate date);

    List<Activity> findByUserIdAndActivityDateBetweenOrderByActivityDateDesc(
            Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(a.caloriesBurned), 0) FROM Activity a WHERE a.user.id = :userId AND a.activityDate = :date")
    Integer sumCaloriesByUserAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(a.steps), 0) FROM Activity a WHERE a.user.id = :userId AND a.activityDate = :date")
    Integer sumStepsByUserAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(a.durationMinutes), 0) FROM Activity a WHERE a.user.id = :userId AND a.activityDate = :date")
    Integer sumMinutesByUserAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT a.activityDate, COALESCE(SUM(a.steps), 0) FROM Activity a WHERE a.user.id = :userId AND a.activityDate BETWEEN :start AND :end GROUP BY a.activityDate ORDER BY a.activityDate")
    List<Object[]> findDailyStepsByUserAndDateRange(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
