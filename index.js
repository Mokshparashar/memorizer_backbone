import databaseConnection from "./src/db/dbConnect.js";
import express from "express";
import dotenv from "dotenv";

import "dotenv/config";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });
databaseConnection()
  .then(() =>
    app.listen(process.env.PORT || 8000, () => {
      console.log(`the server is listening on the port ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
