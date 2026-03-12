const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const Listing = require("./models/listing");
const path = require("path"); // to use path module for joining paths
app.set("view engine", "ejs"); // to set the view engine to ejs and render ejs files from views folder
app.set("views", path.join(__dirname, "views")); // to set the views folder as the location for our ejs files

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

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

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("/listings/index.ejs", { listings: allListings });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
