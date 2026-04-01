const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await initDB(); // ✅ wait for connection

  } catch (err) {
    console.error(err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Existing listings cleared.");

    await Listing.insertMany(initData.data);
    console.log("Sample listings inserted.");

  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

main();