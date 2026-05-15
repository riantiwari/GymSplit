const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  muscle: String,
  equipment: String,
  sets: String,
  reps: String,
  rest: String,
  instructions: String,
});

const workoutDaySchema = new mongoose.Schema({
  dayName: String,
  exercises: [exerciseSchema],
});

const workoutPlanSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  goal: String,
  experienceLevel: String,
  daysPerWeek: Number,
  timePerWorkout: String,
  equipment: [String],
  focusAreas: [String],
  workoutDays: [workoutDaySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
