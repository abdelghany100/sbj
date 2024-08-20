const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const { Notification } = require("../models/Notification");
const { Order } = require("../models/Order");

/**-------------------------------------
 * @desc   Get all Notifications
 * @router /api/notifications
 * @method GET
 * @access private(only admin)
 -------------------------------------*/
module.exports.getAllNotificationsCtr = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.isAdmin) {
      const orders = await Order.find({ adminCreator: req.user.id });
      const orderIds = orders.map((order) => order._id);
      console.log(orderIds); // Extract the order IDs
      const notifications = await Notification.find({
        order: { $in: orderIds },
      });
      res.status(200).json(notifications);
    } else if (req.user.superAdmin) {
      const notifications = await Notification.find();
      res.status(200).json(notifications);
    }
  }
);
/**-------------------------------------
 * @desc   delete Notifications
 * @router /api/notifications
 * @method delete
 * @access private(only admin)
 -------------------------------------*/
module.exports.deleteNotificationsCtr = catchAsyncErrors(
  async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      next(new AppError("this notification not found", 400));
    }
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification Deleted successfully" });
  }
);
