require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const campaignRoutes = require("./routes/campaignRoutes");
const redeemCodeRoutes = require("./routes/redeemCodeRoutes");
const generateCodeRoutes = require("./routes/generateCodeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(cors());

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running smoothly" });
});

app.use("/api", campaignRoutes);
app.use("/api", redeemCodeRoutes);
app.use("/api", generateCodeRoutes);

app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
