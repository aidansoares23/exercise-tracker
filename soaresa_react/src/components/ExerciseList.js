import { useState } from "react";
import Exercise from "./Exercise";

function ExerciseList({ exercises, onDelete, onEdit }) {
  const [showHint, setShowHint] = useState(true);

  return (
    <div
      className={`table-wrap ${showHint ? "has-hint" : ""}`}
      aria-label="Exercise table"
      onScroll={(e) => {
        if (e.currentTarget.scrollLeft > 0) {
          setShowHint(false);
        }
      }}
    >
      <table id="exercises">
        <thead>
          <tr>
            <th>Name</th>
            <th>Reps</th>
            <th>Weight</th>
            <th>Unit</th>
            <th>Date</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise, i) => (
            <Exercise
              exercise={exercise}
              onDelete={onDelete}
              onEdit={onEdit}
              key={i}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExerciseList;
