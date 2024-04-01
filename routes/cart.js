const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const verifyjwt = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

//Add to cart API
router.post("/add", verifyjwt, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId) || !productId) {
      return res.status(400).json({
        message: "Invalid URL",
      });
    }

    const cartDetail = await Cart.findOne({
      refproductId: productId,
      owner: req.body.userId,
    });

    if (cartDetail !== null) {
      if (cartDetail.quantity >= 8) {
        const response = await Cart.find({ owner: req.body.userId });
        const totalQuantity = response
          .map((item) => item.quantity)
          .reduce((total, amount) => total + amount);

        return res.status(400).json({
          message: "product quantity limit exceeded",
          totalQuantity,
        });
      }

      const newQuantity = cartDetail.quantity + 1;

      await Cart.updateOne(
        { _id: cartDetail._id },
        {
          $set: {
            quantity: newQuantity,
            total: newQuantity * cartDetail.price,
          },
        }
      );

      const response = await Cart.find({ owner: req.body.userId });
      const totalQuantity = response
        .map((item) => item.quantity)
        .reduce((total, amount) => total + amount, 0);

      return res.status(200).json({
        message: "quantity updated",
        totalQuantity: totalQuantity,
      });
    }

    // taking out required data from Product
    const product = await Product.findOne({ _id: productId });

    if (product) {
      const cart = await Cart.create({
        refproductId: productId,
        brand: product?.brand,
        model: product?.model,
        image: product?.images?.[0],
        price: product?.price,
        available: product?.available,
        color: product?.color,
        quantity: 1,
        total: product?.price,
        owner: req.body.userId,
      });
    }

    const response = await Cart.find({ owner: req.body.userId });
    const totalQuantity = response
      .map((item) => item.quantity)
      .reduce((total, amount) => total + amount, 0);

    return res.status(200).json({
      message: "successfully added to cart",
      totalQuantity: totalQuantity,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// changing product quantity in cart
router.put("/updateQuantity", verifyjwt, async (req, res) => {
  try {
    const { cartId, newQuantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cartId) || !cartId) {
      return res.status(400).json({
        message: "Invalid cart",
      });
    }

    const cart = await Cart.findOne({
      owner: req.body.userId,
      _id: cartId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const newCart = await Cart.updateOne(
      { _id: cart._id },
      {
        $set: {
          quantity: Number(newQuantity),
          total: Number(newQuantity) * cart.price,
        },
      }
    );

    const response = await Cart.find({ owner: req.body.userId });

    const totalQuantity = response
      .map((item) => item.quantity)
      .reduce((total, amount) => total + amount, 0);

    const data = await Cart.find({ owner: req.body.userId });

    res.status(200).json({
      message: "quantity updated successfully",
      data,
      totalQuantity
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Buy Now API
router.get("/buyNow/:productId", verifyjwt, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const user = await User.findOne({ _id: req.body.userId });
    const product = await Product.findOne({ _id: productId });
    // console.log(product);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      data: product,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get all products from Cart API
router.get("/all", verifyjwt, async (req, res) => {
  try {
    const allProducts = await Cart.find({ owner: req.body.userId });
    const user = await User.findOne({ _id: req.body.userId });

    res.json({
      data: allProducts,
      name: user?.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get total product count in the cart
router.get("/total", verifyjwt, async (req, res) => {
  try {
    const response = await Cart.find({ owner: req.body.userId });
    const totalQuantity = response
      .map((item) => item.quantity)
      .reduce((total, amount) => total + amount, 0);

    res.status(200).json({
      totalQuantity: totalQuantity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
