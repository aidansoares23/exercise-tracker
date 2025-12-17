import ExerciseForm from '../components/ExerciseForm';

export const AddExercisePage = () => {
  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const initialExercise = {
    name: '',
    reps: '',
    weight: '',
    unit: 'lbs',
    date: todayISO,
  };

  const requestConfig = {
    url: '/exercises',
    method: 'POST',
    successMessage: 'Successfully added the exercise',
  };

  return (
    <ExerciseForm
      initialValues={initialExercise}
      requestConfig={requestConfig}
      submitLabel="Add"
    />
  );
};

export default AddExercisePage;
