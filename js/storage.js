// storage.js - LocalStorage management

const STORAGE_KEYS = {
    WORKOUTS: 'gym_tracker_workouts',
    PROFILE: 'gym_tracker_profile',
    SETTINGS: 'gym_tracker_settings'
};

// Save workout log
function saveWorkoutLog(workoutData) {
    const logs = getWorkoutLogs();
    logs.push({
        ...workoutData,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('es-ES')
    });
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(logs));
}

// Get all workout logs
function getWorkoutLogs() {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
}

// Get logs filtered by day
function getLogsByDay(day) {
    const logs = getWorkoutLogs();
    return day === 'all' ? logs : logs.filter(log => log.day === day);
}

// Get logs filtered by exercise
function getLogsByExercise(exerciseId) {
    const logs = getWorkoutLogs();
    return logs.filter(log => log.exerciseId === exerciseId);
}

// Get logs for a specific date
function getLogsByDate(date) {
    const logs = getWorkoutLogs();
    return logs.filter(log => log.date === date);
}

// Get unique training dates
function getTrainingDates() {
    const logs = getWorkoutLogs();
    const dates = logs.map(log => log.date);
    return [...new Set(dates)].sort();
}

// Get personal records for an exercise
function getPersonalRecords(exerciseId) {
    const logs = getLogsByExercise(exerciseId);
    if (logs.length === 0) return null;

    let maxWeight = 0;
    let maxReps = 0;
    let maxVolume = 0;

    logs.forEach(log => {
        log.sets.forEach(set => {
            const weight = parseFloat(set.weight) || 0;
            const reps = parseInt(set.reps) || 0;
            const volume = weight * reps;

            if (weight > maxWeight) maxWeight = weight;
            if (reps > maxReps) maxReps = reps;
            if (volume > maxVolume) maxVolume = volume;
        });
    });

    return { maxWeight, maxReps, maxVolume };
}

// Calculate streak
function calculateStreak() {
    const dates = getTrainingDates();
    if (dates.length === 0) return { current: 0, best: 0 };

    dates.sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if most recent workout was today or yesterday
    const mostRecent = parseDate(dates[0]);
    const daysDiff = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) {
        currentStreak = 1;

        for (let i = 0; i < dates.length - 1; i++) {
            const date1 = parseDate(dates[i]);
            const date2 = parseDate(dates[i + 1]);
            const diff = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));

            if (diff <= 3) {
                currentStreak++;
                tempStreak++;
            } else {
                if (tempStreak > bestStreak) bestStreak = tempStreak;
                tempStreak = 1;
            }
        }
    }

    if (tempStreak > bestStreak) bestStreak = tempStreak;
    if (currentStreak > bestStreak) bestStreak = currentStreak;

    return { current: currentStreak, best: bestStreak };
}

// Helper function to parse Spanish date format
function parseDate(dateStr) {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Save profile
function saveProfile(profileData) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profileData));
}

// Get profile
function getProfile() {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : {
        name: 'Sebastian Andrade',
        weight: '',
        height: '',
        goal: 'strength'
    };
}

// Save settings
function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Get settings
function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
        theme: 'light'
    };
}

// Clear all data (for testing)
function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}
