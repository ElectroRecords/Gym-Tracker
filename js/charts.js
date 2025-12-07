// charts.js - Chart rendering using Canvas API

let weightChart = null;
let repsChart = null;

// Initialize charts
function initCharts() {
    const exerciseSelect = document.getElementById('chart-exercise-select');

    // Populate exercise select
    const allExercises = getAllExercises();
    exerciseSelect.innerHTML = '<option value="">-- Selecciona un ejercicio --</option>';
    allExercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = `${exercise.name} (${exercise.dayName})`;
        exerciseSelect.appendChild(option);
    });

    // Add event listener
    exerciseSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            renderCharts(e.target.value);
        } else {
            clearCharts();
        }
    });
}

// Render charts for a specific exercise
function renderCharts(exerciseId) {
    const logs = getLogsByExercise(exerciseId);

    if (logs.length === 0) {
        clearCharts();
        return;
    }

    // Prepare data
    const weightData = [];
    const repsData = [];
    const labels = [];

    logs.forEach((log, index) => {
        const date = log.date;
        log.sets.forEach(set => {
            labels.push(`${date} S${set.setNumber}`);
            weightData.push(parseFloat(set.weight) || 0);
            repsData.push(parseInt(set.reps) || 0);
        });
    });

    // Render weight chart
    renderLineChart('weight-chart', labels, weightData, 'Peso (kg)', '#00f3ff');

    // Render reps chart
    renderLineChart('reps-chart', labels, repsData, 'Repeticiones', '#ff6b35');
}

// Clear charts
function clearCharts() {
    const weightCanvas = document.getElementById('weight-chart');
    const repsCanvas = document.getElementById('reps-chart');

    const weightCtx = weightCanvas.getContext('2d');
    const repsCtx = repsCanvas.getContext('2d');

    weightCtx.clearRect(0, 0, weightCanvas.width, weightCanvas.height);
    repsCtx.clearRect(0, 0, repsCanvas.width, repsCanvas.height);

    // Draw placeholder text
    drawPlaceholder(weightCtx, weightCanvas, 'Selecciona un ejercicio');
    drawPlaceholder(repsCtx, repsCanvas, 'Selecciona un ejercicio');
}

// Draw placeholder text
function drawPlaceholder(ctx, canvas, text) {
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary');
    ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

// Render line chart
function renderLineChart(canvasId, labels, data, yLabel, color) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    const padding = 50;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find min and max values
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const valueRange = maxValue - minValue || 1; // Avoid division by zero

    // Draw grid
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color');
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();

        // Y-axis labels
        const value = maxValue - (valueRange / 5) * i;
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary');
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(value.toFixed(1), padding - 10, y);
    }

    // Draw line
    if (data.length > 0) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1 || 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        ctx.fillStyle = color;
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1 || 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();

            // Draw value on hover point (show all for now)
            if (data.length <= 10) { // Only show values if not too many points
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
                ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(value.toFixed(1), x, y - 10);
                ctx.fillStyle = color;
            }
        });
    }

    // Draw axes
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
    ctx.lineWidth = 2;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';

    // Y-axis label
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // X-axis label
    ctx.textAlign = 'center';
    ctx.fillText('Sesiones', canvas.width / 2, canvas.height - 10);
}

// Redraw charts on window resize
window.addEventListener('resize', () => {
    const exerciseSelect = document.getElementById('chart-exercise-select');
    if (exerciseSelect && exerciseSelect.value) {
        renderCharts(exerciseSelect.value);
    }
});
