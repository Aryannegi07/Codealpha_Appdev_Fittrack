import React, { useState } from 'react';
import { logActivity } from '../services/api';

const EXERCISE_TYPES = ['RUNNING','WALKING','CYCLING','SWIMMING','GYM_WEIGHTS','YOGA','HIIT','OTHER'];

const LogActivity = () => {
  const [form, setForm] = useState({
    exerciseType: 'RUNNING', durationMinutes: '', caloriesBurned: '',
    distanceKm: '', steps: '', intensity: 'MODERATE', notes: '', activityDate: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.durationMinutes) { setError('Duration is required.'); return; }
    setLoading(true);
    try {
      const payload = {
        exerciseType: form.exerciseType,
        durationMinutes: parseInt(form.durationMinutes),
        caloriesBurned: form.caloriesBurned ? parseInt(form.caloriesBurned) : undefined,
        distanceKm: form.distanceKm ? parseFloat(form.distanceKm) : undefined,
        steps: form.steps ? parseInt(form.steps) : undefined,
        intensity: form.intensity || undefined,
        notes: form.notes || undefined,
        activityDate: form.activityDate || undefined,
      };
      await logActivity(payload);
      setSuccess('Activity logged successfully! 🎉');
      setForm({ exerciseType: 'RUNNING', durationMinutes: '', caloriesBurned: '', distanceKm: '', steps: '', intensity: 'MODERATE', notes: '', activityDate: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log activity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-title">Log Activity</div>
      <div className="card">
        {success && <div className="success-msg">{success}</div>}
        {error   && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Exercise type *</label>
              <select name="exerciseType" value={form.exerciseType} onChange={handleChange}>
                {EXERCISE_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input name="durationMinutes" type="number" min="1" max="600" value={form.durationMinutes} onChange={handleChange} placeholder="30" required />
            </div>
            <div className="form-group">
              <label>Calories burned</label>
              <input name="caloriesBurned" type="number" min="0" value={form.caloriesBurned} onChange={handleChange} placeholder="250" />
            </div>
            <div className="form-group">
              <label>Distance (km)</label>
              <input name="distanceKm" type="number" step="0.1" min="0" value={form.distanceKm} onChange={handleChange} placeholder="5.0" />
            </div>
            <div className="form-group">
              <label>Steps</label>
              <input name="steps" type="number" min="0" value={form.steps} onChange={handleChange} placeholder="6000" />
            </div>
            <div className="form-group">
              <label>Intensity</label>
              <select name="intensity" value={form.intensity} onChange={handleChange}>
                <option value="LOW">Low</option>
                <option value="MODERATE">Moderate</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date (leave blank for today)</label>
              <input name="activityDate" type="date" value={form.activityDate} onChange={handleChange} />
            </div>
            <div className="form-group full">
              <label>Notes</label>
              <input name="notes" value={form.notes} onChange={handleChange} placeholder="e.g. Morning run in the park" maxLength={500} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving…' : '💾 Save activity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogActivity;
