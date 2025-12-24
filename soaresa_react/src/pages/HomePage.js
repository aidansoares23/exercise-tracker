import React, { useState, useEffect, useRef } from 'react';
import ExerciseList from '../components/ExerciseList';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../api';

function HomePage({ setExerciseToEdit }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWakeNotice, setShowWakeNotice] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const wakeTimerRef = useRef(null);

  const onDelete = async (_id) => {
    const response = await fetch(apiUrl(`/exercises/${_id}`), { method: 'DELETE' });
    if (response.status === 204) {
      setExercises((prev) => prev.filter((e) => e._id !== _id));
    } else {
      console.error(`Failed to delete exercise with _id: ${_id}`);
    }
  };

  const onEdit = (exercise) => {
    setExerciseToEdit(exercise);
    navigate('/edit-exercise');
  };

  const loadExercises = async () => {
    setLoading(true);
    setError(null);
    setShowWakeNotice(false);

    // Show "waking up" banner only if it's actually slow
    if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
    wakeTimerRef.current = setTimeout(() => setShowWakeNotice(true), 5000);

    // Hard timeout so it doesn't spin forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(apiUrl('/exercises'), { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }

      setExercises(data);
    } catch (err) {
      console.error(err);

      const isAbort = err?.name === 'AbortError';

      setError(
        isAbort
          ? 'Backend is likely waking up (free Render tier) and took too long. Please retry in a few seconds.'
          : 'The server may be waking up (free hosting). Please wait a moment and retry.'
      );
    } finally {
      clearTimeout(timeoutId);
      if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
      wakeTimerRef.current = null;

      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
    return () => {
      if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
    };
  }, []);

  return (
    <>
      {loading && (
        <div style={{ marginTop: '12px' }}>
          <p style={{ color: '#6b7280', margin: 0 }}>Loading exercises…</p>

          {showWakeNotice && (
            <div
              role="status"
              aria-live="polite"
              style={{
                marginTop: '10px',
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                background: '#f9fafb',
                color: '#374151',
                lineHeight: 1.35,
              }}
            >
              <strong>Waking up the backend…</strong> (free Render tier)
              <br />
              First load can take ~10–30 seconds after inactivity.
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ marginTop: '12px', color: '#991b1b' }}>
          <p style={{ margin: 0 }}>{error}</p>
          <button onClick={loadExercises} style={{ marginTop: '8px' }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <ExerciseList exercises={exercises} onDelete={onDelete} onEdit={onEdit} />
      )}
    </>
  );
}

export default HomePage;
