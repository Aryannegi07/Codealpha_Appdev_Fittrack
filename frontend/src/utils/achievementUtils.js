export const calculateAchievements = (activities) => {
  const totalSteps = activities.reduce(
    (sum, activity) => sum + (activity.steps || 0),
    0
  );

  const totalCalories = activities.reduce(
    (sum, activity) => sum + (activity.caloriesBurned || 0),
    0
  );

  const totalActivities = activities.length;

  return [
    {
      title: "First Workout",
      icon: "🏅",
      earned: totalActivities >= 1,
      description: "Logged your first activity",
    },
    {
      title: "10K Steps",
      icon: "👟",
      earned: totalSteps >= 10000,
      description: "Walked 10,000 total steps",
    },
    {
      title: "25K Steps",
      icon: "🚶",
      earned: totalSteps >= 25000,
      description: "Walked 25,000 total steps",
    },
    {
      title: "50K Steps",
      icon: "🏃",
      earned: totalSteps >= 50000,
      description: "Walked 50,000 total steps",
    },
    {
      title: "Burn 5,000 Calories",
      icon: "🔥",
      earned: totalCalories >= 5000,
      description: "Burned 5,000 calories",
    },
    {
      title: "Burn 20,000 Calories",
      icon: "💪",
      earned: totalCalories >= 20000,
      description: "Burned 20,000 calories",
    },
    {
      title: "Activity Master",
      icon: "⭐",
      earned: totalActivities >= 50,
      description: "Completed 50 activities",
    },
    {
      title: "Fitness Legend",
      icon: "👑",
      earned: totalActivities >= 100,
      description: "Completed 100 activities",
    },
  ];
};