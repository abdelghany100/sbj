const router = require("express").Router();
const {
    verifyTokenAndAdmin,
    verifyToken,
    verifyTokenAndAdminOrUser,
    verifyTokenAndAdminOrSuper,
  } = require("../middlewares/verifyToken");
  const {getAllFavoriteCtr , deleteFavoriteCtr , addFavoriteCtr, getSingleFavoriteCtr } = require("../controller/FavoriteController");
const { validateLoginUser } = require("../models/User");

router.route("/").get(verifyToken , getAllFavoriteCtr)
router.route("/:idOrder").delete( verifyToken , deleteFavoriteCtr)
router.route("/:id").post(verifyToken ,   addFavoriteCtr)
router.route("/:id").get( verifyToken , getSingleFavoriteCtr)

module.exports = router;
