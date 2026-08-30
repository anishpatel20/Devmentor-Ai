const rateLimit = require("express-rate-limit");

const aiRateLimit = rateLimit({
    windowMs: 60 * 1000, // one minute 
    limit: 2,  //10 request per minute 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many AI requests. Please try again later.",
    },
});

module.exports = aiRateLimit;