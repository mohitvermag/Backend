import mongoose from "mongoose";
import {DB_NAME} from "../../constants.js";

const getMongoUri = () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is missing. Add it to your .env file.");
    }

    const parsedUri = new URL(mongoUri);
    if (!["mongodb:", "mongodb+srv:"].includes(parsedUri.protocol)) {
        throw new Error('MONGO_URI must start with "mongodb://" or "mongodb+srv://".');
    }

    if (!parsedUri.pathname || parsedUri.pathname === "/") {
        parsedUri.pathname = `/${DB_NAME}`;
    }

    return parsedUri.toString();
};

const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(getMongoUri());
        console.log("Database Connected Successfully", connectionInstance.connection.host);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;