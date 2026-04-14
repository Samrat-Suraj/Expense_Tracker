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
exports.getRecentBalance = exports.getTotalBalance = exports.addBalance = void 0;
const balance_model_1 = __importDefault(require("../model/balance.model"));
const user_model_1 = require("../model/user.model");
const addBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        let user = yield user_model_1.User.findById(userId).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        let { amount, incomeSource } = req.body;
        if (!amount || !incomeSource) {
            return res.status(400).json({ success: false, message: "All Fields Are Required" });
        }
        let amt = Number(amount);
        if (isNaN(amt) || amt <= 0) {
            return res.status(400).json({ success: false, message: "Amount must be a positive number" });
        }
        let existingBalance = yield balance_model_1.default.findOne({ userId });
        if ((existingBalance === null || existingBalance === void 0 ? void 0 : existingBalance.incomeSource) === incomeSource) {
            user.totalBalance += amt;
            yield user.save();
        }
        else {
            let newBalance = new balance_model_1.default({
                userId,
                amount: amt,
                incomeSource
            });
            user.totalBalance += amt;
            yield user.save();
            yield newBalance.save();
        }
        return res.status(200).json({ success: true, message: "Balance Added Successfully" });
    }
    catch (error) {
        console.log("Error In AddBalance controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.addBalance = addBalance;
const getTotalBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let balance = yield user_model_1.User.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { totalBalance: 1 });
        if (!balance) {
            return res.status(404).json({ success: false, message: "Balance Not Found" });
        }
        return res.status(200).json({ success: true, balance });
    }
    catch (error) {
        console.log("Error In getTotalBalance controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTotalBalance = getTotalBalance;
const getRecentBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let balance = yield balance_model_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({ createdAt: -1 }).limit(3);
        if (!balance) {
            return res.status(404).json({ success: false, message: "Recent Balance Not Found" });
        }
        return res.status(200).json({ success: true, balance });
    }
    catch (error) {
        console.log("Error In getRecentBalance controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getRecentBalance = getRecentBalance;
