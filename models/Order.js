const mongoose = require("mongoose");
const joi = require("joi");

// Counter Schema
const CounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", CounterSchema);

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
        message: "a data payment must be either cash or online",
      },
    },
    deliveryType: {
      type: String,
      enum: {
        values: ["man", "woman"],
        message: "a delivery type must be either man or woman",
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
          "a status must be either waiting, delivered, under treatment, delayed, canceled, coming back, or resend",
      },
      default: "under treatment",
    },
    total: {
      type: Number,
      required: true,
    },
    serialNumber: {
      type: Number,
      // required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware to auto-increment the serialNumber
OrderSchema.pre("save", async function (next) {
  const order = this;
  if (order.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    order.serialNumber = counter.seq;
  }
  order.total = order.count * order.unitPrice;
  
  next();
});

// Middleware to populate references
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

// Validate CREATE ORDER
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

const Order = mongoose.model("Order", OrderSchema);

module.exports = {
  Order,
  validateCreateOrder,
};
