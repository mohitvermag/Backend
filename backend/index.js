import "dotenv/config";
import express from "express";
import http from "http";
import {Server} from "socket.io";
import connectDB from "./src/db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

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


    app.use(cors({
      origin: "http://localhost:5173",
      credentials: true
    }));

    app.use(session({
      secret:process.env.Session_Secret, 
      resave:false,
      saveUninitialized:false,
      store:MongoStore.create({
        mongoUrl:process.env.MONGO_URI,
      }),
      cookie:{
        httpOnly:true,
        secure:false,
        maxAge: 24 * 60 * 60 * 1000
      }
    }))

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
