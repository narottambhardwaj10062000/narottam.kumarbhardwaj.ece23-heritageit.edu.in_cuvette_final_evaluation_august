const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product.js");
const feedbackRoutes = require("./routes/feedback.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// const PORT = 7000;

//Creating A Express Server
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// health API
app.get("/health", (req, res) => {
  res.json({
    success: "true",
    service: "musicart backend server",
    status: "server is successfully running",
    date: new Date
  });
});

//Middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);

// listen to port and connecting to DB
app.listen(process.env.PORT, (error) => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(
      console.log(`server is running on http://localhost:${process.env.PORT}`)
    )
    .catch((err) => console.log(err));
});
