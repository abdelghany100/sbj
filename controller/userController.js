const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const { User } = require("../models/User");

/**-------------------------------------
 * @desc get single User 
 * @router /api/user/:id
 * @method get
 * @access private (only admin or user himself)
 -------------------------------------*/

module.exports.getSingleUserCtr = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(new AppError("this user not found", 400));
  }
  res.status(200).json(user);
});

/**-------------------------------------
 * @desc get all Users 
 * @router /api/user
 * @method get
 * @access private (only admin )
 -------------------------------------*/
module.exports.getAllUsersCtr = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

/**-------------------------------------
 * @desc    delete user 
 * @router /api/user
 * @method delete
 * @access private (only admin )
 -------------------------------------*/
module.exports.deleteUserCtr = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(new AppError("this user not found", 400));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "user Deleted successfully" });
});
/**-------------------------------------
 * @desc    update user updateUserCtr
 * @router /api/user
 * @method patch
 * @access private (only user himself )
 -------------------------------------*/
module.exports.updateUserCtr = catchAsyncErrors(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { ...req.body } },
    { new: true }
  );

  res.status(200).json(updatedUser);
});
/**-------------------------------------
 * @desc    change Admin
 * @router /api/user/change-admin
 * @method patch
 * @access private (only Super admin )
 -------------------------------------*/
module.exports.changAdminCtr = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(new AppError("this user not found", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { isAdmin: req.body.isAdmin } },
    { new: true }
  );

  return res.status(200).json(updatedUser);
});


/**-------------------------------------
 * @desc    change wallet
 * @router /api/user/change-wallet
 * @method patch
 * @access private (only Super admin )
 -------------------------------------*/
module.exports.changeWalletCtr = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(new AppError("this user not found", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { wallet: req.body.salary } },
    { new: true }
  );

  return res.status(200).json(updatedUser);
});