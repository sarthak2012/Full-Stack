const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

// ✅ Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }),
);

// ✅ New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// ✅ Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,

  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Associate listing with logged-in user
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  }),
);

// ✅ Show Route (IMPORTANT FIX HERE)
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");

    // 🔥 FIX: handle invalid ID / not found
    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  }),
);

// ✅ Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }

    res.render("listings/edit.ejs", { listing });
  }),
);

// ✅ Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,

  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });

    if (!updatedListing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  }),
);

// ✅ Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }

    console.log("Deleted listing:", deletedListing);
    req.flash("success", "listing Deleted Successfully!");
    res.redirect("/listings");
  }),
);

module.exports = router;
