const express = require("express");
const cors = require("cors");
const app = express();

app.use(
    cors({
        origin:process.env.CLIENT_URL,
    })
);

app.use(express.json());

const healthRoutes = require("./routes/health");

app.use("/api/health", healthRoutes);


module.exports = app;