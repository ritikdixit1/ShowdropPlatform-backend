const express = require("express");
const router = express.Router();
const DiscountCode = require("../models/discountCode");
const { v4: uuidv4 } = require("uuid");

router.post("/campaign/add-codes", async (req, res) => {
  try {
    const { campaign_id, count } = req.body;

    // Validate request body
    if (!campaign_id || !count || count <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid campaignId or count value" });
    }

    const existingCodes = await DiscountCode.findAll({
      where: { campaign_id },
      attributes: ["code"],
    });

    const existingCodeSet = new Set(existingCodes.map((dc) => dc.code));

    // Generate unique discount codes
    const newCodes = [];
    while (newCodes.length < count) {
      const code = uuidv4().slice(0, 8);
      if (!existingCodeSet.has(code)) {
        newCodes.push(code);
        existingCodeSet.add(code); // Add to the set to avoid duplicates in this batch
      }
    }

    // Insert unique codes into the database
    const discountCodes = newCodes.map((code) => ({
      code,
      campaign_id,
    }));

    await DiscountCode.bulkCreate(discountCodes);

    // Return success response
    res
      .status(201)
      .json({ message: "Discount codes created", codes: newCodes });
  } catch (error) {
    console.error("Error generating discount codes:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
