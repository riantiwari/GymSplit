const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  workoutDay: String,
  dateCompleted: { type: Date, default: Date.now },
  difficulty: { type: Number, min: 1, max: 5 },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
