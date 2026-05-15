const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');

// GET /plans — all saved plans
router.get('/', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find().sort({ createdAt: -1 });
    res.render('savedPlans', { plans });
  } catch (err) {
    res.render('error', { message: 'Could not retrieve plans.' });
  }
});

// GET /plans/:id — view one plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.render('error', { message: 'Plan not found.' });
    res.render('planDetails', { plan });
  } catch (err) {
    res.render('error', { message: 'Could not retrieve plan.' });
  }
});

// POST /plans/save — save a generated plan
router.post('/save', async (req, res) => {
  try {
    const planData = JSON.parse(req.body.planData);
    const newPlan = new WorkoutPlan(planData);
    await newPlan.save();
    res.redirect('/plans');
  } catch (err) {
    console.error('Save error:', err);
    res.render('error', { message: 'Could not save plan.' });
  }
});

// POST /plans/:id/delete — delete a plan
router.post('/:id/delete', async (req, res) => {
  try {
    await WorkoutPlan.findByIdAndDelete(req.params.id);
    res.redirect('/plans');
  } catch (err) {
    res.render('error', { message: 'Could not delete plan.' });
  }
});

module.exports = router;
