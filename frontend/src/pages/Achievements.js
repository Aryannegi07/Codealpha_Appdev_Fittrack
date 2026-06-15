import React, { useEffect, useState } from "react";
import { getAllActivities } from "../services/api";
import { calculateAchievements } from "../utils/achievementUtils";
import { calculateStreak } from "../utils/streakUtils";

const Achievements = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllActivities()
      .then((response) => {
        setActivities(response.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const baseAchievements = calculateAchievements(activities);

  const currentStreak = calculateStreak(activities);

  const achievements = [
    ...baseAchievements,

    {
      title: "7 Day Streak",
      description: "Log activity for 7 consecutive days",
      earned: currentStreak >= 7,
      icon: "🔥",
    },

    {
      title: "30 Day Streak",
      description: "Log activity for 30 consecutive days",
      earned: currentStreak >= 30,
      icon: "⚡",
    },
  ];

  const earnedCount = achievements.filter(
    (achievement) => achievement.earned,
  ).length;

  return (
    <div>
      <div className="page-title">🏆 Achievements</div>

      <div
        style={{
          marginBottom: "16px",
          color: "#4A5568",
          fontWeight: 600,
        }}
      >
        Earned {earnedCount} of {achievements.length} achievements
      </div>

      <div className="achievement-page-grid">
        {loading ? (
          <div
            style={{
              color: "#718096",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Loading achievements...
          </div>
        ) : (
          achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement-page-card ${
                achievement.earned ? "achievement-earned" : "achievement-locked"
              }`}
            >
              <div className="achievement-badge">
                {achievement.earned ? "🏆" : "🔒"}
              </div>

              <div className="achievement-title">
                {achievement.icon
                  ? `${achievement.icon} ${achievement.title}`
                  : achievement.title}
              </div>

              <div className="achievement-description">
                {achievement.description}
              </div>

              <div className="achievement-status">
                {achievement.earned ? "✅ Earned" : "🔒 Locked"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievements;
