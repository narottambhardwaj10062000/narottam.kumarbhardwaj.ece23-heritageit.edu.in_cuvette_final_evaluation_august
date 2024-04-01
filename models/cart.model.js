const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  refproductId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
