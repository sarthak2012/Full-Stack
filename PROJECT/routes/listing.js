const express = require("express"); // to use express for creating the server and handling routes
const router = express.Router(); // to create a router for handling listing routes
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync"); // to use wrapAsync for handling async errors in routes
const { listingSchema } = require("../schema"); // to use listingSchema for validating listing data
const ExpressError = require("../utils/ExpressError"); //   to use ExpressError for custom error handling

// Validating listing data using Joi schema before creating a new listing in the database
// validating as a joi midlleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

// Index Route - to show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }),
);

//THis route will take us to form which upon fillig and submitting will create a new listing in the database
router.get(
  "/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  }),
);

//THis route will create a new listing that was filled in the form and submitted
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

//show route - to show all details of a specific listing id
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  }),
);

//Upadate route ==>Edit form And Update Route
//remder editing form
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);

//update route after submitting the edit form
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    res.redirect(`/listings/${id}`);
  }),
);

//Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let DeletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", DeletedListing);
    res.redirect("/listings");
  }),
);
module.exports = router;
