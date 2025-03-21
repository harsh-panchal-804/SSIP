import mongoose from "mongoose";
export default async function connectDB() {
    const MONGOURL = process.env.MONGOURL || "mongodb://localhost:27017/ssip";
    try {
        await mongoose.connect(MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to MongoDB")
    }
    catch (err) {
        console.log("Error connecting to MongoDB", err)
    }
}