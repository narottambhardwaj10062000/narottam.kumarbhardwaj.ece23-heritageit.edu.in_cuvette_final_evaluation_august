const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const verifyjwt = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

// place order api
router.post("/place", verifyjwt, async (req, res) => {
  try {
    const { address, paymentMode } = req.body;
    const productId = req.query.productId;

    if(!address || !paymentMode) {
      return res.status(400).json({
        message: "please provide all required information",
      });
    }

    if (!productId) {
      const user = await User.findOne({ _id: req.body.userId });
      const cart = await Cart.find({ owner: req.body.userId });

      if (cart) {
        var val = cart
          .map((item) => item.total)
          .reduce((total, acc) => acc + total, 0);
      }
      else if(!cart) {
        return res.status(404).json({
          message: "cart not found",
        })
      }

      // console.log(cart);
      const order = await Order.create({
        owner: req.body.userId,
        name: user.name,
        address,
        paymentMode,
        products: cart,
        orderTotal: val + 45,
      });

      if (order) {
        await Cart.deleteMany({ owner: req.body.userId });

        res.status(200).json({ message: "order placed", totalQuantity: 0 });
      }
    } else {
      const user = await User.findOne({ _id: req.body.userId });
      const product = await Product.findOne({ _id: productId });
      // console.log(product.price);

      if (product) {
        const order = await Order.create({
          owner: req.body.userId,
          name: user.name,
          address,
          paymentMode,
          products: product,
          orderTotal: product.price + 45,
        });
        // console.log(order);

        if (order) {
          res.status(200).json({ message: "order placed" });
        }
      }
    }
    // learn to take only selected fields
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all orders API
router.get("/all", verifyjwt, async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.body.userId });

    if (orders) {
      res.status(200).json({
        data: orders,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get single Order detail API
router.get("/:orderId", verifyjwt, async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const response = await Order.findOne({ _id: orderId });
  
      if (response) {
        res.status(200).json({
          data: response,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;
