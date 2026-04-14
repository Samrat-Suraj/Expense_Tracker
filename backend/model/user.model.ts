import e from "express";
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    fullName: string;
    email: string;
    password?: string;
    googleId?: string;
    verifyPasswordToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date | null;
    isVerified: boolean;
    totalBalance : number
}

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, default: "" },
    verifyPasswordToken: { type: String, default: "" },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpire: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    totalBalance : {type : Number , default : 0},

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);