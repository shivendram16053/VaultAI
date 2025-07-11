import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  amount: {
    type: Number,
    required: true,
    maxLength: 20,
    trim: true,
  },
  type: {
    type: String,
    default: 'income',
  },
  date: {
    type: Date,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Income = mongoose.model('Income', IncomeSchema);
export default Income;
