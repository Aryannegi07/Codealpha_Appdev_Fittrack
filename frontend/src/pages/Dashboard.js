import React, { useEffect, useState } from "react";
import {
  getDailySummary,
  getWeeklySummary,
  getTodayActivities,
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

  useEffect(() => {
    getDailySummary()
      .then((r) => setSummary(r.data))
      .catch(() => {});
    getWeeklySummary()
      .then((r) => setWeekly(r.data))
      .catch(() => {});
    getTodayActivities()
      .then((r) => setToday(r.data))
      .catch(() => {});
  }, []);

  const pct = (val, goal) => {
    const v = val || 0;
    const g = goal || 1;
    return Math.min(100, Math.round((v / g) * 100));
  };

  const chartData = {
    labels: weekly.map(
      (d) =>
        DAYS[
          new Date(d.date).getDay() === 0 ? 6 : new Date(d.date).getDay() - 1
        ] || "",
    ),
    datasets: [
      {
        data: weekly.map((d) => d.totalSteps),
        backgroundColor: weekly.map((_, i) =>
          i === weekly.length - 1 ? "#378ADD" : "#B5D4F4",
        ),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#718096" },
      },
      y: {
        grid: { color: "#EDF2F7" },
        ticks: { font: { size: 11 }, color: "#718096" },
      },
    },
  };

  return (
    <div>
      <div className="page-title">Dashboard</div>

      {summary && (
        <>
          <div className="metric-grid">
            <div className="metric">
              <div className="metric-label">👟 Steps</div>
              <div className="metric-value">
                {(summary.totalSteps || 0).toLocaleString()}
              </div>
              <div className="metric-unit">
                / {(summary.stepGoal || 10000).toLocaleString()} goal
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">🔥 Calories</div>
              <div className="metric-value">{summary.totalCalories || 0}</div>
              <div className="metric-unit">kcal burned</div>
            </div>
            <div className="metric">
              <div className="metric-label">⏱ Active</div>
              <div className="metric-value">{summary.totalMinutes || 0}</div>
              <div className="metric-unit">minutes</div>
            </div>
            <div className="metric">
              <div className="metric-label">💪 Workouts</div>
              <div className="metric-value">{summary.totalWorkouts || 0}</div>
              <div className="metric-unit">today</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1.25rem" }}>
            <div className="card-title">Daily goals</div>
            {[
              {
                label: "Steps",
                val: summary.totalSteps,
                goal: summary.stepGoal,
                color: "#378ADD",
              },
              {
                label: "Calories",
                val: summary.totalCalories,
                goal: summary.calorieGoal,
                color: "#1D9E75",
              },
              {
                label: "Active min",
                val: summary.totalMinutes,
                goal: summary.minutesGoal,
                color: "#EF9F27",
              },
            ].map(({ label, val, goal, color }) => (
              <div className="progress-row" key={label}>
                <span className="progress-label">{label}</span>
                <div className="progress-bg">
                  <div
                    className="progress-fill"
                    style={{ width: pct(val, goal) + "%", background: color }}
                  />
                </div>
                <span className="progress-pct">{pct(val, goal)}%</span>
              </div>
            ))}
          </div>
        </>
      )}

      {weekly.length > 0 && (
        <div className="card" style={{ marginTop: "1.25rem" }}>
          <div className="card-title">Weekly steps</div>
          <div style={{ height: 180 }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: "1.25rem" }}>
        <div className="card-title">Today's activities</div>
        {today.length === 0 ? (
          <div style={{ color: "#718096", fontSize: 14 }}>
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
