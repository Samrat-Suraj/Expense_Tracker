import { Response } from "express"
import jwt from "jsonwebtoken"
import EnvVars from "../config/EnvVars"

const getTokenAndSetCookie = async (userId: string, res: Response) : Promise<string> => {
    if (!EnvVars.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    let token = jwt.sign({ userId }, EnvVars.JWT_SECRET, { expiresIn: "15d" })

    res.cookie("expance", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure : true
    })

    return token
}


export default getTokenAndSetCookie