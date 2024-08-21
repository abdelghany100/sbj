const router = require("express").Router();
const {
    verifyTokenAndAdmin,
    verifyToken,
    verifyTokenAndAdminOrUser,
    verifyTokenAndAdminOrSuper,
  } = require("../middlewares/verifyToken");
  const {getAllNotificationsCtr , deleteNotificationsCtr} = require("../controller/NotificationController");
const { validateLoginUser } = require("../models/User");

router.route("/").get(verifyTokenAndAdminOrSuper , getAllNotificationsCtr)
router.route("/").delete( verifyTokenAndAdminOrSuper , deleteNotificationsCtr)

module.exports = router;
