import React, { useEffect, useState } from "react";
import {
  getDailySummary,
  getWeeklySummary,
  getTodayActivities,
  getGoals,
  updateGoals,
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
      <div className="page-title">Dashboard</div>

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

          <div className="metric-grid">
            <div className="metric">
              <div className="metric-label">👟 Steps</div>

              <div className="metric-value">
                {(display.totalSteps || 0).toLocaleString()}
              </div>

              <div className="metric-unit">
                / {(display.stepGoal || 10000).toLocaleString()} goal
              </div>
            </div>

            <div className="metric">
              <div className="metric-label">🔥 Calories</div>

              <div className="metric-value">{display.totalCalories || 0}</div>

              <div className="metric-unit">kcal burned</div>
            </div>

            <div className="metric">
              <div className="metric-label">⏱ Active</div>

              <div className="metric-value">{display.totalMinutes || 0}</div>

              <div className="metric-unit">minutes</div>
            </div>

            <div className="metric">
              <div className="metric-label">💪 Workouts</div>

              <div className="metric-value">{display.totalWorkouts || 0}</div>

              <div className="metric-unit">workouts</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1.25rem" }}>
            <div className="card-title">Daily Goals Progress</div>

            {[
              {
                label: "Steps",
                val: display.totalSteps,
                goal: display.stepGoal,
                color: "#378ADD",
              },
              {
                label: "Calories",
                val: display.totalCalories,
                goal: display.calorieGoal,
                color: "#1D9E75",
              },
              {
                label: "Active Min",
                val: display.totalMinutes,
                goal: display.minutesGoal,
                color: "#EF9F27",
              },
            ].map(({ label, val, goal, color }) => (
              <div className="progress-row" key={label}>
                <span className="progress-label">{label}</span>

                <div className="progress-bg">
                  <div
                    className="progress-fill"
                    style={{
                      width: pct(val, goal) + "%",
                      background: color,
                    }}
                  />
                </div>

                <span className="progress-pct">{pct(val, goal)}%</span>
              </div>
            ))}
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
