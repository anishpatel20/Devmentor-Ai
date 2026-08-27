const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .max(72)
        .required(),
});

const validateRegister = (data) => {
    return registerSchema.validate(data, {
        abortEarly: false, //with this .  we can collect all validation errors and eventually return a useful response.
    });
};



const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string()
        .required(),
});

const validateLogin = (data) => {
    return loginSchema.validate(data, {
        abortEarly: false,
    });
};


module.exports = {
    validateRegister,
    validateLogin,
};