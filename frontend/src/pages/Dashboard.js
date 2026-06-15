import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { calculateAchievements } from "../utils/achievementUtils";
import { calculateStreak } from "../utils/streakUtils";

import {
  getDailySummary,
  getWeeklySummary,
  getTodayActivities,
  getGoals,
  updateGoals,
  getAllActivities,
} from "../services/api";

import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ICONS = {
  RUNNING: "🏃",
  WALKING: "🚶",
  CYCLING: "🚴",
  SWIMMING: "🏊",
  GYM_WEIGHTS: "🏋️",
  YOGA: "🧘",
  HIIT: "🔥",
  OTHER: "⚡",
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [today, setToday] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const [goals, setGoals] = useState({
    dailyStepGoal: 10000,
    dailyCalorieGoal: 500,
    dailyActiveMinutesGoal: 60,
  });

  const { user } = useAuth();

  const [activities, setActivities] = useState([]);
  const [achievementCount, setAchievementCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const daily = await getDailySummary();
      setSummary(daily.data);
      setSelectedSummary(daily.data);

      const weeklyRes = await getWeeklySummary();
      setWeekly(weeklyRes.data);

      const todayRes = await getTodayActivities();
      setToday(todayRes.data);

      const activitiesRes = await getAllActivities();
      setActivities(activitiesRes.data);

      const achievements = calculateAchievements(activitiesRes.data);

      setAchievementCount(achievements.filter((a) => a.earned).length);

      setCurrentStreak(calculateStreak(activitiesRes.data));

      const goalsRes = await getGoals();
      setGoals(goalsRes.data);

      const todayDate = new Date().toISOString().split("T")[0];
      setSelectedDate(todayDate);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSelectedDay = async (date) => {
    try {
      const res = await getDailySummary(date);

      setSelectedDate(date);
      setSelectedSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveGoals = async () => {
    try {
      await updateGoals(goals);

      const daily = await getDailySummary();

      setSummary(daily.data);
      setSelectedSummary(daily.data);

      alert("Goals updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update goals");
    }
  };

  const pct = (val, goal) => {
    const v = val || 0;
    const g = goal || 1;

    return Math.min(100, Math.round((v / g) * 100));
  };

  const display = selectedSummary || summary;

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    if (hour < 21) return "Evening";

    return "Night";
  };

  const chartData = {
    labels: weekly.map(
      (d) =>
        DAYS[
          new Date(d.date).getDay() === 0 ? 6 : new Date(d.date).getDay() - 1
        ],
    ),

    datasets: [
      {
        data: weekly.map((d) => d.totalSteps),

        backgroundColor: weekly.map((d) =>
          d.date === selectedDate ? "#378ADD" : "#B5D4F4",
        ),

        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    onClick: (_, elements) => {
      if (!elements.length) return;

      const index = elements[0].index;
      const clickedDay = weekly[index];

      if (clickedDay?.date) {
        loadSelectedDay(clickedDay.date);
      }
    },

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        grid: {
          color: "#EDF2F7",
        },
      },
    },
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          👋 Good {getGreeting()}, {user?.fullName?.split(" ")[0] || "User"}
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            color: "#718096",
            fontWeight: "600",
          }}
        >
          <div>🔥 {currentStreak} Day Streak</div>

          <div>
            🏆 {achievementCount} Achievement
            {achievementCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      {display && (
        <>
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#718096",
                  }}
                >
                  Viewing Activity
                </div>

                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  📅 {selectedDate || "Today"}
                </div>
              </div>
            </div>
          </div>

          <div className="goal-grid">
            <div className="goal-card">
              <div className="goal-circle">
                {pct(display.totalSteps, display.stepGoal)}%
              </div>

              <div className="goal-icon">👟</div>

              <div className="goal-title">Steps</div>

              <div className="goal-value">
                {(display.totalSteps || 0).toLocaleString()} /
                {(display.stepGoal || 10000).toLocaleString()}
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-circle">
                {pct(display.totalCalories, display.calorieGoal)}%
              </div>

              <div className="goal-icon">🔥</div>

              <div className="goal-title">Calories</div>

              <div className="goal-value">
                {display.totalCalories || 0} /{display.calorieGoal || 500}
              </div>
            </div>

            <div className="goal-card">
              <div className="goal-circle">
                {pct(display.totalMinutes, display.minutesGoal)}%
              </div>

              <div className="goal-icon">⏱</div>

              <div className="goal-title">Active Time</div>

              <div className="goal-value">
                {display.totalMinutes || 0} /{display.minutesGoal || 60}
              </div>
            </div>
          </div>

        </>
      )}

      <div className="card" style={{ marginTop: "1.25rem" }}>
        <div className="card-title">🎯 My Daily Goals</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <div className="metric">
            <div className="metric-label">👟 Steps Goal</div>

            <input
              type="number"
              value={goals.dailyStepGoal}
              onChange={(e) =>
                setGoals({
                  ...goals,
                  dailyStepGoal: Number(e.target.value),
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                marginTop: "10px",
              }}
            />
          </div>

          <div className="metric">
            <div className="metric-label">🔥 Calories Goal</div>

            <input
              type="number"
              value={goals.dailyCalorieGoal}
              onChange={(e) =>
                setGoals({
                  ...goals,
                  dailyCalorieGoal: Number(e.target.value),
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                marginTop: "10px",
              }}
            />
          </div>

          <div className="metric">
            <div className="metric-label">⏱ Active Minutes Goal</div>

            <input
              type="number"
              value={goals.dailyActiveMinutesGoal}
              onChange={(e) =>
                setGoals({
                  ...goals,
                  dailyActiveMinutesGoal: Number(e.target.value),
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                marginTop: "10px",
              }}
            />
          </div>
        </div>

        <button
          onClick={saveGoals}
          style={{
            marginTop: "20px",
            width: "100%",
            background: "#378ADD",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Save Goals
        </button>
      </div>

      {weekly.length > 0 && (
        <div className="card" style={{ marginTop: "1.25rem" }}>
          <div className="card-title">📊 Weekly Activity</div>

          <div
            style={{
              fontSize: "13px",
              color: "#718096",
              marginBottom: "10px",
            }}
          >
            Click any bar to view that day's statistics
          </div>

          <div style={{ height: 180 }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: "1.25rem" }}>
        <div className="card-title">Today's Activities</div>

        {today.length === 0 ? (
          <div
            style={{
              color: "#718096",
              fontSize: 14,
            }}
          >
            No activities logged today. Go log one! 💪
          </div>
        ) : (
          today.map((a) => (
            <div className="activity-item" key={a.id}>
              <div className="activity-icon">
                {ICONS[a.exerciseType] || "⚡"}
              </div>

              <div className="activity-info">
                <div className="activity-name">
                  {a.exerciseType.replace("_", " ")}
                </div>

                <div className="activity-meta">
                  {a.durationMinutes} min
                  {a.distanceKm ? ` · ${a.distanceKm} km` : ""}
                  {a.steps ? ` · ${a.steps.toLocaleString()} steps` : ""}
                  {a.intensity ? ` · ${a.intensity}` : ""}
                </div>
              </div>

              {a.caloriesBurned > 0 && (
                <div className="activity-cal">🔥 {a.caloriesBurned} kcal</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
