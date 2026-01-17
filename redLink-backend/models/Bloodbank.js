const mongoose = require("mongoose");

const BloodBankSchema = new mongoose.Schema({
  name: String,
  location: {
    lat: Number,
    lng: Number
  },
  inventory: {
    "A+": Number,
    "A-": Number,
    "B+": Number,
    "B-": Number,
    "O+": Number,
    "O-": Number,
    "AB+": Number,
    "AB-": Number
  }
});

module.exports = mongoose.model("BloodBank", BloodBankSchema);

