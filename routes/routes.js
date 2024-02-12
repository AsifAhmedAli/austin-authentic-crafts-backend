const express = require("express");
const router = express.Router();
// const {validateRegistration,validateLogin } = require('../middlewares/validation.js')
const { authForAdmin } = require("../middleware/authMiddlewe.js");
const auth_controller = require("../controllers/auth_controller.js");
const admin_controller = require("../controllers/admin_controller.js");
// const admin_controller = require("../controllers/admin_controller.js");

// ####### AUTH ROUTES ########## //

// ADMIN LOGIN

router.post("/admin/admin-login", auth_controller.admin_login);
router.post("/user/new-request", admin_controller.new_request);
router.get("/get-image-name", admin_controller.get_image_name);
router.get("/get-texts", admin_controller.get_texts);
router.post("/admin/change-image", authForAdmin, admin_controller.save_image);
router.post("/admin/change-text", authForAdmin, admin_controller.change_text);
router.post("/admin/fetch-tracks/search", admin_controller.fetch_tracks);

// ADD PHONE NUMBER BY ADMIN

// router.post(
//     "/admin/add-new-phone-number",
//     authForAdmin,
//     admin_controller.add_new_phone_number
//   );

// // GET ALL PHONE NUMBERS BY ADMIN

// router.get(
//     "/admin/get-all-phone-numbers",
//     authForAdmin,
//     admin_controller.get_all_phone_numbers
//   );

// // GET SINGLE PHONE NUMBER BY ADMIN

// router.get(
//     "/admin/get-single-phone-number/:id",
//     authForAdmin,
//     admin_controller.get_single_phone_number
//   );

// // DELETE SINGLE PHONE NUMBER BY ADMIN

// router.delete(
//     "/admin/delete-phone-number/:id",
//     authForAdmin,
//     admin_controller.delete_phone_number
//   );

//   // ADD NEW BOT

// router.post(
//     "/admin/create-new-bot",
//     authForAdmin,
//     admin_controller.create_new_bot
//   );

//   // GET ALL BOTS

// router.get(
//     "/admin/get-all-bots",
//     authForAdmin,
//     admin_controller.get_all_bots
//   );

//   // GET SINGLE BOT

// router.get(
//     "/admin/get-single-bot/:id",
//     authForAdmin,
//     admin_controller.get_single_bot
//   );

//   // DELETE SINGLE BOT

// router.delete(
//     "/admin/delete-bot/:id",
//     authForAdmin,
//     admin_controller.delete_bot
//   );

// // #$######################

// router.post(
//   "/create-deal",
//   admin_controller.create_deal
// );

module.exports = router;
