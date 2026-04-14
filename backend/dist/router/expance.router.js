"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expance_controller_1 = require("../controller/expance.controller");
const router = express_1.default.Router();
router.post('/create', expance_controller_1.createExpance);
router.get('/', expance_controller_1.getAllExpances);
router.get('/totalexpance', expance_controller_1.getTotalExpance);
router.get('/this-month-expance', expance_controller_1.getThisMonthExpance);
router.get('/this-year-expance', expance_controller_1.getThisYearExpance);
router.get('/today-expance', expance_controller_1.getTodayExpance);
router.get("/monthly-expance", expance_controller_1.getMonthlyExpance);
router.get('/:id', expance_controller_1.getExpanceById);
router.put('/:id', expance_controller_1.updateExpance);
router.delete('/:id', expance_controller_1.deleteExpance);
exports.default = router;
