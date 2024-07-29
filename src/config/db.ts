const mongoose = require("mongoose");
import { MongoError } from "mongodb";
import "dotenv/config";

const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

exports.connect = () => {
  mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err: MongoError) =>
      console.error("Failed to connect to MongoDB", err)
    );
};
