const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const { Notification } = require("../models/Notification");
const { Order } = require("../models/Order");
const { Favorite } = require("../models/Favorite");

/**-------------------------------------
 * @desc   Get all Favorite
 * @router /api/favorites
 * @method GET
 * @access public
 -------------------------------------*/
module.exports.getAllFavoriteCtr = catchAsyncErrors(async (req, res, next) => {
  const favorites = await Favorite.find({ user: req.user.id });

  res.status(200).json(favorites);
});
/**-------------------------------------
 * @desc   delete Favorite
 * @router /api/favorite
 * @method delete
 * @access public
 -------------------------------------*/
module.exports.deleteFavoriteCtr = catchAsyncErrors(async (req, res, next) => {
  const favorite = await Favorite.findOne({
    user: req.user.id,
    order: req.params.idOrder,
  });
  if (!favorite) {
    next(new AppError("this favorite not found", 400));
  }
  console.log(favorite.user._id.toString());
  console.log(req.user.id);
  if (favorite.user._id.toString() != req.user.id) {
    next(new AppError("not allowed, only user himsylf", 401));
  }
  await Favorite.deleteOne({ user: req.user.id, order: req.params.idOrder });
  res.status(200).json({ message: " Deleted favorite successfully" });
});
/**-------------------------------------
 * @desc   add Favorite
 * @router /api/favorite
 * @method post
 * @access public
 -------------------------------------*/
module.exports.addFavoriteCtr = catchAsyncErrors(async (req, res, next) => {
  const favorite = await Favorite.findOne({
    user: req.user.id,
    order: req.params.idOrder,
  });

  if (favorite) {
    return next(new AppError("Order is already in your favorites", 400));
  }

  // If not, add it to the favorites
  await Favorite.create({
    user: req.user.id,
    order: req.params.idOrder,
  });
  res.status(200).json({ message: "add to favorite  successfully" });
});
