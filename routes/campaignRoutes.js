const express = require("express");
const router = express.Router();
const Campaign = require("../models/campaign");

router.post("/campaigns", async (req, res) => {
  try {
    // Validate request body
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Create a new campaign
    const newCampaign = await Campaign.create({
      name,
      description,
    });

    // Return the created campaign
    res.status(201).json(newCampaign);
  } catch (error) {
    next(error);
  }
});

router.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await Campaign.findAll();

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

module.exports = router;
