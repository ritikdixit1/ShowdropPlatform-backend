const sequelize = require("../db");
const Customer = require("./customer");
const DiscountCode = require("./discountCode");
const Campaign = require("./campaign");
const CustomerDiscountCode = require("./customerDiscountCode");

Campaign.hasMany(DiscountCode, { foreignKey: "campaign_id" });
DiscountCode.belongsTo(Campaign, { foreignKey: "campaign_id" });

Customer.belongsToMany(DiscountCode, {
  through: CustomerDiscountCode,
  foreignKey: "customer_id",
  otherKey: "discount_code_id",
});

DiscountCode.belongsToMany(Customer, {
  through: CustomerDiscountCode,
  foreignKey: "discount_code_id",
  otherKey: "customer_id",
});

CustomerDiscountCode.belongsTo(Customer, { foreignKey: "customer_id" });
CustomerDiscountCode.belongsTo(DiscountCode, {
  foreignKey: "discount_code_id",
});

const db = {
  sequelize,
  Customer,
  DiscountCode,
  Campaign,
  CustomerDiscountCode,
};

module.exports = db;
