import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddExercisePage = () => {

    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('');
    const [date, setDate] = useState('');
    
    const navigate = useNavigate();

    const [showTooltip, setShowTooltip] = useState(false);

    const handleDataHover = () => {
        setShowTooltip(true);
    };

    const handleDataLeave = () => {
        setShowTooltip(false);
    };

    const addExercise = async () => {
        const newExercise = {name, reps, weight, unit, date};
        const response = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 201) {
            alert("Successfully added the exercise");
        } else {
            alert(`Failed to create exercise, Status ${response.status}, Invalid request`);
        }
        navigate("/");
    };

    return(
        <div>
            <h1>Add Exercise</h1>
            <input
                type="text"
                placeholder="Enter name here"
                value={name}
                onChange={e => setName(e.target.value)} />
            <input
                type="number"
                placeholder="Enter reps here"
                value={reps}
                onChange={e => setReps(e.target.value)} />
             <input
                type="Number"
                placeholder="Enter weight here"
                value={weight}
                onChange={e => setWeight(e.target.value)} />
            <select 
                value={unit}
                onChange={e => setUnit(e.target.value)} >
                    <option value="">Select unit</option>
                    <option value="kgs">kgs</option>
                    <option value="lbs">lbs</option>
            </select>
            <input
                type="text"
                placeholder="Enter date here"
                value={date}
                onChange={e => setDate(e.target.value)} 
                onMouseEnter={handleDataHover}
                onMouseLeave={handleDataLeave}
                />
            <button onClick={addExercise}>Add</button>
            
            {showTooltip && (
        <div className="tooltip">Please format date following MM-DD-YY</div>
      )}

        </div>
    );
}

export default AddExercisePage;