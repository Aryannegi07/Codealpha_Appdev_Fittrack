-- ============================================================
-- Fitness Tracker Seed Data (optional / for testing)
-- Run AFTER schema.sql
-- ============================================================

-- Test user  (password: "password123" BCrypt-hashed)
INSERT INTO users (username, email, password, full_name, age, weight_kg, height_cm,
                   daily_step_goal, daily_calorie_goal, daily_active_minutes_goal)
VALUES (
    'testuser',
    'test@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Test User',
    25,
    70.0,
    175.0,
    10000,
    500,
    60
);

-- Sample activities for testuser
INSERT INTO activities (user_id, exercise_type, duration_minutes, calories_burned, distance_km, steps, intensity, notes, activity_date)
VALUES
    (1, 'RUNNING',     35, 310, 5.2, 6800, 'HIGH',     'Morning run',        CURRENT_DATE),
    (1, 'GYM_WEIGHTS', 45, 280,  0,  1200, 'MODERATE', 'Upper body day',     CURRENT_DATE - 1),
    (1, 'CYCLING',     40, 320, 12.5,   0, 'MODERATE', 'Evening ride',       CURRENT_DATE - 2),
    (1, 'WALKING',     30, 120,  3.0, 4500, 'LOW',     'Lunch walk',         CURRENT_DATE - 3),
    (1, 'HIIT',        25, 380,  0,     0,  'HIGH',    'Home HIIT session',   CURRENT_DATE - 4),
    (1, 'YOGA',        40,  90,  0,     0,  'LOW',     'Evening yoga',        CURRENT_DATE - 5),
    (1, 'RUNNING',     30, 270,  4.5, 5900, 'MODERATE','Neighbourhood run',  CURRENT_DATE - 6);
