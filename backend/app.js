const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/errorMiddleware");

app.use(
    cors({
        origin:process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/authRoutes");

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);
module.exports = app;