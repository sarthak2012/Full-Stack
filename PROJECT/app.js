const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const path = require("path"); // to use path module for joining paths
const ejsMate = require("ejs-mate"); // to use ejs-mate for layouts and partials in ejs
const wrapAsync = require("./utils/wrapAsync"); // to use wrapAsync for error handling in async functions
const ExpressError = require("./utils/ExpressError"); // to use ExpressError for custom error handling

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // to parse the form data from the request body
app.use(methodOverride("_method")); // to use method override for PUT and DELETE requests
app.use(express.static(path.join(__dirname, "/public"))); // to serve static files from the public folder


async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });

  } catch (err) {
    console.log(err);
  }
}

main();
//base url
app.get("/", (req, res) => {
  res.send("Hello, i am root route");
});

// app.get("/testlisting", async (req, res) => {
//     let sampleListings = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing for testing.",
//         price: 100,
//         location: "Sample Location",
//         Country: "Sample Country"
//     });
//     await sampleListings.save();
//     console.log("Sample listing saved");
//     res.send("Sample listing created and saved to the database.");
// });

// Index Route - to show all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }),
);

//THis route will take us to form which upon fillig and submitting will create a new listing in the database
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  }),
);

//THis route will create a new listing that was filled in the form and submitted
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Invalid listing data");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

//show route - to show all details of a specific listing id
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  }),
);

//Upadate route ==>Edit form And Update Route
//remder editing form
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);

//update route after submitting the edit form
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    res.redirect(`/listings/${id}`);
  }),
);

//Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let DeletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", DeletedListing);
    res.redirect("/listings");
  }),
);

//backend / server error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong! Please try again later.");
// });

app.use((err, req, res, next) => {
  console.log(err); // debug
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error", { message });
});
