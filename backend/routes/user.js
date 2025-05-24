const router = require("express").Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require("../models/user");
require('dotenv').config();

const jwtToken = process.env.JWT


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {
    const url = `https://vaultai.vercel.app/verify/${token}`;
    await transporter.sendMail({
        to: email,
        subject: "Verify your email",
        html: `<p>Click below to verify your email:</p><a href="${url}">${url}</a>`
    });
};


router.post('/signup', async (req, res) => {
    const { name, email, role, password } = req.body;

    try {
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new userSchema({
            name,
            email,
            password: hashedPassword,
            role,
            verified: false
        });

        const token = jwt.sign({ id: user._id }, jwtToken, { expiresIn: '1d' });

        await sendVerificationEmail(email, token);
        await user.save();

        res.status(201).json({ message: "Signup successful. Please verify your email." });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/verify/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, jwtToken);
        const user = await userSchema.findById(decoded.id);

        if (!user) {
            return res.status(400).send("Invalid verification link.");
        }

        user.verified = true;
        await user.save();

        res.send("Email verified successfully. You can now log in.");
    } catch (err) {
        res.status(400).send("Invalid or expired token.");
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, jwtToken);

        res.status(200).json({ message: "Login successful", token, email: user.email,name:user.name });
    } catch (error) {
        console.error('Error during login:', error); // Log the error for debugging
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;
