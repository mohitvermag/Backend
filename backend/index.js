import express from "express";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
});
import connectDB from "./src/db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";

import authRouter from "./src/routes/auth.route.js";



connectDB()
  .then(() => {
    const app = express();

    app.use(cors());

    app.use(express.json({
      limit: "50mb"
    }));

    app.use(urlencoded({
      extended: true,
      limit: "50mb"
    }));

    app.use(cookieParser());

    app.use(express.static("public"));

    // Routes
    app.use("/api/v1/auth", authRouter);

    app.listen(process.env.PORT, () => {
      console.log(
        "Server is running on port",
        process.env.PORT
      );
    });
  })
  .catch((err) => {
    console.log(err, "connection failed");
  });