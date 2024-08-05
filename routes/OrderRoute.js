const router = require("express").Router();

const {
  CreateOrderCtr,
  getAllOrders,
  getSingleOrderCtr,
  deleteOrderCtr,
  updateOrderCtr,
  updateStateOrderCtr,
  updateDeliveryOrderCtr,
} = require("../controller/orderController");
const validateObjectid = require("../middlewares/validateObjectid");
const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAdminOrUser,
  verifyTokenAndAdminOrSuper,
} = require("../middlewares/verifyToken");

// api/auth/register
router
  .route("/")
  .post(verifyTokenAndAdminOrSuper, CreateOrderCtr)
  .get(verifyToken, getAllOrders);

router.get("/:idOrder", verifyToken, getSingleOrderCtr);
router.delete(
  "/:idOrder",
  validateObjectid,
  verifyTokenAndAdmin,
  deleteOrderCtr
);
router.patch("/change-status/:idOrder", verifyToken, updateStateOrderCtr);
router.patch(
  "/change-delivery/:idOrder",
  validateObjectid,
  verifyToken,
  updateDeliveryOrderCtr
);
module.exports = router;
