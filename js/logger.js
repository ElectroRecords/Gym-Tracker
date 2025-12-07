// logger.js - Workout logging functionality

let currentDay = '';

// Initialize logger for selected day
function initLogger(day) {
    currentDay = day;
    const container = document.getElementById('logger-container');

    if (!day) {
        container.innerHTML = '<p class="no-data">Selecciona un día para comenzar</p>';
        return;
    }

    const dayData = workoutRoutine[day];
    container.innerHTML = '';

    dayData.exercises.forEach((exercise, index) => {
        const exerciseLogger = createExerciseLogger(exercise, index);
        container.appendChild(exerciseLogger);
    });
}

// Create exercise logger element
function createExerciseLogger(exercise, exerciseIndex) {
    const div = document.createElement('div');
    div.className = 'exercise-logger';

    const numSets = parseInt(exercise.sets.split('-')[1] || exercise.sets);

    let setsHTML = '';
    for (let i = 0; i < numSets; i++) {
        setsHTML += `
            <div class="set-logger" data-exercise="${exercise.id}" data-set="${i}">
                <div class="set-header">Serie ${i + 1}</div>
                <div class="set-inputs">
                    <div class="input-group">
                        <label>Peso (kg)</label>
                        <input type="number" 
                               class="input-field weight-input" 
                               min="0" 
                               step="0.5" 
                               placeholder="0"
                               data-exercise="${exercise.id}"
                               data-set="${i}">
                    </div>
                    <div class="input-group">
                        <label>Repeticiones</label>
                        <input type="number" 
                               class="input-field reps-input" 
                               min="1" 
                               max="20" 
                               placeholder="0"
                               data-exercise="${exercise.id}"
                               data-set="${i}">
                    </div>
                    <div class="input-group">
                        <label>RIR</label>
                        <input type="text" 
                               class="input-field rir-input" 
                               placeholder="${exercise.rir}"
                               data-exercise="${exercise.id}"
                               data-set="${i}">
                    </div>
                </div>
                <button class="btn-primary save-set-btn" 
                        data-exercise="${exercise.id}" 
                        data-set="${i}">
                    Guardar Serie
                </button>
            </div>
        `;
    }

    div.innerHTML = `
        <div class="exercise-logger-header">
            <img src="images/exercises/${exercise.id}.png" 
                 alt="${exercise.name}"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%2300f3ff%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22 fill=%22white%22%3E${exercise.muscleGroup}%3C/text%3E%3C/svg%3E'">
            <div>
                <h3>${exercise.name}</h3>
                <p style="color: var(--text-secondary);">${exercise.sets} series × ${exercise.reps} reps (RIR ${exercise.rir})</p>
            </div>
        </div>
        ${setsHTML}
    `;

    // Add event listeners to save buttons
    setTimeout(() => {
        div.querySelectorAll('.save-set-btn').forEach(btn => {
            btn.addEventListener('click', handleSaveSet);
        });

        // Add input validation
        div.querySelectorAll('.weight-input').forEach(input => {
            input.addEventListener('input', (e) => validateWeight(e.target));
        });

        div.querySelectorAll('.reps-input').forEach(input => {
            input.addEventListener('input', (e) => validateReps(e.target));
        });
    }, 0);

    return div;
}

// Validate weight input
function validateWeight(input) {
    const value = parseFloat(input.value);
    if (value < 0 || isNaN(value)) {
        input.classList.add('error');
        return false;
    }
    input.classList.remove('error');
    return true;
}

// Validate reps input
function validateReps(input) {
    const value = parseInt(input.value);
    if (value < 1 || value > 20 || isNaN(value)) {
        input.classList.add('error');
        return false;
    }
    input.classList.remove('error');
    return true;
}

// Handle save set
function handleSaveSet(e) {
    const btn = e.target;
    const exerciseId = btn.dataset.exercise;
    const setIndex = parseInt(btn.dataset.set);

    const setLogger = btn.closest('.set-logger');
    const weightInput = setLogger.querySelector('.weight-input');
    const repsInput = setLogger.querySelector('.reps-input');
    const rirInput = setLogger.querySelector('.rir-input');

    // Validate inputs
    const weightValid = validateWeight(weightInput);
    const repsValid = validateReps(repsInput);

    if (!weightValid || !repsValid) {
        alert('Por favor, ingresa valores válidos:\n- Peso: mayor o igual a 0\n- Repeticiones: entre 1 y 20');
        return;
    }

    const weight = parseFloat(weightInput.value);
    const reps = parseInt(repsInput.value);
    const rir = rirInput.value.trim() || '0';

    // Save to storage
    const workoutLog = {
        day: currentDay,
        exerciseId: exerciseId,
        exerciseName: getExerciseById(exerciseId).name,
        sets: [{
            setNumber: setIndex + 1,
            weight: weight,
            reps: reps,
            rir: rir
        }]
    };

    saveWorkoutLog(workoutLog);

    // Mark set as completed
    setLogger.classList.add('set-completed');
    weightInput.disabled = true;
    repsInput.disabled = true;
    rirInput.disabled = true;
    btn.disabled = true;
    btn.textContent = 'Completado ✓';

    // Show rest timer
    showRestTimer();
}

// Show rest timer modal
function showRestTimer() {
    const modal = document.getElementById('rest-timer-modal');
    modal.classList.add('active');
}
