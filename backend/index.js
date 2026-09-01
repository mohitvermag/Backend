import "dotenv/config";
import express from "express";
import http from "http";
import {Server} from "socket.io";
import connectDB from "./src/db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";

import authRouter from "./src/routes/auth.route.js";



connectDB()
  .then(() => {
    const app = express();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors:{
        origin:"http://localhost:5173",
        credentials:true
      }
    });
    app.set("io", io);

    io.on("connection",(socket)=>{
      socket.on("join-admin-request", (requestId)=>{
        if(!requestId) return;
        const roomName = `admin-request-${requestId}`;
        socket.join(roomName);
      })
    })


    app.use(cors());

    app.use(express.json());
    app.use(cookieParser());

    app.use(express.static("public"));

    // Routes
    app.use("/api/v1/auth", authRouter);

    server.listen(process.env.PORT);
  })
  .catch((err) => {
    console.error("connection failed", err);
  });
