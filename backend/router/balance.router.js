"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const balance_controller_1 = require("../controller/balance.controller");
const router = express_1.default.Router();
router.post("/add", balance_controller_1.addBalance);
router.get("/", balance_controller_1.getTotalBalance);
router.get("/recent", balance_controller_1.getRecentBalance);
exports.default = router;
