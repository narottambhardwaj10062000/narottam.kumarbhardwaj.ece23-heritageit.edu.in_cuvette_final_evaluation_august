// Imports
const express = require("express");
const router = express.Router();
const verifyjwt = require("../middlewares/authMiddleware");
const Feedback = require("../models/feedback.model");

// feedback post API
router.post("/create", verifyjwt, (req, res) => {
  try {
    // getting data from request body
    const { type, message } = req.body;

    // validation
    if (!type || !message) {
      return res.status(400).json({
        message: "please fill in all required fields",
      });
    }

    // adding the feedback in the database
    const feedback = Feedback.create({
      refUserId: req.body.userId,
      feedbackType: type,
      feedbackText: message,
    });

    if (feedback) {
      res.status(200).json({
        message: "feedback sent successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
