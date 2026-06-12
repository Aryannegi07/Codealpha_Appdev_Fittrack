import React, { useEffect, useState } from 'react';
import { getAllActivities, deleteActivity } from '../services/api';

const ICONS = { RUNNING: '🏃', WALKING: '🚶', CYCLING: '🚴', SWIMMING: '🏊', GYM_WEIGHTS: '🏋️', YOGA: '🧘', HIIT: '🔥', OTHER: '⚡' };

const History = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);

  const fetchAll = () => {
    getAllActivities()
      .then(r => setActivities(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await deleteActivity(id);
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  return (
    <div>
      <div className="page-title">Activity History</div>
      <div className="card">
        {loading && <div style={{ color: '#718096', fontSize: 14 }}>Loading…</div>}
        {!loading && activities.length === 0 && (
          <div style={{ color: '#718096', fontSize: 14 }}>No activities logged yet. Head to "Log Activity" to add one!</div>
        )}
        {activities.map(a => (
          <div className="activity-item" key={a.id}>
            <div className="activity-icon">{ICONS[a.exerciseType] || '⚡'}</div>
            <div className="activity-info">
              <div className="activity-name">{a.exerciseType.replace('_', ' ')}</div>
              <div className="activity-meta">
                {a.activityDate} · {a.durationMinutes} min
                {a.distanceKm ? ` · ${a.distanceKm} km` : ''}
                {a.steps ? ` · ${a.steps.toLocaleString()} steps` : ''}
                {a.intensity ? ` · ${a.intensity}` : ''}
              </div>
              {a.notes && <div style={{ fontSize: 12, color: '#A0AEC0', marginTop: 2 }}>{a.notes}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              {a.caloriesBurned > 0 && <div className="activity-cal">🔥 {a.caloriesBurned} kcal</div>}
              <button className="btn btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
