const router = require("express").Router({ mergeParams: true });
const { isAdmin, protect } = require("../controllers/authController");
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userMiddleware");

const cartRouter = require("./cartRouter");

router.use("/:userId/cart", cartRouter);

router.use(protect);

router.get("/me", userController.getMe, userController.getUser);
router.put(
  "/updateUser",
  userController.getMe,
  userController.updateLoggedUser,
  userController.updateUser
);
router.put(
  "/changePassword",
  userController.getMe,
  userMiddleware.changePassword,
  userController.changeLoggedPassword
);


// admin
router.use(isAdmin);

router.delete(
  "/un-active/:id",
  userController.unActive,
  userController.updateUser
);

router.post(
  "/changePassword/:id",
  userMiddleware.changePassword,
  userController.changePassword
);

router
  .route("/")
  .get(userController.getUsers)
  .post(
    userController.upload,
    userController.resizeImage,
    userController.applySlugify,
    userMiddleware.validateCreateUser,
    userController.createUser
  );

router
  .route("/:id")
  .get(userMiddleware.validateGetUserParams, userController.getUser)
  .put(
    userController.upload,
    userController.resizeImage,
    userController.updateUserWithoutPass,
    userController.applySlugify,
    userMiddleware.validateUpdateUser,
    userController.updateUser
  )
  .delete(
    userMiddleware.validateGetUserParams,
    userController.unActive,
    userController.updateUser
  );

module.exports = router;
