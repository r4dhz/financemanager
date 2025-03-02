// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (Make sure MongoDB is installed and running)
mongoose.connect('mongodb://localhost:27017/financeOrganizer');

// Define a basic User model (In production, hash passwords using bcrypt)
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
}));

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Signin Route
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).send({ message: 'Invalid credentials' });
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Test Route
app.get('/', (req, res) => {
    res.send('Express server is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
