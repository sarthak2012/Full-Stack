const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

// ✅ Joi validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

// ✅ Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// ✅ New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// ✅ Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// ✅ Show Route (IMPORTANT FIX HERE)
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");

    // 🔥 FIX: handle invalid ID / not found
    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }

    res.render("listings/show.ejs", { listing });
  })
);

// ✅ Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }

    res.render("listings/edit.ejs", { listing });
  })
);

// ✅ Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });

    if (!updatedListing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }

    res.redirect(`/listings/${id}`);
  })
);

// ✅ Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }

    console.log("Deleted listing:", deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;
