const mongoose = require("mongoose");
const joi = require("joi");
const validator = require("validator");

const OrderSchema = new mongoose.Schema(
  {
    nameClint: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    otherPhone: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    nameOrder: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    dataPayment: {
      type: String,
      enum: {
        values: ["cash", "online"],
        message: "a data payment  must be either cash, online ",
      },
    },
    deliveryType: {
      type: String,
      enum: {
        values: ["man", "woman"],
        message: "a delivery type  must be either man, woman ",
      },
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    deliveryName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          "waiting",
          "delivered",
          "under treatment",
          "delayed",
          "canceled",
          "coming back",
          "resend",
        ],
        message:
          "a status  must be either (no answer, delivered, under treatment , delayed , canceled , coming back)",
      },
      default: "under treatment",
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//  Validate CREATE  ORDER
function validateCreateOrder(obj) {
  const Schema = joi.object({
    nameClint: joi.string().trim().required(),
    phone: joi.string().trim().required(),
    otherPhone: joi.string().trim().required(),
    location: joi.string().trim().required(),
    nameOrder: joi.string().trim().required(),
    count: joi.number().required(),
    unitPrice: joi.number().required(),
    dataPayment: joi.string().trim().required(),
    deliveryType: joi.string().trim().required(),
    note: joi.string().trim(),
    deliveryName: joi.required(),
  });
  return Schema.validate(obj);
}
OrderSchema.pre(/^find/, function (next) {
  this.populate("deliveryName", [
    "-password",
    "-passwordConfirm",
    "-profilePhoto",
    "-createdAt",
    "-updatedAt",
    "-wallet",
    "-__v",
  ]);
  this.populate("adminCreator", [
    "-password",
    "-passwordConfirm",
    "-profilePhoto",
    "-createdAt",
    "-updatedAt",
    "-wallet",
    "-__v",
  ]);
  next();
});

OrderSchema.pre("save", function (next) {
  this.total = this.count * this.unitPrice;
  next();
});

// // Middleware to update total before updating

const Order = mongoose.model("Order", OrderSchema);

module.exports = {
  Order,
  validateCreateOrder,
};
