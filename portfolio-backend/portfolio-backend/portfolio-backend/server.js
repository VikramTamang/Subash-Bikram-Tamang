const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST: Contact form submission
app.post('/api/contact', (req, res) => {
    const { fullName, email, phoneNumber, subject, message } = req.body;

    if (!fullName || !email || !phoneNumber || !subject || !message) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newMessage = {
        id: Date.now(),
        fullName,
        email,
        phoneNumber,
        subject,
        message
    };

    const dataPath = './data/messages.json';
    let messages = [];

    if (fs.existsSync(dataPath)) {
        messages = JSON.parse(fs.readFileSync(dataPath));
    }

    messages.push(newMessage);
    fs.writeFileSync(dataPath, JSON.stringify(messages, null, 2));

    // --- Email Setup using Nodemailer ---
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `📨 New Contact Form Submission: ${subject}`,
        text: `
You received a new message via your portfolio contact form:

Name: ${fullName}
Email: ${email}
Phone: ${phoneNumber}
Subject: ${subject}

Message:
${message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email failed:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });

    return res.json({ success: true, message: "Message received and emailed!" });
});

// GET: All contact messages
app.get('/api/messages', (req, res) => {
    const dataPath = './data/messages.json';

    if (!fs.existsSync(dataPath)) {
        return res.json([]);
    }

    const messages = JSON.parse(fs.readFileSync(dataPath));
    res.json(messages);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
