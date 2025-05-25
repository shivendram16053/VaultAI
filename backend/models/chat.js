const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sender: { type: String, enum: ["user", "ai"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
