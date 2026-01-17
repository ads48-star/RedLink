const express = require("express");
const BloodBank = require("../models/BloodBank");

const router = express.Router();

// Get nearby blood banks (basic)
router.get("/", async (req, res) => {
  const bloodBanks = await BloodBank.find();
  res.json(bloodBanks);
});

// Update blood inventory
router.put("/:id", async (req, res) => {
  const updated = await BloodBank.findByIdAndUpdate(
    req.params.id,
    { inventory: req.body.inventory },
    { new: true }
  );
  res.json(updated);
});

module.exports = router;

