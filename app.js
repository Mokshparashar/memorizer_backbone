import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);

import router from "./src/routes/userRoute.js";

app.use("/api/v1/users", router);
export { app };
