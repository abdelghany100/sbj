const mongoose = require("mongoose");
const joi = require("joi");
const validator = require("validator");


const NotificationSchema = new mongoose.Schema({
    deliveryName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
      status:{
        type:String,
        required:true,
      }
},{
    timestamps: true,
})

NotificationSchema.pre(/^find/, function (next) {
    this.populate("deliveryName", [
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

  const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = {
    Notification}