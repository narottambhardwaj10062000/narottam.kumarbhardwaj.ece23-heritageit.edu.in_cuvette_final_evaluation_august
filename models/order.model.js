const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  } 

});

module.exports = mongoose.model("Order", orderSchema);
