const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongoose = require('mongoose');

// Schemat użytkownika
const userSchema = new mongoose.Schema({
  email: String,
  password: String, // Hasło w postaci haszowanej
});

// Model użytkownika
const User = mongoose.model('User', userSchema);

// Trasa logowania
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }
    
    // Porównaj hasło z hashem w bazie danych
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }
    
    res.status(200).json({ message: 'Zalogowano pomyślnie', user: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Błąd logowania' });
  }
});

// Dodanie użytkownika (na potrzeby testów)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Błąd rejestracji użytkownika' });
  }
});

module.exports = router;
