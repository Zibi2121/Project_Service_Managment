// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require("helmet");

// Importy routerów
const visitRoutes = require('./visitRoutes');
const repairPlanRoutes = require('./repairPlanRoutes');
const authRoutes = require('./authRoutes');

// Połącz się z MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/Eng', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Połączono z MongoDB bazą Eng');
  })
  .catch((err) => {
    console.error('Błąd połączenia z MongoDB:', err);
  });
mongoose.set('debug', true);

const app = express();
app.use(cors());
app.use(express.json());

// Podpinamy router "Visit" pod /api/visits
app.use('/api/visits', visitRoutes);

// Podpinamy router "RepairPlan" pod /api/repair
app.use('/api/repair', repairPlanRoutes);

app.use('/api/auth', authRoutes);

// Przykładowa trasa logowania
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Póki co udajemy, że zawsze OK
  if (username && password) {
    return res.status(200).json({ message: 'Zalogowano pomyślnie!' });
  } else {
    return res.status(400).json({ message: 'Błędne dane!' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer is running on port ${PORT}`);
});
app.use(helmet());
