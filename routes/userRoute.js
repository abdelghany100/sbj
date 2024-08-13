const router = require("express").Router();
const {
  getSingleUserCtr,
  getAllUsersCtr,
  deleteUserCtr,
  updateUserCtr,
  changAdminCtr,
  changeWalletCtr
} = require("../controller/userController.js");
const { required } = require("joi");
const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAdminOrUser,
  verifyTokenAndSuperAdmin,
  verifyTokenAndAdminOrSuper,
} = require("../middlewares/verifyToken");
const validateObjectid = require("../middlewares/validateObjectid.js");

router
  .route("/:id")
  .get(validateObjectid ,verifyTokenAndAdminOrUser, getSingleUserCtr)
  .delete( validateObjectid,verifyTokenAndAdminOrSuper, deleteUserCtr);
router  
  .route("/")
  .get(verifyTokenAndAdminOrSuper, getAllUsersCtr)
  .patch(verifyToken, updateUserCtr);


router.patch("/change-admin/:id" , validateObjectid , verifyTokenAndSuperAdmin ,changAdminCtr)
router.patch("/change-wallet/:id" , validateObjectid , verifyTokenAndSuperAdmin ,changeWalletCtr)
module.exports = router;
