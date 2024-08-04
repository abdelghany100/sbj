const router = require("express").Router();
const {
    verifyTokenAndAdmin,
    verifyToken,
    verifyTokenAndAdminOrUser,
  } = require("../middlewares/verifyToken");
  const {getAllNotificationsCtr , deleteNotificationsCtr} = require("../controller/NotificationController");
const { validateLoginUser } = require("../models/User");

router.route("/").get(verifyTokenAndAdmin , getAllNotificationsCtr)
router.route("/:id").delete( verifyTokenAndAdmin , deleteNotificationsCtr)

module.exports = router;
