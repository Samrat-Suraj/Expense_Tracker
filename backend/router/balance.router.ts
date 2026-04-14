import express from "express";
import { addBalance, getRecentBalance, getTotalBalance } from "../controller/balance.controller";

const router = express.Router();

router.post("/add" , addBalance)
router.get("/" , getTotalBalance)
router.get("/recent" , getRecentBalance)

export default router;