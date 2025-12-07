// app.js - Main application logic

// Timer variables
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load settings
    const settings = getSettings();
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-icon').textContent = '☀️';
    }

    // Initialize navigation
    initNavigation();

    // Initialize theme toggle
    initThemeToggle();

    // Initialize sections
    initRoutineSection();
    initLoggerSection();
    initHistorySection();
    initCharts();
    initCalendar();
    initProfileSection();

    // Initialize rest timer modal
    initRestTimer();

    // Update dashboard stats
    updateDashboardStats();

    // Initialize scroll detection
    initScrollDetection();
}

// Initialize scroll detection for header/nav shrinking
function initScrollDetection() {
    const header = document.querySelector('.app-header');
    const nav = document.querySelector('.main-nav');
    let isScrolled = false;
    let ticking = false;

    const SCROLL_THRESHOLD_DOWN = 60;
    const SCROLL_THRESHOLD_UP = 10;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                // Use hysteresis to prevent flickering
                if (!isScrolled && currentScroll > SCROLL_THRESHOLD_DOWN) {
                    header.classList.add('scrolled');
                    nav.classList.add('scrolled');
                    isScrolled = true;
                } else if (isScrolled && currentScroll < SCROLL_THRESHOLD_UP) {
                    header.classList.remove('scrolled');
                    nav.classList.remove('scrolled');
                    isScrolled = false;
                }

                ticking = false;
            });

            ticking = true;
        }
    });
}

// Initialize navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;

            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active section
            document.querySelectorAll('.content-section').forEach(s => {
                s.classList.remove('active');
            });
            document.getElementById(`${section}-section`).classList.add('active');

            // Refresh section data if needed
            if (section === 'history') {
                renderHistory();
            } else if (section === 'dashboard') {
                updateDashboardStats();
                renderCalendar();
            }
        });
    });
}

// Initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        document.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';

        saveSettings({ theme: isDark ? 'dark' : 'light' });

        // Redraw charts if visible
        const exerciseSelect = document.getElementById('chart-exercise-select');
        if (exerciseSelect && exerciseSelect.value) {
            renderCharts(exerciseSelect.value);
        }
    });
}

// Initialize routine section
function initRoutineSection() {
    const container = document.getElementById('routine-container');

    Object.keys(workoutRoutine).forEach(dayKey => {
        const day = workoutRoutine[dayKey];
        const dayCard = createDayCard(day, dayKey);
        container.appendChild(dayCard);
    });
}

// Create day card for routine
function createDayCard(day, dayKey) {
    const card = document.createElement('div');
    card.className = 'day-card';

    let exercisesHTML = '';
    day.exercises.forEach(exercise => {
        exercisesHTML += `
            <div class="exercise-card">
                <img src="images/exercises/${exercise.id}.png" 
                     alt="${exercise.name}" 
                     class="exercise-image"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%2300f3ff%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2214%22 fill=%22white%22 font-weight=%22bold%22%3E${exercise.muscleGroup}%3C/text%3E%3C/svg%3E'">
                <div class="exercise-details">
                    <h4>${exercise.priority ? '★ ' : ''}${exercise.name}</h4>
                    <div class="exercise-info">
                        <span class="info-badge"><strong>Series:</strong> ${exercise.sets}</span>
                        <span class="info-badge"><strong>Reps:</strong> ${exercise.reps}</span>
                        <span class="info-badge"><strong>RIR:</strong> ${exercise.rir}</span>
                        <span class="info-badge"><strong>Grupo:</strong> ${exercise.muscleGroup}</span>
                    </div>
                </div>
            </div>
        `;
    });

    card.innerHTML = `
        <div class="day-header">
            <div>
                <div class="day-title">${day.name}: ${day.subtitle}</div>
                <div class="day-subtitle">${day.description}</div>
            </div>
            <span class="toggle-icon">▼</span>
        </div>
        <div class="day-exercises">
            ${exercisesHTML}
        </div>
    `;

    // Add toggle functionality
    const header = card.querySelector('.day-header');
    header.addEventListener('click', () => {
        card.classList.toggle('collapsed');
    });

    return card;
}

// Initialize logger section
function initLoggerSection() {
    const daySelect = document.getElementById('training-day-select');

    daySelect.addEventListener('change', (e) => {
        initLogger(e.target.value);
    });

    // Initialize with empty state
    initLogger('');
}

// Initialize history section
function initHistorySection() {
    const dayFilter = document.getElementById('history-day-filter');
    const exerciseFilter = document.getElementById('history-exercise-filter');

    // Populate exercise filter
    const allExercises = getAllExercises();
    exerciseFilter.innerHTML = '<option value="all">Todos los ejercicios</option>';
    allExercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = `${exercise.name} (${exercise.dayName})`;
        exerciseFilter.appendChild(option);
    });

    // Add event listeners
    dayFilter.addEventListener('change', renderHistory);
    exerciseFilter.addEventListener('change', renderHistory);

    // Initial render
    renderHistory();
}

// Render history
function renderHistory() {
    const dayFilter = document.getElementById('history-day-filter').value;
    const exerciseFilter = document.getElementById('history-exercise-filter').value;
    const container = document.getElementById('history-container');

    let logs = getWorkoutLogs();

    // Apply filters
    if (dayFilter !== 'all') {
        logs = logs.filter(log => log.day === dayFilter);
    }

    if (exerciseFilter !== 'all') {
        logs = logs.filter(log => log.exerciseId === exerciseFilter);
    }

    if (logs.length === 0) {
        container.innerHTML = '<p class="no-data">No hay registros de entrenamientos</p>';
        return;
    }

    // Group logs by date and exercise
    const grouped = {};
    logs.forEach(log => {
        const key = `${log.date}_${log.exerciseId}`;
        if (!grouped[key]) {
            grouped[key] = {
                date: log.date,
                day: log.day,
                exerciseName: log.exerciseName,
                sets: []
            };
        }
        grouped[key].sets.push(...log.sets);
    });

    // Sort by date (newest first)
    const sortedLogs = Object.values(grouped).sort((a, b) => {
        return parseDate(b.date) - parseDate(a.date);
    });

    // Render
    container.innerHTML = '';
    sortedLogs.forEach(log => {
        const entry = document.createElement('div');
        entry.className = 'history-entry';

        const dayName = workoutRoutine[log.day].name;

        let setsHTML = '';
        log.sets.forEach(set => {
            setsHTML += `
                <div class="history-set">
                    S${set.setNumber}: <strong>${set.weight}kg</strong> × ${set.reps} reps (RIR ${set.rir})
                </div>
            `;
        });

        entry.innerHTML = `
            <div class="history-date">${log.date} - ${dayName}</div>
            <div class="history-exercise-name">${log.exerciseName}</div>
            <div class="history-sets">${setsHTML}</div>
        `;

        container.appendChild(entry);
    });
}

function parseDate(dateStr) {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Initialize profile section
function initProfileSection() {
    const profile = getProfile();

    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-weight').value = profile.weight;
    document.getElementById('profile-height').value = profile.height;
    document.getElementById('profile-goal').value = profile.goal;

    document.getElementById('save-profile').addEventListener('click', () => {
        const profileData = {
            name: document.getElementById('profile-name').textContent,
            weight: document.getElementById('profile-weight').value,
            height: document.getElementById('profile-height').value,
            goal: document.getElementById('profile-goal').value
        };

        saveProfile(profileData);
        alert('Perfil guardado exitosamente!');
    });
}

// Initialize rest timer
function initRestTimer() {
    const modal = document.getElementById('rest-timer-modal');
    const closeBtn = document.getElementById('close-timer');

    // Close button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        resetTimer();
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            resetTimer();
        }
    });

    // Preset buttons
    document.getElementById('timer-60').addEventListener('click', () => setTimerPreset(60));
    document.getElementById('timer-90').addEventListener('click', () => setTimerPreset(90));
    document.getElementById('timer-120').addEventListener('click', () => setTimerPreset(120));
    document.getElementById('timer-180').addEventListener('click', () => setTimerPreset(180));

    // Control buttons
    document.getElementById('timer-start').addEventListener('click', startTimer);
    document.getElementById('timer-pause').addEventListener('click', pauseTimer);
    document.getElementById('timer-reset').addEventListener('click', resetTimer);
}

// Set timer preset
function setTimerPreset(seconds) {
    timerSeconds = seconds;
    updateTimerDisplay();

    // Highlight active preset
    document.querySelectorAll('.timer-preset-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Start timer
function startTimer() {
    if (timerSeconds === 0) {
        alert('Por favor, selecciona un tiempo de descanso');
        return;
    }

    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();

            if (timerSeconds <= 0) {
                pauseTimer();
                playNotificationSound();
                alert('¡Tiempo de descanso terminado!');
            }
        }, 1000);
    }
}

// Pause timer
function pauseTimer() {
    timerRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Reset timer
function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
    document.querySelectorAll('.timer-preset-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    document.getElementById('timer-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timer-seconds').textContent = String(seconds).padStart(2, '0');
}

// Play notification sound (simple beep)
function playNotificationSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}
