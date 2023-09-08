const mongoose = require("mongoose");
import * as dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

export async function connectToDatabase() {
  // Connecting to the database

  try {
    console.log('mongoo', MONGO_URI)
    await mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

      })
  } catch (error) {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  }
};