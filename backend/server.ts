import express from 'express';
import cookieParser from "cookie-parser"
import cors from 'cors';
const app = express();

import mongoDb from './config/mongoDb';
import userRouter from "./router/user.router"
import balanceRouter from './router/balance.router';
import { protectRouter } from './middleware/protect.router';
import expanceRouter from './router/expance.router';
import upload from './middleware/multer';
import passport from './controller/strategy/google.strategy';


app.use(passport.initialize())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

app.use("/user", userRouter)
app.use("/balance", protectRouter, balanceRouter)
app.use("/expances", protectRouter, upload.single("image"), expanceRouter)

let PORT = 5000
app.listen(PORT, async () => {
    mongoDb()
    console.log("Server Listing On Port", PORT)
})
