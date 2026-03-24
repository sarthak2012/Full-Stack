const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const path = require("path"); // to use path module for joining paths
app.set("view engine", "ejs"); // to set the view engine to ejs and render ejs files from views folder
app.set("views", path.join(__dirname, "views")); // to set the views folder as the location for our ejs files
app.use(express.urlencoded({ extended: true })); // to parse the form data from the request body
app.use(methodOverride("_method")); // to use method override for PUT and DELETE requests

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

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
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

//THis route will take us to form which upon fillig and submitting will create a new listing in the database
app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

//THis route will create a new listing that was filled in the form and submitted
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//show route - to show all details of a specific listing id
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Upadate route ==>Edit form And Update Route
//remder editing form
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//update route after submitting the edit form
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}); 