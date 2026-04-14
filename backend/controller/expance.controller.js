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
exports.getTodayExpance = exports.getThisYearExpance = exports.getThisMonthExpance = exports.getMonthlyExpance = exports.getTotalExpance = exports.deleteExpance = exports.updateExpance = exports.getExpanceById = exports.getAllExpances = exports.createExpance = void 0;
const DataUri_1 = __importDefault(require("../middleware/DataUri"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const expance_model_1 = __importDefault(require("../model/expance.model"));
const user_model_1 = require("../model/user.model");
const createExpance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.user._id;
        let { item, price, expanceCategory, paymentMethod, date, notes } = req.body;
        console.log("Received data in createExpance controller: ", { item, price, expanceCategory, paymentMethod, date, notes });
        if (!item || !price || !expanceCategory || !paymentMethod || !date || !notes) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        let u = yield user_model_1.User.findById(req.user._id).select("-password");
        if (!u) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        if (u.totalBalance < price) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        }
        else {
            u.totalBalance -= price;
            yield u.save();
        }
        const image = req.file;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }
        let file = (0, DataUri_1.default)(image);
        let cloudinaryResponse = yield cloudinary_1.default.uploader.upload(file);
        let newExpance = new expance_model_1.default({
            image: cloudinaryResponse.secure_url,
            userId: user,
            item,
            price,
            expanceCategory,
            paymentMethod,
            date: new Date(date),
            notes
        });
        yield newExpance.save();
        res.status(201).json({
            success: true,
            message: "Expance created successfully",
            data: newExpance
        });
    }
    catch (error) {
        console.log("Error in createExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createExpance = createExpance;
const getAllExpances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.user._id;
        let expances = yield expance_model_1.default.find({ userId: user }).sort({ createdAt: -1 });
        if (!expances) {
            return res.status(404).json({
                success: false,
                message: "No expances found for this user"
            });
        }
        res.status(200).json({
            success: true,
            message: "Expances retrieved successfully",
            data: expances
        });
    }
    catch (error) {
        console.log("Error in getAllExpances controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllExpances = getAllExpances;
const getExpanceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let expanceId = req.params.id;
        let expance = yield expance_model_1.default.findById(expanceId);
        if (!expance) {
            return res.status(404).json({
                success: false,
                message: "Expance not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Expance retrieved successfully",
            data: expance
        });
    }
    catch (error) {
        console.log("Error in getExpanceById controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getExpanceById = getExpanceById;
const updateExpance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let { item, price, expanceCategory, paymentMethod, date, notes } = req.body;
        let expanceId = req.params.id;
        let expance = yield expance_model_1.default.findById(expanceId);
        if (!expance) {
            return res.status(404).json({
                success: false,
                message: "Expance not found"
            });
        }
        const image = req.file;
        if (image) {
            if (expance.image) {
                let oldPublicId = (_b = (_a = expance.image) === null || _a === void 0 ? void 0 : _a.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split(".")[0];
                if (oldPublicId) {
                    yield cloudinary_1.default.uploader.destroy(oldPublicId);
                }
            }
            let file = (0, DataUri_1.default)(image);
            let cloudinaryResponse = yield cloudinary_1.default.uploader.upload(file);
            expance.image = cloudinaryResponse.secure_url;
        }
        expance.item = item || expance.item;
        expance.price = price || expance.price;
        expance.expanceCategory = expanceCategory || expance.expanceCategory;
        expance.paymentMethod = paymentMethod || expance.paymentMethod;
        expance.date = date ? new Date(date) : expance.date;
        expance.notes = notes || expance.notes;
        yield expance.save();
        return res.status(200).json({
            success: true,
            message: "Expance updated successfully",
            data: expance
        });
    }
    catch (error) {
        console.log("Error in updateExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateExpance = updateExpance;
const deleteExpance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let expanceId = req.params.id;
        let expance = yield expance_model_1.default.findById(expanceId);
        if (!expance) {
            return res.status(404).json({
                success: false,
                message: "Expance not found"
            });
        }
        if (expance.image) {
            let oldPublicId = (_b = (_a = expance.image) === null || _a === void 0 ? void 0 : _a.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split(".")[0];
            if (oldPublicId) {
                yield cloudinary_1.default.uploader.destroy(oldPublicId);
            }
        }
        yield expance_model_1.default.findByIdAndDelete(expanceId);
        return res.status(200).json({
            success: true,
            message: "Expance deleted successfully"
        });
    }
    catch (error) {
        console.log("Error in deleteExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteExpance = deleteExpance;
const getTotalExpance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.user._id;
        let expances = yield expance_model_1.default.find({ userId: user });
        if (!expances) {
            return res.status(404).json({
                success: false,
                message: "No expances found for this user"
            });
        }
        let total = expances.reduce((sum, expance) => sum + expance.price, 0);
        res.status(200).json({
            success: true,
            message: "Total expance retrieved successfully",
            data: total,
            expances,
        });
    }
    catch (error) {
        console.log("Error in getTotalExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTotalExpance = getTotalExpance;
const getMonthlyExpance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.user._id;
        let { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({ success: false, message: "Month is required and year is required" });
        }
        let expances = yield expance_model_1.default.find({ userId: user });
        if (!expances) {
            return res.status(404).json({
                success: false,
                message: "No expances found for this user"
            });
        }
        // Learning part 
        let monthlyExpances = expances.filter(expance => {
            let expanceDate = new Date(expance.date);
            return expanceDate.getMonth() + 1 === parseInt(month) && expanceDate.getFullYear() === parseInt(year);
        });
        let total = monthlyExpances.reduce((sum, expance) => sum + expance.price, 0);
        res.status(200).json({
            success: true,
            message: "Monthly expance retrieved successfully",
            data: {
                total,
                expances: monthlyExpances
            }
        });
    }
    catch (error) {
        console.log("Error in getMonthlyExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getMonthlyExpance = getMonthlyExpance;
const getThisMonthExpance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.user._id;
        let expances = yield expance_model_1.default.find({ userId });
        if (!expances) {
            return res.status(400).json({ success: false, message: "Expance not found" });
        }
        // Learning part   
        let thisMonthExpance = expances.filter((expance) => {
            let expanceData = new Date(expance.date);
            let currentDate = new Date();
            console.log("Expance Date: ", expanceData.getUTCMonth(), expanceData.getFullYear());
            console.log("Current Date: ", currentDate.getUTCMonth(), currentDate.getFullYear());
            return expanceData.getUTCMonth() === currentDate.getUTCMonth() && expanceData.getFullYear() === currentDate.getFullYear();
        });
        let total = thisMonthExpance.reduce((sum, expance) => sum + expance.price, 0);
        res.status(200).json({
            success: true,
            message: "This month expance retrieved successfully",
            data: {
                total,
                expances: thisMonthExpance
            }
        });
    }
    catch (error) {
        console.log("Error in thisMonthExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getThisMonthExpance = getThisMonthExpance;
const getThisYearExpance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.user._id;
        let expances = yield expance_model_1.default.find({ userId });
        if (!expances) {
            return res.status(400).json({ success: false, message: "Expance not found" });
        }
        // Learning part   
        let thisYearExpance = expances.filter((expance) => {
            let expanceData = new Date(expance.date);
            let currentDate = new Date();
            return expanceData.getFullYear() === currentDate.getFullYear();
        });
        let total = thisYearExpance.reduce((sum, expance) => sum + expance.price, 0);
        res.status(200).json({
            success: true,
            message: "This year expance retrieved successfully",
            data: {
                total,
                expances: thisYearExpance
            }
        });
    }
    catch (error) {
        console.log("Error in thisYearExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getThisYearExpance = getThisYearExpance;
const getTodayExpance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.user._id;
        let expances = yield expance_model_1.default.find({ userId });
        if (!expances) {
            return res.status(400).json({ success: false, message: "Expance not found" });
        }
        // Learning part   
        let todayExpance = expances.filter((expance) => {
            let expanceData = new Date(expance.date);
            let currentDate = new Date();
            return expanceData.getDay() === currentDate.getDay();
        });
        let total = todayExpance.reduce((sum, expance) => sum + expance.price, 0);
        res.status(200).json({
            success: true,
            message: "This year expance retrieved successfully",
            data: {
                total,
                expances: todayExpance
            }
        });
    }
    catch (error) {
        console.log("Error in getTodayExpance controller: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTodayExpance = getTodayExpance;
