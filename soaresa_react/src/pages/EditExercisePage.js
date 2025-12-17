import ExerciseForm from '../components/ExerciseForm';

export const EditExercisePage = ({ exerciseToEdit }) => {
    const requestConfig = {
        url: `/exercises/${exerciseToEdit._id}`,
        method: 'PUT',
        successMessage: 'Successfully edited the exercise',
    };

    return (
        <ExerciseForm
            initialValues={exerciseToEdit}
            requestConfig={requestConfig}
            submitLabel="Save"
        />
    );
};

export default EditExercisePage;
