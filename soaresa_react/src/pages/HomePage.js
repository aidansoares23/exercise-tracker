import React, { useState, useEffect } from 'react';
import ExerciseList from '../components/ExerciseList';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../api';

function HomePage({ setExerciseToEdit }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

    try {
      const response = await fetch(apiUrl('/exercises'));

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
      setError(
        'The server may be waking up (free hosting). Please wait a moment and refresh.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  return (
    <>
      {loading && (
        <p style={{ color: '#6b7280', marginTop: '12px' }}>
          Loading exercises…
        </p>
      )}

      {error && (
        <div style={{ marginTop: '12px', color: '#991b1b' }}>
          <p>{error}</p>
          <button onClick={loadExercises} style={{ marginTop: '8px' }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <ExerciseList
          exercises={exercises}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
    </>
  );
}

export default HomePage;
