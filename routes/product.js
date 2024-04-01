const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const verifyjwt = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
// create Product API
router.post("/addproduct", async (req, res) => {
  try {
    const {
      brand,
      model,
      images,
      price,
      rating,
      reviewCount,
      about,
      available,
      color,
      headphoneType,
      shortDescription,
      featured,
      image,
      title
    } = req.body;

    if (
      !brand ||
      !model ||
      !images ||
      !price ||
      !rating ||
      !reviewCount ||
      !about ||
      !available ||
      !color ||
      !headphoneType ||
      !shortDescription ||
      !image ||
      !title
    ) {
      res.status(400).json({
        status: "FAILED",
        message: "Fileds Empty",
      });
      return;
    }

    const product = new Product({
      brand,
      model,
      images,
      price,
      rating,
      reviewCount,
      about,
      available,
      color,
      headphoneType,
      shortDescription,
      featured,
      image, 
      title
    });

    await product.save();

    res.status(200).json({
      status: 200,
      message: "Product added sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// Get All Products with Filter API
router.get("/all", async (req, res) => {
  try {
    //getting all filter and sort value
    const {
      search,
      company,
      headphoneType,
      featured,
      colour,
      sortPrice,
      sortName,
      minPrice,
      maxPrice,
    } = req.query;

    //setting product query
    const productQuery = {
      brand: { $regex: new RegExp(company, "i") },
      headphoneType: { $regex: new RegExp(headphoneType, "i") },
      color: { $regex: new RegExp(colour, "i") },
      title: {
        $regex: search ? new RegExp(search, "i") : new RegExp(".*"),
      },
    };

    //Inserting featured value in query
    if (featured !== undefined) {
      productQuery.featured = featured;
    }

    //setting price filter
    if (minPrice !== undefined && maxPrice !== undefined) {
      productQuery.price = {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      };
    }

    //setting sorting value
    let productSort = {};
    if (sortPrice) {
      productSort.price = parseInt(sortPrice);
    } else if (sortName) {
      productSort.brand = parseInt(sortName);
    }

    //fetching product
    const product = await Product.find(productQuery, {
      brand: 1,
      model: 1,
      shortDescription: 1,
      price: 1,
      color: 1,
      headphoneType: 1,
      images: 1,
    })
      .sort(productSort)
      .collation({ locale: "en", strength: 2 });



    res.status(200).json({ status: "SUCCESS", data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get single Product Details API
router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId) || !productId) {
      return res.status(400).json({
        message: "Invalid URL",
      });
    }

    const productDetails = await Product.findById({ _id: productId });

    if(!productDetails) {
      res.status(404).json({
        message: "Details not found",
      })
    }

    res.status(200).json({
      productDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

module.exports = router;
