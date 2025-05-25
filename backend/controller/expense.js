import ExpenseSchema from "../models/expense.js";

export const addExpense = async (req, res) => {
  const { title, amount, category, description, date, email } = req.body;

  if (!title || !category || !description || !date || !email) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be a positive number!" });
  }

  const expense = new ExpenseSchema({ title, amount, category, description, date, email });

  try {
    await expense.save();
    res.status(200).json({ message: "Expense Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExpense = async (req, res) => {
  const email = req.headers["useremail"];

  try {
    const expenses = await ExpenseSchema.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    await ExpenseSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Expense Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
