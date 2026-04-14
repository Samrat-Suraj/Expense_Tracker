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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const EnvVars_1 = __importDefault(require("../../config/EnvVars"));
const user_model_1 = require("../../model/user.model");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: EnvVars_1.default.GOOGLE_CLIENT_ID || "",
    clientSecret: EnvVars_1.default.GOOGLE_CLIENT_SECRET || "",
    callbackURL: EnvVars_1.default.GOOGLE_CALLBACK_URL || "",
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const { emails, photos, displayName, id } = profile;
    try {
        if (!emails || emails.length === 0) {
            return cb(new Error("No email found in Google profile"));
        }
        const email = emails[0].value;
        // ✅ 1. Check if user already exists
        let user = yield user_model_1.User.findOne({ email });
        if (user) {
            if (!user.googleId) {
                user.googleId = id;
                user.isVerified = true;
                yield user.save();
            }
            return cb(null, user);
        }
        // ✅ 3. Create new user
        const newUser = new user_model_1.User({
            googleId: id,
            fullName: displayName,
            email,
            isVerified: true,
            provider: "google", // recommended
        });
        yield newUser.save();
        return cb(null, newUser);
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        return cb(error);
    }
})));
exports.default = passport_1.default;
