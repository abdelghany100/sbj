const router = require("express").Router();
const {
    verifyTokenAndAdmin,
    verifyToken,
    verifyTokenAndAdminOrUser,
    verifyTokenAndAdminOrSuper,
  } = require("../middlewares/verifyToken");
  const {getAllFavoriteCtr , deleteFavoriteCtr , addFavoriteCtr } = require("../controller/FavoriteController");
const { validateLoginUser } = require("../models/User");

router.route("/").get(verifyTokenAndAdminOrUser , getAllFavoriteCtr)
router.route("/:idOrder").delete( verifyTokenAndAdminOrUser , deleteFavoriteCtr)
router.route("/:idOrder").post( verifyTokenAndAdminOrUser , addFavoriteCtr)

module.exports = router;
