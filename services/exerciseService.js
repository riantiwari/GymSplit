const fetch = require('node-fetch');

// Fallback exercises organized by muscle group and equipment
const FALLBACK_EXERCISES = {
  chest: {
    dumbbells: [
      { name: 'Dumbbell Bench Press', muscle: 'chest', equipment: 'dumbbells', instructions: 'Lie on a flat bench, press dumbbells from chest to full extension.' },
      { name: 'Dumbbell Flyes', muscle: 'chest', equipment: 'dumbbells', instructions: 'Lie on bench, lower dumbbells in arc motion, squeeze chest at top.' },
      { name: 'Incline Dumbbell Press', muscle: 'chest', equipment: 'dumbbells', instructions: 'Set bench to 45°, press dumbbells from upper chest overhead.' },
    ],
    barbell: [
      { name: 'Barbell Bench Press', muscle: 'chest', equipment: 'barbell', instructions: 'Lie on flat bench, lower bar to chest, press to full extension.' },
      { name: 'Incline Barbell Press', muscle: 'chest', equipment: 'barbell', instructions: 'Set bench to 45°, press bar from upper chest overhead.' },
      { name: 'Close-Grip Bench Press', muscle: 'chest', equipment: 'barbell', instructions: 'Grip bar shoulder-width, lower to lower chest, press up.' },
    ],
    bodyweight: [
      { name: 'Push-Up', muscle: 'chest', equipment: 'bodyweight', instructions: 'Keep body straight, lower chest to floor, press back up.' },
      { name: 'Wide Push-Up', muscle: 'chest', equipment: 'bodyweight', instructions: 'Place hands wider than shoulders, lower chest to floor.' },
      { name: 'Diamond Push-Up', muscle: 'chest', equipment: 'bodyweight', instructions: 'Form diamond shape with hands under chest, lower and press.' },
    ],
    default: [
      { name: 'Chest Press Machine', muscle: 'chest', equipment: 'machines', instructions: 'Adjust seat, grip handles at chest level, press forward.' },
      { name: 'Cable Crossover', muscle: 'chest', equipment: 'cables', instructions: 'Set cables high, pull down and across body in arc.' },
      { name: 'Pec Deck Machine', muscle: 'chest', equipment: 'machines', instructions: 'Sit with elbows on pads, bring arms together in front.' },
    ],
  },
  back: {
    dumbbells: [
      { name: 'Dumbbell Row', muscle: 'back', equipment: 'dumbbells', instructions: 'Plant hand on bench, row dumbbell to hip, squeeze back.' },
      { name: 'Bent-Over Dumbbell Row', muscle: 'back', equipment: 'dumbbells', instructions: 'Hinge at hips, row both dumbbells to lower chest.' },
      { name: 'Dumbbell Pullover', muscle: 'back', equipment: 'dumbbells', instructions: 'Lie on bench, lower dumbbell overhead and pull back.' },
    ],
    barbell: [
      { name: 'Barbell Row', muscle: 'back', equipment: 'barbell', instructions: 'Hinge at hips, pull bar to lower chest, squeeze back.' },
      { name: 'Deadlift', muscle: 'back', equipment: 'barbell', instructions: 'Pull bar from floor keeping back straight, drive hips through.' },
      { name: 'T-Bar Row', muscle: 'back', equipment: 'barbell', instructions: 'Straddle bar, grip handle, row to chest.' },
    ],
    bodyweight: [
      { name: 'Pull-Up', muscle: 'back', equipment: 'bodyweight', instructions: 'Hang from bar, pull chin above bar, lower slowly.' },
      { name: 'Chin-Up', muscle: 'back', equipment: 'bodyweight', instructions: 'Underhand grip, pull chin above bar focusing on biceps and back.' },
      { name: 'Inverted Row', muscle: 'back', equipment: 'bodyweight', instructions: 'Lie under a bar, pull chest to bar keeping body straight.' },
    ],
    default: [
      { name: 'Lat Pulldown', muscle: 'back', equipment: 'cables', instructions: 'Pull bar to upper chest, squeeze lats at bottom.' },
      { name: 'Seated Cable Row', muscle: 'back', equipment: 'cables', instructions: 'Pull handle to abdomen, squeeze shoulder blades together.' },
      { name: 'Machine Row', muscle: 'back', equipment: 'machines', instructions: 'Grip handles at chest, pull back squeezing shoulder blades.' },
    ],
  },
  legs: {
    dumbbells: [
      { name: 'Dumbbell Squat', muscle: 'legs', equipment: 'dumbbells', instructions: 'Hold dumbbells at sides, squat until thighs parallel to floor.' },
      { name: 'Dumbbell Lunge', muscle: 'legs', equipment: 'dumbbells', instructions: 'Step forward into lunge, lower back knee toward floor.' },
      { name: 'Romanian Deadlift', muscle: 'legs', equipment: 'dumbbells', instructions: 'Hinge at hips lowering dumbbells along legs, feel hamstring stretch.' },
    ],
    barbell: [
      { name: 'Barbell Squat', muscle: 'legs', equipment: 'barbell', instructions: 'Bar on traps, squat to parallel, drive through heels.' },
      { name: 'Romanian Deadlift', muscle: 'legs', equipment: 'barbell', instructions: 'Push hips back lowering bar along legs, keep back straight.' },
      { name: 'Barbell Lunge', muscle: 'legs', equipment: 'barbell', instructions: 'Bar on traps, step into deep lunge alternating legs.' },
    ],
    bodyweight: [
      { name: 'Bodyweight Squat', muscle: 'legs', equipment: 'bodyweight', instructions: 'Feet shoulder-width, squat until thighs parallel, stand up.' },
      { name: 'Jump Squat', muscle: 'legs', equipment: 'bodyweight', instructions: 'Squat down then explode up into a jump, land softly.' },
      { name: 'Bulgarian Split Squat', muscle: 'legs', equipment: 'bodyweight', instructions: 'Rear foot elevated, lower front knee toward floor.' },
    ],
    default: [
      { name: 'Leg Press', muscle: 'legs', equipment: 'machines', instructions: 'Press platform away until legs nearly straight, lower slowly.' },
      { name: 'Leg Extension', muscle: 'legs', equipment: 'machines', instructions: 'Extend legs to parallel, squeeze quads at top.' },
      { name: 'Leg Curl', muscle: 'legs', equipment: 'machines', instructions: 'Curl legs toward glutes, squeeze hamstrings at top.' },
    ],
  },
  shoulders: {
    dumbbells: [
      { name: 'Dumbbell Shoulder Press', muscle: 'shoulders', equipment: 'dumbbells', instructions: 'Press dumbbells overhead from shoulder level.' },
      { name: 'Lateral Raise', muscle: 'shoulders', equipment: 'dumbbells', instructions: 'Raise arms to sides until parallel to floor, lower slowly.' },
      { name: 'Front Raise', muscle: 'shoulders', equipment: 'dumbbells', instructions: 'Raise one arm to front until parallel to floor.' },
    ],
    barbell: [
      { name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell', instructions: 'Press bar from shoulders to overhead, lock out at top.' },
      { name: 'Upright Row', muscle: 'shoulders', equipment: 'barbell', instructions: 'Pull bar to chin level keeping elbows high.' },
      { name: 'Behind-Neck Press', muscle: 'shoulders', equipment: 'barbell', instructions: 'Press bar from behind neck to overhead (use caution).' },
    ],
    bodyweight: [
      { name: 'Pike Push-Up', muscle: 'shoulders', equipment: 'bodyweight', instructions: 'Hips high in V-shape, lower head toward floor, press up.' },
      { name: 'Handstand Push-Up', muscle: 'shoulders', equipment: 'bodyweight', instructions: 'Kick into handstand against wall, lower head to floor, press.' },
      { name: 'Wall Walk', muscle: 'shoulders', equipment: 'bodyweight', instructions: 'Walk feet up wall to handstand position, walk back down.' },
    ],
    default: [
      { name: 'Machine Shoulder Press', muscle: 'shoulders', equipment: 'machines', instructions: 'Press handles overhead from shoulder height.' },
      { name: 'Cable Lateral Raise', muscle: 'shoulders', equipment: 'cables', instructions: 'Pull cable handle out to side until arm is parallel to floor.' },
      { name: 'Cable Front Raise', muscle: 'shoulders', equipment: 'cables', instructions: 'Pull cable handle to front until arm is parallel to floor.' },
    ],
  },
  arms: {
    dumbbells: [
      { name: 'Dumbbell Curl', muscle: 'arms', equipment: 'dumbbells', instructions: 'Curl dumbbells from hip to shoulder, squeeze biceps.' },
      { name: 'Hammer Curl', muscle: 'arms', equipment: 'dumbbells', instructions: 'Neutral grip curl, thumbs up, curl to shoulder.' },
      { name: 'Dumbbell Tricep Extension', muscle: 'arms', equipment: 'dumbbells', instructions: 'Hold dumbbell overhead, lower behind head, extend.' },
    ],
    barbell: [
      { name: 'Barbell Curl', muscle: 'arms', equipment: 'barbell', instructions: 'Curl bar from hips to shoulders, keep elbows pinned.' },
      { name: 'EZ-Bar Curl', muscle: 'arms', equipment: 'barbell', instructions: 'Curl EZ bar to shoulders with angled grip.' },
      { name: 'Skull Crusher', muscle: 'arms', equipment: 'barbell', instructions: 'Lower bar to forehead, extend arms, keep elbows still.' },
    ],
    bodyweight: [
      { name: 'Tricep Dip', muscle: 'arms', equipment: 'bodyweight', instructions: 'Lower body between bars until elbows at 90°, press up.' },
      { name: 'Close-Grip Push-Up', muscle: 'arms', equipment: 'bodyweight', instructions: 'Hands under chest, lower until elbows at 90°, press up.' },
      { name: 'Chin-Up', muscle: 'arms', equipment: 'bodyweight', instructions: 'Underhand grip pull-up focusing on bicep contraction.' },
    ],
    default: [
      { name: 'Tricep Pushdown', muscle: 'arms', equipment: 'cables', instructions: 'Push cable handle down until arms fully extended.' },
      { name: 'Cable Curl', muscle: 'arms', equipment: 'cables', instructions: 'Curl cable handle from hip to shoulder height.' },
      { name: 'Preacher Curl Machine', muscle: 'arms', equipment: 'machines', instructions: 'Rest arms on pad, curl handles to shoulder height.' },
    ],
  },
  core: {
    bodyweight: [
      { name: 'Plank', muscle: 'core', equipment: 'bodyweight', instructions: 'Hold push-up position on forearms, keep body straight.' },
      { name: 'Crunches', muscle: 'core', equipment: 'bodyweight', instructions: 'Lift shoulders off floor, squeeze abs, lower slowly.' },
      { name: 'Leg Raise', muscle: 'core', equipment: 'bodyweight', instructions: 'Lie flat, raise straight legs to 90°, lower slowly.' },
      { name: 'Russian Twist', muscle: 'core', equipment: 'bodyweight', instructions: 'Sit at 45°, rotate torso side to side.' },
    ],
    default: [
      { name: 'Cable Crunch', muscle: 'core', equipment: 'cables', instructions: 'Kneel, pull cable handle to knees crunching abs.' },
      { name: 'Ab Wheel Rollout', muscle: 'core', equipment: 'bodyweight', instructions: 'Kneel, roll wheel forward keeping core tight, pull back.' },
      { name: 'Hanging Leg Raise', muscle: 'core', equipment: 'bodyweight', instructions: 'Hang from bar, raise straight legs to 90°.' },
    ],
  },
  cardio: {
    bodyweight: [
      { name: 'Burpees', muscle: 'cardio', equipment: 'bodyweight', instructions: 'Squat down, kick feet back, push-up, jump up with arms overhead.' },
      { name: 'Mountain Climbers', muscle: 'cardio', equipment: 'bodyweight', instructions: 'In push-up position, drive knees to chest alternating fast.' },
      { name: 'High Knees', muscle: 'cardio', equipment: 'bodyweight', instructions: 'Run in place driving knees to hip height alternately.' },
      { name: 'Jump Rope (Simulated)', muscle: 'cardio', equipment: 'bodyweight', instructions: 'Mimic jump rope motion jumping on balls of feet.' },
    ],
    default: [
      { name: 'Treadmill Run', muscle: 'cardio', equipment: 'machines', instructions: 'Run at moderate pace maintaining steady breathing.' },
      { name: 'Rowing Machine', muscle: 'cardio', equipment: 'machines', instructions: 'Drive with legs, lean back, pull handle to chest.' },
      { name: 'Stationary Bike', muscle: 'cardio', equipment: 'machines', instructions: 'Pedal at moderate resistance maintaining steady cadence.' },
    ],
  },
};

// Map focus area names to muscle group keys
const FOCUS_TO_MUSCLE = {
  Chest: 'chest',
  Back: 'back',
  Legs: 'legs',
  Shoulders: 'shoulders',
  Arms: 'arms',
  Core: 'core',
  Cardio: 'cardio',
};

// API Ninjas muscle name mapping
const MUSCLE_TO_API = {
  chest: 'chest',
  back: 'lats',
  legs: 'quadriceps',
  shoulders: 'shoulders',
  arms: 'biceps',
  core: 'abdominals',
  cardio: null,
};

const EQUIPMENT_TO_API = {
  Dumbbells: 'dumbbell',
  Barbell: 'barbell',
  Bodyweight: 'body_only',
  Machines: 'machine',
  Cables: 'cable',
  Kettlebells: 'kettlebells',
  'Resistance Bands': 'bands',
};

async function fetchExercisesFromAPI(muscle, equipment) {
  if (!process.env.EXERCISE_API_KEY || muscle === null) return null;
  const apiMuscle = MUSCLE_TO_API[muscle];
  const apiEquip = EQUIPMENT_TO_API[equipment] || 'body_only';
  if (!apiMuscle) return null;

  try {
    const url = `https://api.api-ninjas.com/v1/exercises?muscle=${apiMuscle}&equipment=${apiEquip}&limit=5`;
    const response = await fetch(url, {
      headers: { 'X-Api-Key': process.env.EXERCISE_API_KEY },
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || data.length === 0) return null;
    return data.map((ex) => ({
      name: ex.name,
      muscle: ex.muscle,
      equipment: ex.equipment,
      instructions: ex.instructions || 'Perform with controlled form.',
    }));
  } catch (err) {
    console.error('API fetch error:', err.message);
    return null;
  }
}

function getFallbackExercises(muscleKey, equipmentList) {
  const muscleData = FALLBACK_EXERCISES[muscleKey] || FALLBACK_EXERCISES.chest;

  // Try to match equipment
  for (const equip of equipmentList) {
    const key = equip.toLowerCase();
    if (muscleData[key]) return muscleData[key];
  }

  return muscleData.default || muscleData.bodyweight || [];
}

async function getExercisesForMuscle(muscleKey, equipmentList) {
  const primaryEquip = equipmentList[0] || 'bodyweight';
  const apiResult = await fetchExercisesFromAPI(muscleKey, primaryEquip);

  if (apiResult && apiResult.length >= 2) {
    return apiResult;
  }

  return getFallbackExercises(muscleKey, equipmentList.map((e) => e.toLowerCase()));
}

async function getExercisesForDay(focusAreas, equipmentList) {
  let allExercises = [];

  for (const area of focusAreas) {
    const muscleKey = FOCUS_TO_MUSCLE[area] || area.toLowerCase();
    const exercises = await getExercisesForMuscle(muscleKey, equipmentList);
    // Take up to 3 exercises per focus area
    allExercises = allExercises.concat(exercises.slice(0, 3));
  }

  // If no focus areas matched, return some defaults
  if (allExercises.length === 0) {
    allExercises = getFallbackExercises('chest', equipmentList);
  }

  return allExercises;
}

module.exports = { getExercisesForDay, getExercisesForMuscle, FOCUS_TO_MUSCLE };
