const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const { Notification } = require("../models/Notification");
const { Order } = require("../models/Order");
const { Favorite } = require("../models/Favorite");
const { User } = require("../models/User");

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
  console.log(req.params.idOrder);
  console.log(favorite);
  if (!favorite) {
    next(new AppError("this favorite not found", 400));
  }

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
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("this order not found", 400));
  }


  if (
    order.deliveryName._id.toString() === req.user.id ||
    order.adminCreator._id.toString() === req.user.id
  ) {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      order: req.params.id,
    });

    if (favorite) {
      return next(new AppError("Order is already in your favorites", 400));
    }

    // If not, add it to the favorites
    await Favorite.create({
      user: req.user.id,
      order: req.params.id,
    });
    res.status(200).json({ message: "add to favorite  successfully" });
  }else{
    return next(new AppError("not allowed only delivery or admin for this order", 400));
  }
});

/**-------------------------------------
 * @desc   Get single order getSingleOrderCtr
 * @router /api/product/:idOrder
 * @method GET
 * @access private (only admin or user himself)
 -------------------------------------*/
module.exports.getSingleFavoriteCtr = catchAsyncErrors(
  async (req, res, next) => {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite) {
      next(new AppError("this order not found in favorite", 400));
    }

    console.log(favorite.user._id.toString());
    const user = await User.findById(req.user.id);
    if (!user) {
      next(new AppError("this user not found", 400));
    }
    if (req.user.id === favorite.user._id.toString()) {
      return res.status(200).json({ favorite });
    } else {
      next(new AppError("not allowed, only delivery himself or Admin", 400));
    }
    // return order
  }
);
