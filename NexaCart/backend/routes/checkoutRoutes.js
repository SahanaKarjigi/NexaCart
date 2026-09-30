const express = require("express");
const Checkout = require("../models/Checkout");
const User = require("../models/User");

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const {
      email,
      phone,
      shippingAddress,
      userId
    } = req.body;

    if (!email || !phone || !shippingAddress) {
      return res.status(400).json({
        message:
          "Email, phone number and shipping address are required."
      });
    }

    let user = null;

    if (userId) {
      user = await User.findById(userId);
    }

    if (!user) {
      user = await User.findOne({
        email: email.trim().toLowerCase()
      });
    }

    const checkout = await Checkout.create({
      user: user ? user._id : null,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      shippingAddress: shippingAddress.trim()
    });

    res.status(201).json({
      message: "Checkout submitted successfully.",
      checkout: {
        id: checkout._id,
        email: checkout.email,
        phone: checkout.phone,
        shippingAddress: checkout.shippingAddress,
        createdAt: checkout.createdAt
      }
    });
  } catch (error) {
    console.error("Checkout error:", error);

    res.status(500).json({
      message: "Unable to submit checkout."
    });
  }
});

module.exports = router;