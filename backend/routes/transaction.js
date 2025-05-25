import { Router } from 'express';
import {
  addExpense,
  getExpense,
  deleteExpense
} from '../controller/expense.js';

import {
  addIncome,
  getIncomes,
  deleteIncome
} from '../controller/income.js';

const router = Router();

router
  .post('/add-income', addIncome)
  .get('/get-incomes', getIncomes)
  .delete('/delete-income/:id', deleteIncome)
  .post('/add-expense', addExpense)
  .get('/get-expenses', getExpense)
  .delete('/delete-expense/:id', deleteExpense);

export default router;
