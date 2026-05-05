const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
// requiring all contraollers
const listingController = require("../controllers/listings");

// ✅ Index Route
router.get("/", wrapAsync(listingController.index));

// ✅ New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ✅ Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing),
);
// ✅ Show Route (IMPORTANT FIX HERE)
router.get("/:id", wrapAsync(listingController.showListing));

// ✅ Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

// ✅ Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,

  wrapAsync(listingController.updateListing),
);

// ✅ Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing),
);

module.exports = router;
