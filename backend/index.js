import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db/db.js';
import transactions from './routes/transaction.js';
import user from './routes/user.js';
import chat from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', transactions);
app.use('/api', user);
app.use('/api', chat);

app.get('/api/wake-up', (req, res) => {
    res.send({ message: 'Server is awake' });
});

// Start the server
const server = () => {
    db()
        .then(() => {
            app.listen(PORT, () => {
                console.log('Listening on port:', PORT);
            });
        })
        .catch((error) => {
            console.error('Failed to connect to the database', error);
        });
};

server();
