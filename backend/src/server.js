const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const generateRoutes = require("./routes/generate.routes");
const analyzeRoutes = require("./routes/analyze.routes");
const historyRoutes = require("./routes/history.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", generateRoutes);
app.use("/api/v1", analyzeRoutes);
app.use("/api/v1", historyRoutes);
app.use("/", healthRoutes);

PORT = process.env.PORT || 5001;

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})