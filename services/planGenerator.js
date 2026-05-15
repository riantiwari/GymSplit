const { getExercisesForDay } = require('./exerciseService');

// Split templates based on days per week
const SPLITS = {
  2: [
    { dayName: 'Day 1: Full Body A', muscles: ['Chest', 'Back', 'Legs'] },
    { dayName: 'Day 2: Full Body B', muscles: ['Shoulders', 'Arms', 'Core'] },
  ],
  3: [
    { dayName: 'Day 1: Push', muscles: ['Chest', 'Shoulders', 'Arms'] },
    { dayName: 'Day 2: Pull', muscles: ['Back', 'Arms'] },
    { dayName: 'Day 3: Legs', muscles: ['Legs', 'Core'] },
  ],
  4: [
    { dayName: 'Day 1: Upper Body', muscles: ['Chest', 'Back', 'Shoulders'] },
    { dayName: 'Day 2: Lower Body', muscles: ['Legs', 'Core'] },
    { dayName: 'Day 3: Push', muscles: ['Chest', 'Shoulders', 'Arms'] },
    { dayName: 'Day 4: Pull', muscles: ['Back', 'Arms'] },
  ],
  5: [
    { dayName: 'Day 1: Push', muscles: ['Chest', 'Shoulders', 'Arms'] },
    { dayName: 'Day 2: Pull', muscles: ['Back', 'Arms'] },
    { dayName: 'Day 3: Legs', muscles: ['Legs'] },
    { dayName: 'Day 4: Upper Body', muscles: ['Chest', 'Back', 'Shoulders'] },
    { dayName: 'Day 5: Core & Cardio', muscles: ['Core', 'Cardio'] },
  ],
  6: [
    { dayName: 'Day 1: Push A', muscles: ['Chest', 'Shoulders', 'Arms'] },
    { dayName: 'Day 2: Pull A', muscles: ['Back', 'Arms'] },
    { dayName: 'Day 3: Legs A', muscles: ['Legs', 'Core'] },
    { dayName: 'Day 4: Push B', muscles: ['Chest', 'Shoulders'] },
    { dayName: 'Day 5: Pull B', muscles: ['Back', 'Arms'] },
    { dayName: 'Day 6: Legs B', muscles: ['Legs', 'Cardio'] },
  ],
};

// Sets/reps/rest based on goal
const GOAL_PARAMS = {
  'Build Muscle': { sets: '3–4', reps: '8–12', rest: '60–90 sec' },
  'Lose Fat': { sets: '3', reps: '12–15', rest: '30–60 sec' },
  'Improve Strength': { sets: '4–5', reps: '3–6', rest: '2–3 min' },
  'General Fitness': { sets: '3', reps: '10–12', rest: '60 sec' },
  'Athletic Performance': { sets: '3–4', reps: '6–10', rest: '60–120 sec' },
};

async function generatePlan(formData) {
  const { goal, experienceLevel, daysPerWeek, timePerWorkout, equipment, focusAreas, planName } = formData;

  const days = parseInt(daysPerWeek);
  const splitTemplate = SPLITS[days] || SPLITS[3];
  const params = GOAL_PARAMS[goal] || GOAL_PARAMS['General Fitness'];

  // Determine which muscles to use — combine split day muscles with user focus areas
  const workoutDays = [];

  for (const dayTemplate of splitTemplate) {
    // Intersect day muscles with user-selected focus areas where possible
    let dayMuscles = dayTemplate.muscles;
    if (focusAreas && focusAreas.length > 0) {
      const focused = dayTemplate.muscles.filter((m) => focusAreas.includes(m));
      if (focused.length > 0) dayMuscles = focused;
    }

    const rawExercises = await getExercisesForDay(dayMuscles, equipment);

    const exercises = rawExercises.map((ex) => ({
      name: ex.name,
      muscle: ex.muscle,
      equipment: ex.equipment,
      sets: params.sets,
      reps: params.reps,
      rest: params.rest,
      instructions: ex.instructions || '',
    }));

    workoutDays.push({
      dayName: dayTemplate.dayName,
      exercises,
    });
  }

  return {
    planName,
    goal,
    experienceLevel,
    daysPerWeek: days,
    timePerWorkout,
    equipment: Array.isArray(equipment) ? equipment : [equipment],
    focusAreas: Array.isArray(focusAreas) ? focusAreas : focusAreas ? [focusAreas] : [],
    workoutDays,
  };
}

module.exports = { generatePlan };
