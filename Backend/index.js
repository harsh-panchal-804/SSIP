import express from "express";
import dotenv from "dotenv";
dotenv.config();
import redis from "redis";
import connectDB from "./model/connectDB.js";
import faqRoutes from "./routes/faq.routes.js";
import cors from "cors";
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("hello harsh")
})
const redisClient = redis.createClient({ url: "redis://localhost:6379" });
redisClient.connect();
app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
})
app.use("/faqs", faqRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on Port", PORT)
})