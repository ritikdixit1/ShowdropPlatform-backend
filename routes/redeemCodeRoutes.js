const express = require("express");
const router = express.Router();
const Campaign = require("../models/campaign");
const DiscountCode = require("../models/discountCode");
const Customer = require("../models/customer");
const CustomerDiscountCode = require("../models/customerDiscountCode");

router.post("/redeem", async (req, res) => {
  // console.log("Customer Associations:", Customer.associations);
  // console.log("DiscountCode Associations:", DiscountCode.associations);
  // console.log(
  //   "CustomerDiscountCode Associations:",
  //   CustomerDiscountCode.associations
  // );

  try {
    const { email, campaign_id } = req.body;

    if (!email || !campaign_id) {
      return res
        .status(400)
        .json({ error: "Email and campaign_id are required" });
    }

    const campaign = await Campaign.findByPk(campaign_id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const customer = await Customer.findOne({ where: { email } });
    if (customer) {
      const existingCode = await CustomerDiscountCode.findOne({
        where: {
          customer_id: customer.id,
        },
        include: {
          model: DiscountCode,
          where: { campaign_id: campaign_id },
        },
      });

      if (existingCode) {
        return res
          .status(400)
          .json({ error: "You already have a code for this campaign" });
      }
    }

    const availableCode = await DiscountCode.findOne({
      where: { campaign_id: campaign_id, is_used: false },
    });

    if (!availableCode) {
      return res.status(404).json({ error: "No codes left for this campaign" });
    }

    let customerRecord = customer;
    if (!customerRecord) {
      customerRecord = await Customer.create({ email });
    }

    await CustomerDiscountCode.create({
      customer_id: customerRecord.id,
      discount_code_id: availableCode.id,
    });

    await availableCode.update({ is_used: true });

    res.status(200).json({ code: availableCode.code });
  } catch (error) {
    console.error("Error redeeming code:", error);
    res.status(500).json({ error: "Failed to redeem code" });
  }
});

module.exports = router;
