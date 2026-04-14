import { Request, Response } from "express"
import validator from "validator"
import { User } from "../model/user.model"
import bcrypt from "bcryptjs"
import { sendResetPassToEmail, sendVerificationToEmail } from "../config/mailConfig";
import crypto from "crypto"
import getTokenAndSetCookie from "../utils/genTokenAndSetCookie";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let verifyPasswordToken = await crypto.randomBytes(20).toString("hex")

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            verifyPasswordToken: verifyPasswordToken
        });

        await newUser.save();
        await sendVerificationToEmail(email, newUser.verifyPasswordToken)
        return res.status(201).json({
            success: true, message: "User registered successfully. Please check your email to verify your account.", user: {
                ...newUser.toObject(),
                password: null
            }
        });

    } catch (error: any) {
        console.log("Error in registerUser:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ success: false, message: "Verification token is required" });
        }

        const user = await User.findOne({ verifyPasswordToken: token });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid or expired token" });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        user.isVerified = true;
        user.verifyPasswordToken = "";

        await user.save();
        await getTokenAndSetCookie(user.id, res)
        return res.status(200).json({ success: true, message: "User verified successfully" });

    } catch (error: any) {
        console.log("Error in verifyUser:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const forgetUser = async (req: Request, res: Response) => {
    try {
        let { email } = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Enter Valid Email Address" })
        }

        let user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        let resetToken = await crypto.randomBytes(20).toString("hex")
        user.resetPasswordToken = resetToken
        user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000)
        await user.save()
        await sendResetPassToEmail(email, user.resetPasswordToken)
        return res.status(200).json({ success: true, message: "Please check your email to reset your password" })

    } catch (error: any) {
        console.log("Error In forgetUser Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        let { token } = req.params
        let { password } = req.body

        if (!token) {
            return res.status(400).json({ success: false, message: "Reset token is required" })
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" })
        }

        let user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: new Date() } })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword
        user.resetPasswordToken = ""
        user.resetPasswordExpire = null
        await user.save()
        return res.status(200).json({ success: true, message: "Password reset successfully" })

    } catch (error: any) {
        console.log("Error In resetPassword Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {

        let { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Enter Valid Email Address" })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password Must Have 8 or more characters" })
        }

        let user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Please check your email and verify your account" })
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password as string)
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Password incorrect please check your password" })
        }

        await getTokenAndSetCookie(user.id, res)
        return res.status(200).json({ success: false, message: "User login Successfully" })
    } catch (error: any) {
        console.log("Error In loginUser Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("expance", { maxAge: 0  , httpOnly : true , sameSite : "none", secure: true })
        return res.status(200).json({ success: true, message: "User logout Successfully" })
    } catch (error: any) {
        console.log("Error In logoutUser Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const loadUser = async (req: Request, res: Response) => {
    try {
        let userId = req.user._id
        let user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpire -verifyPasswordToken")
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        return res.status(200).json({ success: true, user })
    } catch (error) {
        // console.log("Error In loadUser Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


