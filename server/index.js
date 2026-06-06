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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});