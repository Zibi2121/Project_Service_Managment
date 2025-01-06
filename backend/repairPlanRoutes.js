// repairPlanRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Schemat Mongoose dla "RepairPlan" (lub "Equipment")
const repairPlanSchema = new mongoose.Schema({
  przedmiotNazwa: String,
  kategoria: String,
  firmaZewnetrzna: String,
  dataWydania: String,
  planowanaDataZwrotu: String,
  szacunkowyKoszt: String,
  osobaOdpowiedzialna: String,
  emailFirmyZewnetrznej: String,
});

// Model "RepairPlan"
const RepairPlan = mongoose.model("RepairPlan", repairPlanSchema);

// ============== ENDPOINTY CRUD ==============

// Pobierz wszystkie (GET /api/repair)
router.get("/", async (req, res) => {
  try {
    const items = await RepairPlan.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania RepairPlan" });
  }
});

// Dodaj (POST /api/repair)
router.post("/", async (req, res) => {
  try {
    const newItem = new RepairPlan(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: "Błąd dodawania RepairPlan" });
  }
});

// Edycja (PUT /api/repair/:id)
router.put("/:id", async (req, res) => {
  try {
    const updated = await RepairPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Błąd edycji RepairPlan" });
  }
});

// Usuwanie (DELETE /api/repair/:id)
router.delete("/:id", async (req, res) => {
  try {
    await RepairPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "RepairPlan usunięty" });
  } catch (error) {
    res.status(400).json({ error: "Błąd usuwania RepairPlan" });
  }
});

module.exports = router;
