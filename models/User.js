const mongoose = require("mongoose");
const joi = require("joi");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { type } = require("os");

// User Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      // required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      // unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlegth: 5,
      maxlength: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "password and passwordConfirm are not the same",
      },
    },
    phone: {
      type: String,
      // required: true,
      trim: true,
      // unique: true,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png ",
        publicId: null,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    superAdmin: {
      type: Boolean,
      default: false,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate Auth Token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
      superAdmin : this.superAdmin
    },
    process.env.JWT_SECRET_KEY
  );
};

UserSchema.pre("save", async function (next) {
  // Hash the password if the password field is modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.generateRandomToken = function () {
  const token = crypto.randomInt(1000, 10000).toString();
  // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetToken = token;
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
  return token;
};

//  Validate Register User
function validateRegisterUser(obj) {
  const Schema = joi.object({
    username: joi.string().trim().min(2).max(100).required(),
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().trim().min(8).max(100).required(),
    passwordConfirm: joi.string().required(),
    phone: joi.string().trim().required(),
  });
  return Schema.validate(obj);
}

//  Validate Login User
function validateLoginUser(obj) {
  const Schema = joi.object({
    phone: joi.string().trim().required(),
    password: joi.string().trim().min(8).max(100).required(),
  });
  return Schema.validate(obj);
}

//  Validate update User
function validateUpdateUser(obj) {
  const Schema = joi.object({
    username: joi.string().trim().min(2).max(100),
    password: joi.string().trim().min(8).max(100),
  });
  return Schema.validate(obj);
}

// User Model
const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
