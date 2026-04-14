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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvVars_1 = __importDefault(require("../config/EnvVars"));
const getTokenAndSetCookie = (userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!EnvVars_1.default.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    let token = jsonwebtoken_1.default.sign({ userId }, EnvVars_1.default.JWT_SECRET, { expiresIn: "15d" });
    res.cookie("expance", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
    return token;
});
exports.default = getTokenAndSetCookie;
