import mongoose from "mongoose";

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successsfully");
    }catch(err){
        console.log("Mongodb connection failed",err);
    }
}

export default connectDb;