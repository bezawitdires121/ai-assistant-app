import express from "express";
import cors from "cors";

const app = express();

// allow frontend to talk to backend
app.use(cors());

// allow JSON data
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("AI Assistant Server is running 🚀");
});

const PORT = https://nova-ai-backend-sene.onrender.com/api;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});