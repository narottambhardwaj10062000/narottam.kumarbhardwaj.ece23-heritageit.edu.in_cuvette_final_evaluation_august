const mongoose = require("mongoose");
const User = require("./user.model");

const feedbackSchema = mongoose.Schema({
    refUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    feedbackType: {
        type: String,
        required: true,
    },
    feedbackText: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Feedback", feedbackSchema);