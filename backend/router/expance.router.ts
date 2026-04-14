import express from 'express';
import { createExpance, deleteExpance, getAllExpances, getExpanceById, getMonthlyExpance, getTotalExpance, updateExpance , getThisMonthExpance, getThisYearExpance, getTodayExpance } from '../controller/expance.controller';

const router = express.Router();



router.post('/create', createExpance);
router.get('/', getAllExpances);
router.get('/totalexpance', getTotalExpance);
router.get('/this-month-expance', getThisMonthExpance);
router.get('/this-year-expance', getThisYearExpance);
router.get('/today-expance', getTodayExpance);
router.get("/monthly-expance", getMonthlyExpance);
router.get('/:id', getExpanceById);
router.put('/:id', updateExpance);
router.delete('/:id', deleteExpance);


export default router;
