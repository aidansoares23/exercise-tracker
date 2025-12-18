import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api";

export const ExerciseForm = ({ initialValues, requestConfig, submitLabel }) => {
  const navigate = useNavigate();

  const [name, setName] = useState(initialValues.name || "");
  const [reps, setReps] = useState(
    initialValues.reps !== undefined ? String(initialValues.reps) : ""
  );
  const [weight, setWeight] = useState(
    initialValues.weight !== undefined ? String(initialValues.weight) : ""
  );
  const [unit, setUnit] = useState(initialValues.unit || "lbs");
  const [date, setDate] = useState(initialValues.date || "");

  const [error, setError] = useState(null); // { field, message }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      reps.trim().length > 0 &&
      weight.trim().length > 0 &&
      unit.trim().length > 0 &&
      date.trim().length > 0 &&
      !isSubmitting
    );
  }, [name, reps, weight, unit, date, isSubmitting]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);

    const repsNum = Number(reps);
    const weightNum = Number(weight);

    if (!name.trim()) return setError({ message: "Please enter an exercise name." });
    if (!Number.isFinite(repsNum) || repsNum <= 0)
      return setError({ message: "Reps must be a number greater than 0." });
    if (!Number.isFinite(weightNum) || weightNum < 0)
      return setError({ message: "Weight must be 0 or more." });
    if (!unit) return setError({ message: "Please select a unit." });
    if (!date.trim()) return setError({ message: "Please enter a date." });

    const exercise = {
      name: name.trim(),
      reps: repsNum,
      weight: weightNum,
      unit,
      date: date.trim(), // ISO YYYY-MM-DD (from type="date")
    };

    const { url, method, successMessage } = requestConfig;

    try {
      setIsSubmitting(true);

      const response = await fetch(apiUrl(url), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });

      if (response.ok) {
        alert(successMessage || "Success");
        navigate("/");
        return;
      }

      
    let body = null;
    try {
    body = await response.json();
    } catch {
    // ignore non-JSON response
    }


      if (body && body.field && body.message) {
        setError(body);
      } else if (body && body.message) {
        setError({ message: body.message });
      } else {
        setError({ message: `Request failed with status ${response.status}` });
      }
    } catch {
      setError({ message: "Network error. Is the server running?" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-container">
      <h1 className="page-title">{submitLabel} Exercise</h1>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-field">
        <label className="form-label">Exercise</label>
        <input
            type="text"
            placeholder="e.g. Bench Press"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        </div>

        <div className="form-field">
        <label className="form-label">Reps</label>
        <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min="1"
        />
        </div>

        <div className="form-field">
        <label className="form-label">Weight</label>
        <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0"
            step="0.5"
        />
        </div>

        <div className="form-field">
        <label className="form-label">Unit</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="lbs">lbs</option>
            <option value="kgs">kgs</option>
        </select>
        </div>

        <div className="form-field date">
        <label className="form-label">Date</label>
        <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />
        </div>

        <button className="submit" type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </form>

      {error && (
        <div className="form-error-box">
          <strong>Error:</strong> {error.message}
        </div>
      )}
    </section>
  );
};

export default ExerciseForm;
