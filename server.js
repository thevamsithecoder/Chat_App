// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const ChatMessage = require("./models/ChatMessage");

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection

const connectDB = mongoose.connect(process.env.MONGO_URL);
connectDB.then(()=> {
	console.log("Connected to MongoDB")
})
.catch((error)=> {
	console.log(error, "Error occured while connecting to the database")
})

connectDB

// Routes
app.get("/messages", async (req, res) => {
	try {
		const messages = await ChatMessage.find();
		res.json(messages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/messages", async (req, res) => {
	try {
		const { user, message } = req.body;

		if (!user || !message) {
			return res
				.status(400)
				.json({ error: "User and message are required" });
		}

		const chatMessage = new ChatMessage({
			user,
			message,
		});

		await chatMessage.save();

		res.status(201).json(chatMessage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
