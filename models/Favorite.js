const mongoose = require("mongoose");
const joi = require("joi");
const validator = require("validator");


const FavoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
},{
    timestamps: true,
})

FavoriteSchema.pre(/^find/, function (next) {
    this.populate("user", [
      "-password",
      "-passwordConfirm",
      "-profilePhoto",
      "-createdAt",
      "-updatedAt",
      "-wallet",
      "-__v",
    ]);
    this.populate("order", [
      "-createdAt",
      "-updatedAt",
      "-wallet",
      "-__v",
    ]);
    next();
  });

  const Favorite = mongoose.model("Favorite", FavoriteSchema);

module.exports = {
    Favorite}