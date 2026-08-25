import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";

import loginRouter from "./src/routes/login.js";

dotenv.config({
  path: "./.env"
});

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
    app.use("/", loginRouter);

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