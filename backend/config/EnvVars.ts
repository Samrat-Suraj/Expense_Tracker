import dotenv from "dotenv"
dotenv.config()

let EnvVars = {
    MONGO_URL: process.env.MONGO_URL,
    NODEMAILER_USER: process.env.NODEMAILER_USER,
    NODEMAILER_PASS: process.env.NODEMAILER_PASS,
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_API_NAME: process.env.CLOUDINARY_API_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    FRONTEND_URI: process.env.FRONTEND_URI,

    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL
}


export default EnvVars