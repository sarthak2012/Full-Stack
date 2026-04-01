const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  price: Number,

  location: String,

  image: {
    filename: String,
    url: String,
  },

  country: String, // ✅ lowercase (matches your data)
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
