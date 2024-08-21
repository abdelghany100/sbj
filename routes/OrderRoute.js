const router = require("express").Router();

const {
  CreateOrderCtr,
  getAllOrders,
  getSingleOrderCtr,
  deleteOrderCtr,
  updateOrderCtr,
  updateStateOrderCtr,
  updateDeliveryOrderCtr,
  getAllOrdersByDateCtr,
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
  .get(verifyToken, getAllOrders)

  router.get("/filter-date" , verifyToken , getAllOrdersByDateCtr)
  
router.get("/:idOrder", verifyToken, getSingleOrderCtr);
router.delete(  "/",
  verifyTokenAndAdminOrSuper,
  deleteOrderCtr
);
router.patch("/change-status/:idOrder", verifyToken, updateStateOrderCtr);
router.patch(
  "/change-delivery/:idOrder",
  verifyToken,
  updateDeliveryOrderCtr
);
router.patch("/:idOrder" , verifyTokenAndAdminOrSuper , updateOrderCtr)
module.exports = router;
