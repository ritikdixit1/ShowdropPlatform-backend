const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const CustomerDiscountCode = sequelize.define(
  "CustomerDiscountCode",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customer",
        key: "id",
      },
    },
    discount_code_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "discount_code",
        key: "id",
      },
    },
  },
  {
    tableName: "customer_discount_code",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CustomerDiscountCode;
