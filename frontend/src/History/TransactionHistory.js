import React from 'react';
import { useGlobalContext } from '../Context/GlobalContext';
import "./History.css";

const TransactionHistory = () => {
    const { transactionHistory } = useGlobalContext();

    const history = transactionHistory();
    const expenses = history.filter(item => item.type === 'expense');
    const incomes = history.filter(item => item.type === 'income');

    return (
        <div id="transactionhistory-container">
            <div className="transactionhistory-styled">
                <h1>Recent History</h1>

                <div className="transactionhistory-section">
                    <h2>Incomes</h2>
                    {incomes.map((item) => {
                        const { _id, title, amount} = item;
                        return (
                            <div key={_id} className="transactionhistory-item incomeHistory">
                                <p>{title}</p>
                                <p>{`+ ₹ ${amount <= 0 ? 0 : amount}`}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="transactionhistory-section">
                    <h2>Expenses</h2>
                    {expenses.map((item) => {
                        const { _id, title, amount} = item;
                        return (
                            <div key={_id} className="transactionhistory-item expenseHistory">
                                <p>{title}</p>
                                <p>{`- ₹ ${amount <= 0 ? 0 : amount}`}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default TransactionHistory;
