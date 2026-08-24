import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
dotenv.config({
    path:"./.env"
});
connectDB()
.then(()=>{
    const app = express();  
    app.use(cors());
    app.use(express.json({limit:"50mb"}));
    app.use(urlencoded({extended : true, limit : "50mb"}));
    app.use(express.static("public"));
    app.listen(process.env.PORT, ()=>{
        console.log('Server is running on port', process.env.PORT);
    })
})
.catch((err)=>{
    console.log(err, "connection failed");
})







// const app = express();
// (async ()=>{
//     try{
//       await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//       app.on("error",(err)=>{
//         console.log(err);
//         throw err;
//       })

//       app.listen(process.env.PORT, ()=>{
//         console.log('Server is running on port', process.env.PORT);
//       })
//     }
//     catch(err){
//         console.log(err);
//     }
// })()