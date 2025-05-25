import IncomeSchema from "../models/income.js";
import user from "../models/user.js";  // if you actually need this import

export const addIncome = async (req, res) => {
  const { title, amount, category, description, date, email } = req.body;

  if (!title || !category || !description || !date || !email) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const income = new IncomeSchema({
    title,
    amount: Number(amount),
    category,
    description,
    date,
    email,
  });

  try {
    await income.save();
    res.status(200).json({ message: "Income Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getIncomes = async (req, res) => {
  const email = req.headers["useremail"];

  try {
    const incomes = await IncomeSchema.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteIncome = async (req, res) => {
  const { id } = req.params;

  try {
    const income = await IncomeSchema.findById(id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    await IncomeSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Income Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
