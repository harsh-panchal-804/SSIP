import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app= express()

app.use(cors({
    origin:"*",
    credentials:true

}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.rotes.js"
import faq from "./routes/faq.routes.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/faq",faq)
app.use("/api/v1/department",department)
app.use("/api/v1/complaint",complaintrouter)

export {app}