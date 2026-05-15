const express = require('express');
const router = express.Router();
const { generatePlan } = require('../services/planGenerator');

// GET /generate — show the form
router.get('/', (req, res) => {
  res.render('generate');
});

// POST /generate — process form and generate plan
router.post('/', async (req, res) => {
  try {
    const formData = req.body;

    // Normalize equipment and focusAreas to always be arrays
    if (!formData.equipment) formData.equipment = [];
    if (!Array.isArray(formData.equipment)) formData.equipment = [formData.equipment];

    if (!formData.focusAreas) formData.focusAreas = [];
    if (!Array.isArray(formData.focusAreas)) formData.focusAreas = [formData.focusAreas];

    if (!formData.planName || formData.planName.trim() === '') {
      formData.planName = `${formData.goal} Plan`;
    }

    const plan = await generatePlan(formData);
    res.render('results', { plan });
  } catch (err) {
    console.error('Plan generation error:', err);
    res.render('error', { message: 'Failed to generate plan. Please try again.' });
  }
});

module.exports = router;
