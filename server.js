require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRoutes = require('./routes/indexRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const planRoutes = require('./routes/planRoutes');
const historyRoutes = require('./routes/historyRoutes');

app.use('/', indexRoutes);
app.use('/generate', workoutRoutes);
app.use('/plans', planRoutes);
app.use('/history', historyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong.' });
});

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
