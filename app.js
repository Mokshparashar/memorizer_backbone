import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);

import router from "./src/routes/userRoute.js";
import cookieParser from "cookie-parser";

app.use("/api/v1/users", router);
export { app };
