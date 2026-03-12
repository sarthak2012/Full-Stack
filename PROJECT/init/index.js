const mongoose = require('mongoose');
const initData=require('./data.js');
const lising = require('../models/listing.js');
const MONGO_URL = "mongodb://localhost:27017/wanderlust";


main() 
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await lising.deleteMany({});
        console.log("Existing listings cleared.");
        await lising.insertMany(initData.data);
        console.log("Sample listings inserted.");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

initDB();