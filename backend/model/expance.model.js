"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const expanceSchema = new mongoose_1.default.Schema({
    image: { type: String, required: true },
    userId: { type: String, required: true },
    item: { type: String, required: true },
    price: { type: Number, required: true },
    expanceCategory: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String, required: true },
}, { timestamps: true });
const Expance = mongoose_1.default.model("Expance", expanceSchema);
exports.default = Expance;
