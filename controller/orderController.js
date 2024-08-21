const catchAsyncErrors = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const { validateCreateOrder, Order } = require("../models/Order");
const { User } = require("../models/User");
const { trusted } = require("mongoose");
const { Notification } = require("../models/Notification");
/**-------------------------------------
 * @desc create New order
 * @router /api/order
 * @method POST
 * @access private (only admin)
 -------------------------------------*/
module.exports.CreateOrderCtr = catchAsyncErrors(async (req, res, next) => {
  const { error } = validateCreateOrder(req.body);
  if (error) {
    return next(new AppError(`${error.details[0].message}`, 400));
  }

  const delivery = await User.findById(req.body.deliveryName);

  if (!delivery) {
    return next(new AppError("this delivery is not found"));
  }
  const order = new Order({
    nameClint: req.body.nameClint,
    phone: req.body.phone,
    otherPhone: req.body.otherPhone,
    location: req.body.location,
    nameOrder: req.body.nameOrder,
    count: req.body.count,
    unitPrice: req.body.unitPrice,
    dataPayment: req.body.dataPayment,
    deliveryType: req.body.deliveryType,
    note: req.body.note,
    deliveryName: req.body.deliveryName,
    total: req.body.count * req.body.unitPrice,
    adminCreator: req.user.id,
  });
  await order.save();
  res.status(201).json({ message: "your order added successfully", order });
});

/**-------------------------------------
 * @desc   Get all order 
 * @router /api/order
 * @method GET
 * @access public
 -------------------------------------*/
module.exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  // const POST_PER_PAGE = 3;
  const { status } = req.query;
  let orders;
  if (status) {
    if (req.user.superAdmin) {
      orders = await Order.find({ status }).sort({ createdAt: -1 });
    } else if (req.user.isAdmin) {
      orders = await Order.find({ status, adminCreator: req.user.id }).sort({
        createdAt: -1,
      });
    } else {
      orders = await Order.find({ status, deliveryName: req.user.id }).sort({
        createdAt: -1,
      });
    }
  } else {
    if (req.user.superAdmin) {
      orders = await Order.find().sort({ createdAt: -1 });
    } else if (req.user.isAdmin) {
      orders = await Order.find({ adminCreator: req.user.id }).sort({
        createdAt: -1,
      });
    } else {
      console.log(req.user.id);
      orders = await Order.find({ deliveryName: req.user.id }).sort({
        createdAt: -1,
      });
    }
  }
  res.status(200).json(orders);
});

/**-------------------------------------
 * @desc   Get single order getSingleOrderCtr
 * @router /api/product/:idOrder
 * @method GET
 * @access private (only admin or user himself)
 -------------------------------------*/
module.exports.getSingleOrderCtr = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.idOrder);

  if (!order) {
    next(new AppError("this product not found", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    next(new AppError("this user not found", 400));
  }
  if (
    req.user.id === order.deliveryName._id.toString() ||
    req.user.id === order.adminCreator._id.toString() ||
    req.user.superAdmin
  ) {
    return res.status(200).json({ order });
  } else {
    next(new AppError("not allowed, only delivery himself or Admin", 400));
  }
  // return order
});

/**-------------------------------------
 * @desc   delete order 
 * @router /api/product/:idOrder
 * @method GET
 * @access private (only admin )
 -------------------------------------*/
module.exports.deleteOrderCtr = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.body.id);

  if (
    req.user.id === order.deliveryName._id.toString() ||
    req.user.superAdmin
  ) {
    next(new AppError("not allowed, only Admin creator or Admin", 400));
  }

  if (!order) {
    next(new AppError("this order not found", 400));
  }

  await Order.findByIdAndDelete(req.body.id),
    res.status(200).json({ message: "order delete successful" });
});

/**-------------------------------------
 * @desc   update order 
 * @router /api/product/:idOrder
 * @method PATCH
 * @access private (only admin )
 -------------------------------------*/
module.exports.updateOrderCtr = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.idOrder);
  // order = await Order.find({  adminCreator: req.user.id })

  if (!order) {
    next(new AppError("this order not found", 400));
  }

  if (req.user.isAdmin && req.user.id != order.adminCreator._id.toString()) {
    next(new AppError("not allowed only admin creator", 401));
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.idOrder,
    { $set: { ...req.body } },
    { new: true }
  );

  await updatedOrder.save();

  res.status(200).json(updatedOrder);
});

/**-------------------------------------
 * @desc   update status order 
 * @router /api/order/change-status/:idOrder
 * @method PATCH
 * @access private (only delivery himself) 
 -------------------------------------*/
module.exports.updateStateOrderCtr = catchAsyncErrors(
  async (req, res, next) => {
    const order = await Order.findById(req.params.idOrder);

    if (!order) {
      next(new AppError("this product not found", 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      next(new AppError("this user not found", 400));
    }
    if (req.user.id === order.deliveryName._id.toString()) {
      if (order.status === req.body.status) {
        // next(new AppError(` order already ${req.body.status} `, 400));
        message = ` order already ${req.body.status} `;
        res.status(404).json({ message });
        // stop further execution in this callback
        return;
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.idOrder,
        { $set: { ...req.body } },
        { new: true, runValidators: true }
      );
      if (req.body.status === "delivered") {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          { $inc: { wallet: -order.total } },
          { new: true },
          { runValidators: false }
        );

        const updatedAdmin = await User.findByIdAndUpdate(
          order.adminCreator._id,
          { $inc: { wallet: +order.total } },
          { new: true },
          { runValidators: false }
        );

        // await updatedUser.save();
      }

      await updatedOrder.save();

      const newnote = await Notification.create({
        deliveryName: order.deliveryName._id,
        order: order._id,
        status: updatedOrder.status,
      });
      console.log(newnote);

      res.status(200).json(updatedOrder);
    } else {
      next(new AppError("not allowed, only delivery himself ", 400));
    }
  }
);
/**-------------------------------------
 * @desc   update delivery order 
 * @router /api/change-delivery/:idOrder
 * @method PATCH
 * @access private (only delivery himself or superAdmin) 
 -------------------------------------*/
module.exports.updateDeliveryOrderCtr = catchAsyncErrors(
  async (req, res, next) => {
    const order = await Order.findById(req.params.idOrder);

    if (!order) {
      next(new AppError("this product not found", 400));
    }

    const newDelivery = await User.findById(req.body.deliveryName);
    if (!newDelivery) {
      next(new AppError("this delivery not found", 400));
    }
    // console.log(req.user.id)
    // console.log(order.deliveryName._id.toString())
    if (
      req.user.id === order.deliveryName._id.toString() ||
      req.user.superAdmin ||
      req.user.isAdmin
    ) {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.idOrder,
        {
          $set: {
            status: "under treatment",
            deliveryName: req.body.deliveryName,
          },
        },
        { new: true }
      );

      await updatedOrder.save();
      res.status(200).json(updatedOrder);
    } else {
      next(new AppError("not allowed, only delivery himself ", 400));
    }
  }
);

/**-------------------------------------
 * @desc   update delivery order 
 * @router /api/change-delivery/:idOrder
 * @method PATCH
 * @access private (only delivery himself or superAdmin) 
 -------------------------------------*/
module.exports.getAllOrdersByDateCtr = catchAsyncErrors(
  async (req, res, next) => {
    const now = new Date();

    let matchCriteria = {};

    if (req.user.superAdmin) {
      matchCriteria = {}; // لا توجد قيود
    } else if (req.user.isAdmin) {
      matchCriteria = { adminCreator: req.user.id };
    } else {
      matchCriteria = { deliveryName: req.user.id };
    }

    // تحديد المدة الزمنية بناءً على طلب المستخدم (شهر، شهرين، أو ثلاثة)
    const month = parseInt(req.query.month); // التأكد من وجود هذا الحقل في طلب المستخدم (1, 2, 3)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - month, 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() - month + 1,
      0
    );

    if ([1, 2, 3].includes(month)) {
      matchCriteria.createdAt = {
        $gte: startOfMonth,
        $lt: new Date(endOfMonth.setHours(23, 59, 59, 999)),
      };
    }

    console.log(matchCriteria.createdAt);

    if (req.query.status) {
      if (req.user.superAdmin) {
        const orders = await Order.find({
          createdAt: matchCriteria.createdAt,
          status: req.query.status,
        }).sort({ createdAt: -1 });
        res.json(orders);
      } else if (req.user.isAdmin) {
        const orders = await Order.find({
          createdAt: matchCriteria.createdAt,
          status: req.query.status,
          adminCreator: req.user.id,
        }).sort({ createdAt: -1 });
        res.json(orders);
      } else {
        const orders = await Order.find({
          createdAt: matchCriteria.createdAt,
          status: req.query.status,
          deliveryName: req.user.id,
        }).sort({ createdAt: -1 });
        res.json(orders);
      }
    } else {
      if (req.user.superAdmin) {
        const orders = await Order.find({
          createdAt: matchCriteria.createdAt,
        }).sort({ createdAt: -1 });
        res.json(orders);
      } else if (req.user.isAdmin) {
        const orders = await Order.find({
          createdAt: matchCriteria.createdAt,
          adminCreator: req.user.id,
        }).sort({ createdAt: -1 });
        res.json(orders);
      } else {
        const orders = await Order.find({
          createdAt: matchCriteria.createdAt,
          deliveryName: req.user.id,
        }).sort({ createdAt: -1 });
        res.json(orders);
      }
    }
  }
);
