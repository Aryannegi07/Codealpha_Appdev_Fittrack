import React, { useEffect, useState } from "react";
import { getAllActivities, deleteActivity } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { calculateAchievements } from "../utils/achievementUtils";
import { calculateStreak } from "../utils/streakUtils";

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

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = () => {
    getAllActivities()
      .then((r) => setActivities(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;

    try {
      await deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  // Lifetime totals
  const totalSteps = activities.reduce((sum, a) => sum + (a.steps || 0), 0);

  const totalCalories = activities.reduce(
    (sum, a) => sum + (a.caloriesBurned || 0),
    0,
  );

  // Last 7 Days Statistics
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyActivities = activities.filter((activity) => {
    if (!activity.activityDate) return false;

    const activityDate = new Date(activity.activityDate);
    return activityDate >= sevenDaysAgo;
  });

  const weeklySteps = weeklyActivities.reduce(
    (sum, a) => sum + (a.steps || 0),
    0,
  );

  const weeklyCalories = weeklyActivities.reduce(
    (sum, a) => sum + (a.caloriesBurned || 0),
    0,
  );

  const weeklyActivityCount = weeklyActivities.length;

  // Achievements
  const achievements = calculateAchievements(activities);

  const earnedAchievements = achievements.filter(
    (achievement) => achievement.earned,
  );

  const recentAchievements = earnedAchievements.slice(-3);

  // Streak
  const currentStreak = calculateStreak(activities);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="page-title">My Account</div>

      <div className="account-header">
        <div className="account-name">
          👤 {user?.fullName || user?.username || "User"}
        </div>

        <div className="account-email">📧 {user?.email || "No Email"}</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <div className="metric">
            <div className="metric-label">🎂 Age</div>
            <div className="metric-value">{user?.age || "--"}</div>
          </div>

          <div className="metric">
            <div className="metric-label">📏 Height</div>
            <div className="metric-value">{user?.heightCm || "--"}</div>
            <div className="metric-unit">cm</div>
          </div>

          <div className="metric">
            <div className="metric-label">⚖️ Weight</div>
            <div className="metric-value">{user?.weightKg || "--"}</div>
            <div className="metric-unit">kg</div>
          </div>
        </div>
      </div>

      <div className="account-grid">
        {/* Achievements */}
        <div className="account-section">
          <h3>🏆 Achievements</h3>

          {recentAchievements.length === 0 ? (
            <div style={{ color: "#718096", marginBottom: "12px" }}>
              No achievements earned yet.
            </div>
          ) : (
            <div style={{ marginBottom: "12px" }}>
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  {achievement.icon} {achievement.title}
                </div>
              ))}
            </div>
          )}

          <a
            href="/achievements"
            className="btn btn-primary"
            style={{
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            View All Achievements
          </a>
        </div>

        {/* Weekly Statistics */}
        <div className="account-section">
          <h3>📊 Last 7 Days</h3>

          <div className="account-stat">
            <span>🔥 Current Streak</span>
            <strong>{currentStreak} Days</strong>
          </div>

          <div className="account-stat">
            <span>Steps</span>
            <strong>{weeklySteps.toLocaleString()}</strong>
          </div>

          <div className="account-stat">
            <span>Calories</span>
            <strong>{weeklyCalories}</strong>
          </div>

          <div className="account-stat">
            <span>Activities</span>
            <strong>{weeklyActivityCount}</strong>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="card-title">📜 Recent Activities</div>

        {loading && (
          <div style={{ color: "#718096", fontSize: 14 }}>Loading...</div>
        )}

        {!loading && activities.length === 0 && (
          <div style={{ color: "#718096", fontSize: 14 }}>
            No activities logged yet. Head to Log Activity to add one!
          </div>
        )}

        {activities.map((a) => (
          <div className="activity-item" key={a.id}>
            <div className="activity-icon">{ICONS[a.exerciseType] || "⚡"}</div>

            <div className="activity-info">
              <div className="activity-name">
                {a.exerciseType.replace("_", " ")}
              </div>

              <div className="activity-meta">
                {a.activityDate} · {a.durationMinutes} min
                {a.distanceKm ? ` · ${a.distanceKm} km` : ""}
                {a.steps ? ` · ${a.steps.toLocaleString()} steps` : ""}
                {a.intensity ? ` · ${a.intensity}` : ""}
              </div>

              {a.notes && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#A0AEC0",
                    marginTop: 2,
                  }}
                >
                  {a.notes}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 6,
              }}
            >
              {a.caloriesBurned > 0 && (
                <div className="activity-cal">🔥 {a.caloriesBurned} kcal</div>
              )}

              <button
                className="btn btn-danger"
                onClick={() => handleDelete(a.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div
        className="account-section"
        style={{
          marginTop: "20px",
        }}
      >
        <button
          className="btn btn-danger"
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
