// visitRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Schemat Mongoose dla "Visit"
const visitSchema = new mongoose.Schema({
  startDate: String,
  startTime: String,
  endDate: String,
  endTime: String,
  category: String,
  purpose: String,
  bhp: String,
  cost: String,
  responsiblePerson: String,
  visitingPerson: String,
  visitingEmail: String,
});

// Model "Visit"
const Visit = mongoose.model("Visit", visitSchema);

// ================== ENDPOINTY CRUD ==================

// (A) Pobierz wszystkie (GET /api/visits)
router.get("/", async (req, res) => {
  try {
    const visits = await Visit.find();
    res.json(visits);
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania wizyt" });
  }
});

// (B) Dodaj nową wizytę (POST /api/visits)
router.post("/", async (req, res) => {
  try {
    const newVisit = new Visit(req.body);
    const saved = await newVisit.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: "Błąd dodawania wizyty" });
  }
});

// (C) Edycja wizyty (PUT /api/visits/:id)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Visit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Błąd edycji wizyty" });
  }
});

// (D) Usuwanie wizyty (DELETE /api/visits/:id)
router.delete("/:id", async (req, res) => {
  try {
    await Visit.findByIdAndDelete(req.params.id);
    res.json({ message: "Wizyta usunięta" });
  } catch (error) {
    res.status(400).json({ error: "Błąd usuwania wizyty" });
  }
});

module.exports = router;
