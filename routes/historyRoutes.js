const express = require('express');
const router = express.Router();
const WorkoutLog = require('../models/WorkoutLog');

// GET /history
router.get('/', async (req, res) => {
  try {
    const logs = await WorkoutLog.find().sort({ dateCompleted: -1 });

    // Progression stats
    const total = logs.length;
    const avgDifficulty =
      total > 0 ? (logs.reduce((sum, l) => sum + (l.difficulty || 0), 0) / total).toFixed(1) : 0;
    const recent = logs[0] || null;

    // Workouts this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = logs.filter((l) => new Date(l.dateCompleted) >= weekAgo).length;

    res.render('history', { logs, total, avgDifficulty, recent, thisWeek });
  } catch (err) {
    res.render('error', { message: 'Could not retrieve history.' });
  }
});

// POST /history/add
router.post('/add', async (req, res) => {
  try {
    const { planName, workoutDay, dateCompleted, difficulty, notes } = req.body;
    const log = new WorkoutLog({
      planName,
      workoutDay,
      dateCompleted: dateCompleted || Date.now(),
      difficulty: parseInt(difficulty),
      notes,
    });
    await log.save();
    res.redirect('/history');
  } catch (err) {
    console.error('Log save error:', err);
    res.render('error', { message: 'Could not log workout.' });
  }
});

// POST /history/:id/delete
router.post('/:id/delete', async (req, res) => {
  try {
    await WorkoutLog.findByIdAndDelete(req.params.id);
    res.redirect('/history');
  } catch (err) {
    res.render('error', { message: 'Could not delete log.' });
  }
});

module.exports = router;
