import mongoose from "mongoose";
import "dotenv/config";
import dotenv from "dotenv";
import { database_name } from "../../constants.js";
import { User } from "../models/user.model.js";

export default async function databaseConnection() {
  try {
    await mongoose.connect(`${process.env.DB_URL}/${database_name}`);
  } catch (error) {
    console.log(error);
  }
}
