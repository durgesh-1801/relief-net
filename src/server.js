const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api");
const cors = require("cors")
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Disaster Response Coordination API is running" });
});

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
