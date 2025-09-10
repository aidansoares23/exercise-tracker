import React from 'react';
import ExerciseList from '../components/ExerciseList';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage({setExerciseToEdit}) {
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();

    const onDelete = async _id => {
        const response = await fetch(`/exercises/${_id}`, {method: 'DELETE'});
        if (response.status === 204) {
            setExercises(exercises.filter(e => e._id !== _id));
        } else {
            console.error(`Failed to delete exercise with _id: ${_id}, status code = ${response.status}`);
        }
    };

    const onEdit = exercise => {
        setExerciseToEdit(exercise);
        navigate("/edit-exercise");
    };

    const loadExercises = async () => {
        const response = await fetch('/exercises');//goes to localhost:3000 to retrieve exercises
        const data = await response.json();
        setExercises(data);
    };

    useEffect(() => {
        loadExercises();
    }, []);

    return (
        <>
            <br />
            <ExerciseList exercises={exercises} onDelete={onDelete} onEdit={onEdit} />
        </>
    );
}

export default HomePage;