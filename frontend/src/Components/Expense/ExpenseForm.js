import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../Context/GlobalContext";
import "./Expense.css";
import ReactMarkdown from "react-markdown";

function ExpenseForm() {
  const { addExpense, error, setError } = useGlobalContext();
  const email = localStorage.getItem("userEmail");
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
    email: email || "",
  });

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // <-- loading state

  const { title, amount, date, category, description } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      // Add the expense first
      await addExpense(inputState);

      // Call AI suggestion API
      const response = await fetch("https://expense-buddy-9aqs.onrender.com/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "expense",
          amount: parseFloat(amount),
          description: description || "",
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI suggestion");

      const data = await response.json();

      setAiSuggestion(data.suggestion || "No suggestion available.");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setAiSuggestion("Sorry, no AI insight available right now.");
      setShowModal(true);
    }

    // Reset form inputs
    setInputState({
      title: "",
      amount: "",
      date: "",
      category: "",
      description: "",
      email: email || "",
    });

    setLoading(false); // stop loading
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div className="input-control">
          <input
            type="text"
            value={title}
            name={"title"}
            placeholder="Expense Title"
            onChange={handleInput("title")}
            disabled={loading}
          />
        </div>
        <div className="input-control">
          <input
            value={amount}
            type="text"
            name={"amount"}
            placeholder={"Expense Amount"}
            onChange={handleInput("amount")}
            disabled={loading}
          />
        </div>
        <div className="input-control">
          <DatePicker
            id="date"
            placeholderText="Enter A Date"
            selected={date}
            dateFormat="dd/MM/yyyy"
            onChange={(date) => {
              setInputState({ ...inputState, date: date });
            }}
            disabled={loading}
          />
        </div>
        <div className="selects input-control">
          <select
            required
            value={category}
            name="category"
            id="category"
            onChange={handleInput("category")}
            disabled={loading}
          >
            <option value="" disabled>
              Select Option
            </option>
            <option value="education">Education</option>
            <option value="groceries">Groceries</option>
            <option value="health">Health</option>
            <option value="takeaways">Takeaway</option>
            <option value="clothing">Clothes</option>
            <option value="travelling">Travel</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="input-control">
          <textarea
            name="description"
            value={description}
            placeholder="Add A Reference"
            id="description"
            cols="30"
            rows="4"
            onChange={handleInput("description")}
            disabled={loading}
          />
        </div>
        <div className="submit-btn">
          <button className="Bttn" disabled={loading}>
            {loading ? "Processing..." : "Add Expense"}
          </button>
        </div>
      </form>

      {/* AI Suggestion Modal */}
      {showModal && (
        <div className="ai-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="ai-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>AI Insight</h2>
            <div className="aiMarkdown">
              <p>
                <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
              </p>
            </div>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .ai-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .ai-modal-content {
          background: black;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .ai-modal-content h2 {
          margin-top: 0;
        }
        .ai-modal-content button {
          margin-top: 15px;
          padding: 8px 16px;
          background-color: #007bff;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

export default ExpenseForm;
