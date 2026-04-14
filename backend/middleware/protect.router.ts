import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import EnvVars from "../config/EnvVars";
import { IUser, User } from "../model/user.model";


declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const protectRouter = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let token = req.cookies["expance"];

        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        if (!EnvVars.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }


        const decoded = jwt.verify(token, EnvVars.JWT_SECRET) as JwtPayload;

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: "Invalid token. Authorization failed." });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Access denied." });
        }

        req.user = user as IUser;
        next()
    } catch (error: any) {
        console.log("Error In protectRouter", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}