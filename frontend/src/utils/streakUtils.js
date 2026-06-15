export const calculateStreak = (activities) => {
  if (!activities || activities.length === 0) {
    return 0;
  }

  const validDates = activities
    .filter((activity) => activity.activityDate)
    .map((activity) => activity.activityDate);

  const uniqueDates = [...new Set(validDates)];

  if (uniqueDates.length === 0) {
    return 0;
  }

  uniqueDates.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < uniqueDates.length; i++) {
    const activityDate = new Date(uniqueDates[i]);

    if (isNaN(activityDate.getTime())) {
      continue;
    }

    activityDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today.getTime() - activityDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
};