const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: configuredOrigins.length
      ? configuredOrigins
      : true,
    credentials: true
  })
);

app.use(express.json());


// HOME
app.get("/", (req, res) => {
  res.json({
    message: "Checkout API is running"
  });
});


// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/checkout", checkoutRoutes);


// ERROR HANDLER
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found."
  });
});


// DATABASE
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });