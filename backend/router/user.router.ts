import express, { NextFunction, Request, response, Response } from "express"
import { forgetUser, loadUser, loginUser, logoutUser, registerUser, resetPassword, verifyUser } from "../controller/user.controller"
import { protectRouter } from "../middleware/protect.router"
import EnvVars from "../config/EnvVars"
import passport from "passport";
import getTokenAndSetCookie from "../utils/genTokenAndSetCookie"

const router = express.Router()

router.get("/" , protectRouter,  loadUser)
router.post("/register" , registerUser)
router.post("/verify/:token" , verifyUser)
router.post("/forget" , forgetUser)
router.post("/resetPass/:token" , resetPassword)
router.post("/login" , loginUser)
router.post("/logout" , logoutUser)


router.get("/google", passport.authenticate("google", {
    scope: ["email", "profile"]
}))

//Google CallBack Route
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${EnvVars.GOOGLE_CALLBACK_URL}`, session: false }),
    async (req : Request, res : Response, next : NextFunction) => {
        try {
            const user = req.user as any
            console.log("Google User:", user);
            await getTokenAndSetCookie(user._id as string , res)
            res.redirect(`${EnvVars.FRONTEND_URI}`)
        } catch (error) {
            next(error)
        }
    }
)

export default router