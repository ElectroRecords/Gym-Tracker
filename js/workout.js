// workout.js - Workout routine data

const workoutRoutine = {
    martes: {
        name: "Martes",
        subtitle: "Tensión Mecánica (Cuádriceps + Empuje)",
        description: "Sesión larga y pesada. Sin cambios.",
        exercises: [
            {
                id: "sentadilla",
                name: "Sentadilla (Trasera o Frontal)",
                sets: "3-4",
                reps: "5-8",
                rir: "2",
                muscleGroup: "Cuádriceps"
            },
            {
                id: "press_banca_plano",
                name: "Press de Banca Plano",
                sets: "3-4",
                reps: "6-8",
                rir: "1-2",
                muscleGroup: "Pecho"
            },
            {
                id: "remo_pecho_apoyado",
                name: "Remo con Pecho Apoyado",
                sets: "3-4",
                reps: "8-10",
                rir: "1",
                muscleGroup: "Espalda",
                priority: true
            },
            {
                id: "elevaciones_laterales",
                name: "Elevaciones Laterales Estrictas",
                sets: "3",
                reps: "10",
                rir: "1",
                muscleGroup: "Hombros"
            },
            {
                id: "extension_cuadriceps",
                name: "Extensión de Cuádriceps",
                sets: "2-3",
                reps: "12",
                rir: "1",
                muscleGroup: "Cuádriceps"
            },
            {
                id: "elevacion_talones_pie",
                name: "Elevación de Talones de pie (Gemelo)",
                sets: "3",
                reps: "12-15",
                rir: "0-1",
                muscleGroup: "Gemelos",
                priority: true
            }
        ]
    },
    miercoles: {
        name: "Miércoles",
        subtitle: "Tensión Mecánica (Isquios + Tracción + Salud Hombro)",
        description: "Sesión larga. Aprovechamos tu tiempo extra para meter el trabajo de salud articular al final.",
        exercises: [
            {
                id: "peso_muerto_rumano",
                name: "Peso Muerto Rumano",
                sets: "3",
                reps: "8-10",
                rir: "1",
                muscleGroup: "Isquios"
            },
            {
                id: "press_militar",
                name: "Press Militar (Barra o Mancuernas)",
                sets: "3-4",
                reps: "6-8",
                rir: "1-2",
                muscleGroup: "Hombros"
            },
            {
                id: "dominadas_lastradas",
                name: "Dominadas Lastradas (o Jalón Pesado)",
                sets: "3-4",
                reps: "6-8",
                rir: "1-2",
                muscleGroup: "Espalda"
            },
            {
                id: "curl_biceps_barra",
                name: "Curl de Bíceps con Barra",
                sets: "3",
                reps: "8-10",
                rir: "1",
                muscleGroup: "Bíceps"
            },
            {
                id: "fondos_paralelas",
                name: "Fondos en Paralelas (o Tríceps Polea)",
                sets: "3",
                reps: "8-10",
                rir: "1",
                muscleGroup: "Tríceps"
            },
            {
                id: "face_pulls",
                name: "Face Pulls (Polea Alta)",
                sets: "3",
                reps: "15-20",
                rir: "Lejos del fallo",
                muscleGroup: "Hombros",
                priority: true
            }
        ]
    },
    viernes: {
        name: "Viernes",
        subtitle: "Estrés Metabólico EXPRESS (Mix Híbrido)",
        description: "Sesión RÁPIDA. Hemos quitado la 'grasa'. Descansos cortos (60-90s), intensidad alta, entra y sal.",
        exercises: [
            {
                id: "prensa_pierna",
                name: "Prensa de Pierna",
                sets: "3-4",
                reps: "10-12",
                rir: "Cerca del fallo",
                muscleGroup: "Cuádriceps"
            },
            {
                id: "press_inclinado",
                name: "Press Inclinado (Mancuernas)",
                sets: "3",
                reps: "12-15",
                rir: "Última al fallo",
                muscleGroup: "Pecho"
            },
            {
                id: "remo_polea_baja",
                name: "Remo en Polea Baja (o Mancuerna)",
                sets: "3",
                reps: "12-15",
                rir: "Cerca del fallo",
                muscleGroup: "Espalda"
            },
            {
                id: "zancadas",
                name: "Zancadas (Búlgaras o Walking)",
                sets: "2-3",
                reps: "12",
                rir: "Cerca del fallo",
                muscleGroup: "Piernas"
            },
            {
                id: "superserie_brazos",
                name: "Súperserie Brazos: Curl Martillo + Ext. Tríceps",
                sets: "3",
                reps: "15",
                rir: "Al fallo",
                muscleGroup: "Brazos"
            }
        ]
    },
    sabado: {
        name: "Sábado",
        subtitle: "Estrés Metabólico (Glúteo + Detalles + Gemelo)",
        description: "Sesión más larga. Con tiempo para darle duro al glúteo y los accesorios.",
        exercises: [
            {
                id: "hip_thrust",
                name: "Hip Thrust",
                sets: "3-4",
                reps: "12-15",
                rir: "Última al fallo",
                muscleGroup: "Glúteos"
            },
            {
                id: "jalon_amplio",
                name: "Jalón Amplio (o Dominadas Asistidas)",
                sets: "3",
                reps: "12-15",
                rir: "Última al fallo",
                muscleGroup: "Espalda"
            },
            {
                id: "aperturas",
                name: "Aperturas (Pec Deck o Máquina)",
                sets: "3",
                reps: "15-20",
                rir: "Al fallo",
                muscleGroup: "Pecho"
            },
            {
                id: "curl_femoral",
                name: "Curl Femoral (Máquina)",
                sets: "3",
                reps: "15",
                rir: "Al fallo técnico",
                muscleGroup: "Isquios"
            },
            {
                id: "superserie_hombros",
                name: "Súperserie Hombros: Laterales + Frontales",
                sets: "3",
                reps: "15-20",
                rir: "Al fallo",
                muscleGroup: "Hombros"
            },
            {
                id: "elevacion_talones_sentado",
                name: "Elevación de Talones Sentado (Gemelo)",
                sets: "3",
                reps: "15-20",
                rir: "Ardor máximo",
                muscleGroup: "Gemelos",
                priority: true
            }
        ]
    }
};

// Get all exercises as a flat array
function getAllExercises() {
    const exercises = [];
    Object.keys(workoutRoutine).forEach(day => {
        workoutRoutine[day].exercises.forEach(exercise => {
            exercises.push({
                ...exercise,
                day: day,
                dayName: workoutRoutine[day].name
            });
        });
    });
    return exercises;
}

// Get exercise by ID
function getExerciseById(exerciseId) {
    const allExercises = getAllExercises();
    return allExercises.find(ex => ex.id === exerciseId);
}
