"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, default: "" },
    verifyPasswordToken: { type: String, default: "" },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpire: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    totalBalance: { type: Number, default: 0 },
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
