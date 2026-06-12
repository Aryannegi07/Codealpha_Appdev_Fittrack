-- ============================================================
-- Fitness Tracker Database Schema
-- Database: fitness_tracker (PostgreSQL)
-- Run: psql -U postgres -d fitness_tracker -f schema.sql
-- ============================================================

CREATE DATABASE fitness_tracker;
\c fitness_tracker;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id                          BIGSERIAL PRIMARY KEY,
    username                    VARCHAR(50)  NOT NULL UNIQUE,
    email                       VARCHAR(100) NOT NULL UNIQUE,
    password                    VARCHAR(255) NOT NULL,
    full_name                   VARCHAR(100),
    age                         INTEGER CHECK (age > 0 AND age < 150),
    weight_kg                   DOUBLE PRECISION CHECK (weight_kg > 0),
    height_cm                   DOUBLE PRECISION CHECK (height_cm > 0),
    daily_step_goal             INTEGER DEFAULT 10000,
    daily_calorie_goal          INTEGER DEFAULT 500,
    daily_active_minutes_goal   INTEGER DEFAULT 60,
    created_at                  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_type       VARCHAR(30) NOT NULL
                            CHECK (exercise_type IN (
                                'RUNNING','WALKING','CYCLING','SWIMMING',
                                'GYM_WEIGHTS','YOGA','HIIT','OTHER'
                            )),
    duration_minutes    INTEGER NOT NULL CHECK (duration_minutes > 0),
    calories_burned     INTEGER CHECK (calories_burned >= 0),
    distance_km         DOUBLE PRECISION CHECK (distance_km >= 0),
    steps               INTEGER CHECK (steps >= 0),
    intensity           VARCHAR(10) CHECK (intensity IN ('LOW','MODERATE','HIGH')),
    notes               VARCHAR(500),
    activity_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    logged_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_activities_user_id        ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date           ON activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_activities_user_date      ON activities(user_id, activity_date);

-- Auto-update updated_at on users
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
