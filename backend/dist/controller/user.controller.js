"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadUser = exports.logoutUser = exports.loginUser = exports.resetPassword = exports.forgetUser = exports.verifyUser = exports.registerUser = void 0;
const validator_1 = __importDefault(require("validator"));
const user_model_1 = require("../model/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mailConfig_1 = require("../config/mailConfig");
const crypto_1 = __importDefault(require("crypto"));
const genTokenAndSetCookie_1 = __importDefault(require("../utils/genTokenAndSetCookie"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        let verifyPasswordToken = yield crypto_1.default.randomBytes(20).toString("hex");
        const newUser = new user_model_1.User({
            fullName,
            email,
            password: hashedPassword,
            verifyPasswordToken: verifyPasswordToken
        });
        yield newUser.save();
        yield (0, mailConfig_1.sendVerificationToEmail)(email, newUser.verifyPasswordToken);
        return res.status(201).json({
            success: true, message: "User registered successfully. Please check your email to verify your account.", user: Object.assign(Object.assign({}, newUser.toObject()), { password: null })
        });
    }
    catch (error) {
        console.log("Error in registerUser:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.registerUser = registerUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ success: false, message: "Verification token is required" });
        }
        const user = yield user_model_1.User.findOne({ verifyPasswordToken: token });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid or expired token" });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }
        user.isVerified = true;
        user.verifyPasswordToken = "";
        yield user.save();
        yield (0, genTokenAndSetCookie_1.default)(user.id, res);
        return res.status(200).json({ success: true, message: "User verified successfully" });
    }
    catch (error) {
        console.log("Error in verifyUser:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.verifyUser = verifyUser;
const forgetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Enter Valid Email Address" });
        }
        let user = yield user_model_1.User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        let resetToken = yield crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
        yield user.save();
        yield (0, mailConfig_1.sendResetPassToEmail)(email, user.resetPasswordToken);
        return res.status(200).json({ success: true, message: "Please check your email to reset your password" });
    }
    catch (error) {
        console.log("Error In forgetUser Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.forgetUser = forgetUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { token } = req.params;
        let { password } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Reset token is required" });
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }
        let user = yield user_model_1.User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: new Date() } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = "";
        user.resetPasswordExpire = null;
        yield user.save();
        return res.status(200).json({ success: true, message: "Password reset successfully" });
    }
    catch (error) {
        console.log("Error In resetPassword Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.resetPassword = resetPassword;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Enter Valid Email Address" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password Must Have 8 or more characters" });
        }
        let user = yield user_model_1.User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Please check your email and verify your account" });
        }
        let isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Password incorrect please check your password" });
        }
        yield (0, genTokenAndSetCookie_1.default)(user.id, res);
        return res.status(200).json({ success: false, message: "User login Successfully" });
    }
    catch (error) {
        console.log("Error In loginUser Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("expance", { maxAge: 0, httpOnly: true, sameSite: "none", secure: true });
        return res.status(200).json({ success: true, message: "User logout Successfully" });
    }
    catch (error) {
        console.log("Error In logoutUser Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.logoutUser = logoutUser;
const loadUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        let userId = req.user._id;
        let user = yield user_model_1.User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpire -verifyPasswordToken");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    }
    catch (error) {
        // console.log("Error In loadUser Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.loadUser = loadUser;
