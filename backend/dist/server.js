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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const mongoDb_1 = __importDefault(require("./config/mongoDb"));
const user_router_1 = __importDefault(require("./router/user.router"));
const balance_router_1 = __importDefault(require("./router/balance.router"));
const protect_router_1 = require("./middleware/protect.router");
const expance_router_1 = __importDefault(require("./router/expance.router"));
const multer_1 = __importDefault(require("./middleware/multer"));
const google_strategy_1 = __importDefault(require("./controller/strategy/google.strategy"));
app.use(google_strategy_1.default.initialize());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use("/user", user_router_1.default);
app.use("/balance", protect_router_1.protectRouter, balance_router_1.default);
app.use("/expances", protect_router_1.protectRouter, multer_1.default.single("image"), expance_router_1.default);
let PORT = 5000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongoDb_1.default)();
    console.log("Server Listing On Port", PORT);
}));
