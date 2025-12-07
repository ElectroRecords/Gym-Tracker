// calendar.js - Calendar functionality

let currentCalendarDate = new Date();

// Initialize calendar
function initCalendar() {
    renderCalendar();

    document.getElementById('prev-month').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });
}

// Render calendar
function renderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    // Update month display
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;

    // Get training dates
    const trainingDates = getTrainingDates();
    const trainingDatesSet = new Set(trainingDates);

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Adjust for Monday start
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    // Get calendar grid
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    // Add weekday headers
    const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    weekdays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-weekday';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Add days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const dayEl = createDayElement(day, true);
        grid.appendChild(dayEl);
    }

    // Add days of current month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);

        const dateStr = date.toLocaleDateString('es-ES'); // Format: DD/MM/YYYY
        const isTrainingDay = trainingDatesSet.has(dateStr);
        const isToday = date.getTime() === today.getTime();

        const dayEl = createDayElement(day, false, isTrainingDay, isToday);
        grid.appendChild(dayEl);
    }

    // Add days from next month
    const totalCells = adjustedStartDay + daysInMonth;
    const remainingCells = 7 - (totalCells % 7);

    if (remainingCells < 7) {
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = createDayElement(day, true);
            grid.appendChild(dayEl);
        }
    }
}

// Create day element
function createDayElement(day, isOtherMonth = false, isTrainingDay = false, isToday = false) {
    const div = document.createElement('div');
    div.className = 'calendar-day';

    if (isOtherMonth) {
        div.classList.add('other-month');
    }

    if (isTrainingDay) {
        div.classList.add('training-day');
    }

    if (isToday) {
        div.classList.add('today');
    }

    div.textContent = day;

    return div;
}

// Update dashboard stats
function updateDashboardStats() {
    const streak = calculateStreak();
    const logs = getWorkoutLogs();

    // Update streak
    document.getElementById('current-streak').textContent = `${streak.current} días`;
    document.getElementById('best-streak').textContent = `${streak.best} días`;

    // Total workouts (count unique dates)
    const uniqueDates = new Set(logs.map(log => log.date));
    document.getElementById('total-workouts').textContent = uniqueDates.size;

    // This month workouts
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthLogs = logs.filter(log => {
        const logDate = parseDate(log.date);
        return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
    });
    const thisMonthDates = new Set(thisMonthLogs.map(log => log.date));
    document.getElementById('month-workouts').textContent = thisMonthDates.size;
}

// Helper to parse date
function parseDate(dateStr) {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}
