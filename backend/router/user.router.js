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
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const protect_router_1 = require("../middleware/protect.router");
const EnvVars_1 = __importDefault(require("../config/EnvVars"));
const passport_1 = __importDefault(require("passport"));
const genTokenAndSetCookie_1 = __importDefault(require("../utils/genTokenAndSetCookie"));
const router = express_1.default.Router();
router.get("/", protect_router_1.protectRouter, user_controller_1.loadUser);
router.post("/register", user_controller_1.registerUser);
router.post("/verify/:token", user_controller_1.verifyUser);
router.post("/forget", user_controller_1.forgetUser);
router.post("/resetPass/:token", user_controller_1.resetPassword);
router.post("/login", user_controller_1.loginUser);
router.post("/logout", user_controller_1.logoutUser);
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["email", "profile"]
}));
//Google CallBack Route
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${EnvVars_1.default.GOOGLE_CALLBACK_URL}`, session: false }), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        console.log("Google User:", user);
        yield (0, genTokenAndSetCookie_1.default)(user._id, res);
        res.redirect(`${EnvVars_1.default.FRONTEND_URI}`);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
