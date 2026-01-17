const express = require("express");
const User = require("../models/User");
const { getCompatibleDonorTypes } = require("../utils/bloodCompatibility");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { bloodGroup, latitude, longitude } = req.body;

    if (!bloodGroup || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "bloodGroup and location are required"
      });
    }

    // 56-day donation gap
    const eligibleDate = new Date();
    eligibleDate.setDate(eligibleDate.getDate() - 56);

    const compatibleGroups = getCompatibleDonorTypes(bloodGroup);

    const donors = await User.find({
      role: "donor",
      bloodGroup: { $in: compatibleGroups },
      $or: [
        { lastDonation: { $lte: eligibleDate } },
        { lastDonation: { $exists: false } }
      ]
    }).select("name bloodGroup location");

    // Distance calculation
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const matchedDonors = donors
      .map(d => ({
        ...d.toObject(),
        distance: calculateDistance(
          latitude,
          longitude,
          d.location.lat,
          d.location.lng
        )
      }))
      .filter(d => d.distance <= 50); // 50 km radius

    res.json({
      success: true,
      matchingDonors: matchedDonors.length,
      donors: matchedDonors
    });

  } catch (error) {
    console.error("Donor matching error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to match donors"
    });
  }
});

module.exports = router;
