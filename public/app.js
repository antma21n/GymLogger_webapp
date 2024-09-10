// Placeholder for Firebase initialization
// firebase.initializeApp(firebaseConfig);

const landingPage = document.getElementById('landingPage');
const workoutPage = document.getElementById('workoutPage');
const visualizationPage = document.getElementById('visualizationPage');
const workoutGrid = document.getElementById('workoutGrid');
const exerciseName = document.getElementById('exerciseName');
const exerciseSelection = document.getElementById('exerciseSelection');
const exerciseSearch = document.getElementById('exerciseSearch');
const muscleGroupSelect = document.getElementById('muscleGroupSelect');
const exerciseList = document.getElementById('exerciseList');
const setsContainer = document.getElementById('sets');
const addSetBtn = document.getElementById('addSetBtn');
const removeSetBtn = document.getElementById('removeSetBtn');
const changeExerciseBtn = document.getElementById('changeExerciseBtn');
const nextExerciseBtn = document.getElementById('nextExerciseBtn');
const submitWorkoutBtn = document.getElementById('submitWorkoutBtn');
const modeToggle = document.getElementById('modeToggle');

// let currentWorkout = [];
// let currentExerciseIndex = 0;
// let isCustomWorkout = false;

let currentWorkout = [];
let currentExerciseIndex = 0;
let isCustomWorkout = false;
let workoutData = {}; // New object to store the entire workout data


// Exercise dictionary grouped by muscle groups
const exercisesByMuscle = {
    chest: ['Bench Press', 'Incline Bench Press', 'DB Bench Press', 'DB Incline Bench Press', 'Machine Chest Press', 'Dumbbell Flyes', 'Push-ups'],
    back: ['Pull-ups', 'Cable Rows', 'DB Rows', 'Barbell Rows', 'Row Machine', 'Lat Pulldowns', 'Deadlifts'],
    legs: ['Squats', 'Leg Press', 'Lunges', 'Calf Raises'],
    shoulders: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Shrugs', 'Face Pulls'],
    arms: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls', 'Skull Crushers', 'Cable Curls', 'Barbell Curls'],
    core: ['Plank', 'Russian Twists', 'Crunches', 'Leg Raises']
};

// Populate muscle group select
for (const muscleGroup in exercisesByMuscle) {
    const option = document.createElement('option');
    option.value = muscleGroup;
    option.textContent = muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1);
    muscleGroupSelect.appendChild(option);
}

// Predefined workouts with additional data. this would come from Firebase
const workouts = {
    push: {
        name: 'Push Workout',
        exercises: ['Bench Press', 'Shoulder Press', 'Tricep Extensions'],
        lastPerformed: '2023-05-15',
        description: 'Focus on pushing movements for chest, shoulders, and triceps.'
    },
    pull: {
        name: 'Pull Workout',
        exercises: ['Pull-ups', 'Rows', 'Bicep Curls'],
        lastPerformed: '2023-05-17',
        description: 'Target pulling movements for back and biceps.'
    },
    legs: {
        name: 'Legs Workout',
        exercises: ['Squats', 'Deadlifts', 'Leg Press'],
        lastPerformed: '2023-05-19',
        description: 'Strengthen your lower body with compound movements.'
    },
    misc: {
        name: 'Misc Workout',
        exercises: ['Plank', 'Russian Twists', 'Calf Raises'],
        lastPerformed: '2023-05-20',
        description: 'Mix of exercises for overall fitness and core strength.'
    },
    fullBody: {
        name: 'Full Body Workout',
        exercises: ['Squats', 'Bench Press', 'Rows', 'Shoulder Press'],
        lastPerformed: '2023-05-22',
        description: 'Complete full body workout targeting all major muscle groups.'
    },
    fromScratch: {
        name: 'Start from Scratch',
        exercises: [],
        lastPerformed: 'N/A',
        description: 'Create a custom workout with exercises of your choice. (NOTE this is broken for submitting data dynamically)'
    }
};

function createWorkoutCard(workoutType, workoutData) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.dataset.workout = workoutType;

    const content = `
        <h3>${workoutData.name}</h3>
        <p>${workoutData.description}</p>
        <p>Exercises: ${workoutData.exercises.length ? workoutData.exercises.join(', ') : 'None'}</p>
        <p>Last performed: ${workoutData.lastPerformed}</p>
        <button class="workout-btn">Start</button>
        ${workoutType !== 'fromScratch' ? '<button class="remove-workout">&times;</button>' : ''}
    `;

    card.innerHTML = content;

    card.querySelector('.workout-btn').addEventListener('click', () => startWorkout(workoutType));
    if (workoutType !== 'fromScratch') {
        card.querySelector('.remove-workout').addEventListener('click', (e) => {
            e.stopPropagation();
            removeWorkout(workoutType);
        });
    }

    return card;
}

function createNewWorkoutCard() {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
        <div class="create-workout">
            <button class="create-workout-btn">+</button>
            <p>Create New Workout Plan</p>
        </div>
    `;
    card.querySelector('.create-workout-btn').addEventListener('click', createNewWorkoutPlan);
    return card;
}

function renderWorkoutCards() {
    workoutGrid.innerHTML = '';
    for (const [workoutType, workoutData] of Object.entries(workouts)) {
        workoutGrid.appendChild(createWorkoutCard(workoutType, workoutData));
    }
    workoutGrid.appendChild(createNewWorkoutCard());
}

function startWorkout(workoutType) {
    currentWorkout = [...workouts[workoutType].exercises];
    currentExerciseIndex = 0;
    isCustomWorkout = workoutType === 'fromScratch';
    landingPage.style.display = 'none';
    workoutPage.style.display = 'block';
    
    // Initialize workoutData
    workoutData = {
        type: workoutType,
        name: workouts[workoutType].name,
        startTime: new Date().toISOString(),
        exercises: []
    };
    
    updateExercise();
}

function updateExercise() {
    if (currentWorkout.length === 0 || currentExerciseIndex >= currentWorkout.length) {
        showExerciseSelection();
    } else {
        hideExerciseSelection();
        exerciseName.textContent = currentWorkout[currentExerciseIndex];
        setsContainer.innerHTML = '';
        addSet();
    }
    
    updateButtons();
}

function updateButtons() {
    if (isCustomWorkout) {
        nextExerciseBtn.textContent = 'Add Exercise';
        nextExerciseBtn.style.display = 'inline-block';
        submitWorkoutBtn.style.display = 'block';
    } else {
        if (currentExerciseIndex === currentWorkout.length - 1) {
            nextExerciseBtn.style.display = 'none';
            submitWorkoutBtn.style.display = 'block';
        } else {
            nextExerciseBtn.textContent = 'Next Exercise';
            nextExerciseBtn.style.display = 'inline-block';
            submitWorkoutBtn.style.display = 'none';
        }
    }
}

function showExerciseSelection() {
    exerciseSelection.style.display = 'block';
    exerciseName.textContent = 'Select an Exercise';
    setsContainer.innerHTML = '';
    changeExerciseBtn.style.display = 'none';
    nextExerciseBtn.style.display = 'none';
}

function hideExerciseSelection() {
    exerciseSelection.style.display = 'none';
    changeExerciseBtn.style.display = 'inline-block';
    nextExerciseBtn.style.display = 'inline-block';
}

function addSet() {
    const setDiv = document.createElement('div');
    setDiv.className = 'set';
    const setNumber = setsContainer.children.length + 1;
    setDiv.innerHTML = `
        <span>Set ${setNumber}:</span>
        <button class="decrease-weight">-</button>
        <input type="number" class="weight" value="0" min="0"> lbs
        <button class="increase-weight">+</button>
        <button class="decrease-reps">-</button>
        <input type="number" class="reps" value="0" min="0"> reps
        <button class="increase-reps">+</button>
    `;
    setsContainer.appendChild(setDiv);

    const weightInput = setDiv.querySelector('.weight');
    const repsInput = setDiv.querySelector('.reps');

    setDiv.querySelector('.decrease-weight').addEventListener('click', () => changeValue(weightInput, -5));
    setDiv.querySelector('.increase-weight').addEventListener('click', () => changeValue(weightInput, 5));
    setDiv.querySelector('.decrease-reps').addEventListener('click', () => changeValue(repsInput, -1));
    setDiv.querySelector('.increase-reps').addEventListener('click', () => changeValue(repsInput, 1));

    // Add event listeners to update workoutData when input values change
    weightInput.addEventListener('change', () => updateSetData(setNumber, 'weight', weightInput.value));
    repsInput.addEventListener('change', () => updateSetData(setNumber, 'reps', repsInput.value));
}

function changeValue(input, delta) {
    input.value = Math.max(0, parseInt(input.value) + delta);
    // Trigger the 'change' event to update workoutData
    input.dispatchEvent(new Event('change'));
}

function updateSetData(setNumber, property, value) {
    if (!workoutData.exercises[currentExerciseIndex]) {
        workoutData.exercises[currentExerciseIndex] = {
            name: currentWorkout[currentExerciseIndex],
            sets: []
        };
    }
    
    if (!workoutData.exercises[currentExerciseIndex].sets[setNumber - 1]) {
        workoutData.exercises[currentExerciseIndex].sets[setNumber - 1] = {};
    }
    
    workoutData.exercises[currentExerciseIndex].sets[setNumber - 1][property] = parseInt(value);
}

function removeSet() {
    if (setsContainer.children.length > 1) {
        setsContainer.removeChild(setsContainer.lastChild);
    }
}

function changeExercise() {
    showExerciseSelection();
}

function nextExercise() {
    // Save current exercise data before moving to the next one
    saveCurrentExerciseData();
    
    if (isCustomWorkout) {
        showExerciseSelection();
    } else {
        currentExerciseIndex++;
        updateExercise();
    }
}

function saveCurrentExerciseData() {
    const sets = Array.from(setsContainer.children).map(setDiv => ({
        weight: parseInt(setDiv.querySelector('.weight').value),
        reps: parseInt(setDiv.querySelector('.reps').value)
    }));
    
    if (!workoutData.exercises[currentExerciseIndex]) {
        workoutData.exercises[currentExerciseIndex] = {
            name: currentWorkout[currentExerciseIndex],
            sets: sets
        };
    } else {
        workoutData.exercises[currentExerciseIndex].sets = sets;
    }
}

function submitWorkout() {
    // Save data for the last exercise
    saveCurrentExerciseData();
    
    // Add end time to the workout data
    workoutData.endTime = new Date().toISOString();
    
    // Generate a unique document ID based on date and workout type
    const docId = `${workoutData.startTime.split('T')[0]}_${workoutData.type}_${Date.now()}`;
    
    // Log the workout data (replace this with Firebase Firestore submission)
    console.log('Submitting workout data with ID:', docId);
    console.log('Workout Data:', JSON.stringify(workoutData, null, 2));
    
    // Placeholder for Firebase Firestore submission
    // firebase.firestore().collection('workouts').doc(docId).set(workoutData)
    //     .then(() => {
    //         console.log('Workout successfully submitted to Firestore');
    //         alert('Workout submitted successfully!');
    //         landingPage.style.display = 'block';
    //         workoutPage.style.display = 'none';
    //     })
    //     .catch((error) => {
    //         console.error('Error submitting workout:', error);
    //         alert('Error submitting workout. Please try again.');
    //     });
    
    // For now, we'll just show an alert and return to the landing page
    alert('Workout submitted successfully!');
    landingPage.style.display = 'block';
    workoutPage.style.display = 'none';
}

function filterExercises() {
    const searchTerm = exerciseSearch.value.toLowerCase();
    const selectedMuscleGroup = muscleGroupSelect.value;
    
    let filteredExercises = [];
    
    if (selectedMuscleGroup) {
        filteredExercises = exercisesByMuscle[selectedMuscleGroup];
    } else {
        filteredExercises = Object.values(exercisesByMuscle).flat();
    }
    
    filteredExercises = filteredExercises.filter(exercise => 
        exercise.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredExercises(filteredExercises);
}

function displayFilteredExercises(exercises) {
    exerciseList.innerHTML = '';
    exercises.forEach(exercise => {
        const li = document.createElement('li');
        li.textContent = exercise;
        li.addEventListener('click', () => selectExercise(exercise));
        exerciseList.appendChild(li);
    });
}

function selectExercise(exercise) {
    if (currentExerciseIndex < currentWorkout.length) {
        currentWorkout[currentExerciseIndex] = exercise;
    } else {
        currentWorkout.push(exercise);
    }
    hideExerciseSelection();
    updateExercise();
}

function removeWorkout(workoutType) {
    if (confirm(`Are you sure you want to remove the ${workouts[workoutType].name} workout?`)) {
        delete workouts[workoutType];
        renderWorkoutCards();
    }
}

function toggleMode() {
    if (modeToggle.checked) {
        landingPage.style.display = 'none';
        workoutPage.style.display = 'none';
        visualizationPage.style.display = 'block';
    } else {
        visualizationPage.style.display = 'none';
        landingPage.style.display = 'block';
    }
}

function createNewWorkoutPlan() {
    // Placeholder for creating a new workout plan
    alert('This feature would allow you to create a custom workout plan.');
    // In a real implementation, you might open a modal or navigate to a new page
    // where users can define their custom workout
}

// Event Listeners
addSetBtn.addEventListener('click', addSet);
removeSetBtn.addEventListener('click', removeSet);
changeExerciseBtn.addEventListener('click', changeExercise);
nextExerciseBtn.addEventListener('click', nextExercise);
submitWorkoutBtn.addEventListener('click', submitWorkout);

exerciseSearch.addEventListener('input', filterExercises);
muscleGroupSelect.addEventListener('change', filterExercises);

modeToggle.addEventListener('change', toggleMode);

document.getElementById('loginBtn').addEventListener('click', () => {
    // Placeholder for login functionality
    alert('Login functionality would be implemented here, integrated with Firebase Authentication.');
});

// Initial render
renderWorkoutCards();