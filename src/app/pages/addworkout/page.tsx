'use client'
import React from 'react'
import './addworkout.css'
import {toast} from 'react-toastify'

interface Workout {
    name: string;
    description: string;
    durationInMinutes: number;
    exercises: Exercise[];
    imageURL: string;
    imageFile: File | null;
}

interface Exercise {
    name: string;
    description: string;
    sets: number;
    reps: number;
    imageURL: string;
    imageFile: File | null;
}

const page = () => {

    const [workout, setWorkout] = React.useState<Workout>({
        name: '',
        description: '',
        durationInMinutes: 0,
        exercises: [],
        imageURL: '',
        imageFile: null
    });

    const [exercise, setExercise] = React.useState<Exercise>({
        name: '',
        description: '',
        sets: 0,
        reps: 0,
        imageURL: '',
        imageFile: null
    });

    const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkout({
            ...workout,
            [e.target.name]: e.target.value
        });
    };

    const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExercise({
            ...exercise,
            [e.target.name]: e.target.value
        });
    };

    const addExerciseToWorkout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (exercise.name === '' || exercise.description === '' || exercise.sets === 0 || exercise.reps === 0 || exercise.imageFile === null) {
            toast.error('Please fill all the fields', {
                position: 'top-center',
            });
            return;
        }
        setWorkout({
            ...workout,
            exercises: [...workout.exercises, exercise]
        });
    };

    const deleteExerciseFromWorkout = (index: number) => {
        setWorkout({
            ...workout,
            exercises: workout.exercises.filter((_, i) => i !== index)
        });
    };

    const uploadImage = async (image: File) => {
        const formData = new FormData();
        formData.append('myimage', image);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/image-upload/uploadimage`, {
            method: 'POST',
            body: formData,
            credentials:"include",
        });
        if (response.ok) {
            const data = await response.json();
            return data.imageUrl;
        } else {
            console.error('Failed to upload the image.');
            return null;
        }
    };

    const checkLogin = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });
        if (!response.ok) {
            window.location.href = '/adminauth/login';
        }
    };

    const saveWorkout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        await checkLogin();

        if (workout.name === "" || workout.description === "" || workout.durationInMinutes === 0 || workout.imageFile === null || workout.exercises.length === 0) {
            toast.error("Please fill all the details", {
                position: "top-center",
            });
            return;
        }

        if (workout.imageFile) {
            const imageURL = await uploadImage(workout.imageFile);
            if (imageURL) {
                setWorkout({
                    ...workout,
                    imageURL
                });
            }
        }

        for (let i = 0; i < workout.exercises.length; i++) {
            let tempimg = workout.exercises[i].imageFile;
            if (tempimg) {
                let imgURL = await uploadImage(tempimg);
                workout.exercises[i].imageURL = imgURL;
            }
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(workout),
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            toast.success("Workout created successfully", {
                position: "top-center",
            });
        } else {
            toast.error("Workout creation failed", {
                position: "top-center",
            });
        }
    };

    return (
        <div className="formpage">
            <h1 className="title">Add Workout</h1>

            <div className="form-container">
                {/* Workout Info */}
                <div className="form-section">
                    <input
                        type="text"
                        placeholder="Workout Name"
                        name="name"
                        value={workout.name}
                        onChange={handleWorkoutChange}
                    />
                    <textarea
                        placeholder="Workout Description"
                        name="description"
                        value={workout.description}
                        onChange={(e) => setWorkout({ ...workout, description: e.target.value })}
                        rows={5}
                    />
                    <input
                        type="number"
                        placeholder="Duration in Minutes"
                        name="durationInMinutes"
                        value={workout.durationInMinutes}
                        onChange={handleWorkoutChange}
                    />
                    <input
                        type="file"
                        placeholder="Workout Image"
                        name="WorkoutImage"
                        onChange={(e) => setWorkout({ ...workout, imageFile: e.target.files![0] })}
                    />
                </div>

                {/* Add Exercise */}
                <div className="form-section">
                    <h2>Add Exercise to Workout</h2>
                    <input
                        type="text"
                        placeholder="Exercise Name"
                        name="name"
                        value={exercise.name}
                        onChange={handleExerciseChange}
                    />
                    <textarea
                        placeholder="Exercise Description"
                        name="description"
                        value={exercise.description}
                        onChange={(e) => setExercise({ ...exercise, description: e.target.value })}
                        rows={5}
                    />
                    <div className="exercise-fields">
                        <input
                            type="number"
                            placeholder="Sets"
                            name="sets"
                            value={exercise.sets}
                            onChange={handleExerciseChange}
                        />
                        <input
                            type="number"
                            placeholder="Reps"
                            name="reps"
                            value={exercise.reps}
                            onChange={handleExerciseChange}
                        />
                    </div>
                    <input
                        type="file"
                        placeholder="Exercise Image"
                        name="exerciseImage"
                        onChange={(e) => setExercise({ ...exercise, imageFile: e.target.files![0] })}
                    />
                    <button onClick={addExerciseToWorkout}>Add Exercise</button>
                </div>

                {/* Exercises List */}
                <div className="exercises-list">
                    <h2>Exercises</h2>
                    {workout.exercises.map((ex, index) => (
                        <div key={index} className="exercise-item">
                            <h3>{ex.name}</h3>
                            <p>{ex.description}</p>
                            <p>Sets: {ex.sets}, Reps: {ex.reps}</p>
                            <img src={ex.imageFile ? URL.createObjectURL(ex.imageFile) : ex.imageURL} alt={ex.name} />
                            <button onClick={() => deleteExerciseFromWorkout(index)}>Delete</button>
                        </div>
                    ))}
                </div>

                <button className="save-workout" onClick={saveWorkout}>Save Workout</button>
            </div>
        </div>
    );
};

export default page;
