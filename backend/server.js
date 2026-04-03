const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
console.log("GROQ KEY LOADED:", process.env.GROQ_API_KEY ? "YES" : "NO");


const connectDB = require("./config/db");

const app = express();

// ================= CONNECT DATABASE =================
connectDB();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ✅ SERVE UPLOADED IMAGES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/admin", require("./routes/adminRouter"));
app.use("/api", require("./routes/chat")); // 🔥 ADD THIS LINE

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Intelli-Interiors Backend is Running");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
