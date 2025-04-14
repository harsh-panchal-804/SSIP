import dotenv from "dotenv";
dotenv.config();

import connectDB from "./model/connectDB.js";
import {app} from "./app.js";


connectDB()





.then(()=>{
    app.listen(8000, () => {
        console.log("Server Listening on port: ", PORT)
})
})
.catch((err)=>{
    console.log("Mongodb connection failed")
})
