require("dotenv").config();
const { Sequelize } = require("sequelize");

// // Initialize Sequelize with database credentials
// const sequelize = new Sequelize({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   dialect: "postgres",
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   logging: false,
// });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
