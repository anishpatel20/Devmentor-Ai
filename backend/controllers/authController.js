const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { validateRegister, validateLogin } = require("../validators/authValidator");

const register = async (req, res, next) => {
    try {
        const { error, value } = validateRegister(req.body);

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((detail) => detail.message),
            });
        }

        const { name, email, password } = value;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);


        const user = await User.create({
            name,
            email,
            passwordHash,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {

    try {
        const { error, value } = validateLogin(req.body);

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((detail) => detail.message),
            });
        }

        const { email, password } = value;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }


        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, //1 day
        });


        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};


const logout = (req, res) => {
    
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Logout successful",
    });
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "-passwordHash"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
};