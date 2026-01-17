const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bloodGroup: String,
  role: { type: String, enum: ["donor", "hospital", "admin"], default: "donor" },
  location: {
    lat: Number,
    lng: Number
  },
  lastDonation: Date
});

module.exports = mongoose.model("User", UserSchema);

