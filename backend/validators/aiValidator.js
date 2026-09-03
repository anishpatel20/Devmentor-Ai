const Joi = require("joi");

const debugRequestSchema = Joi.object({
  code: Joi.string().trim().min(1).max(12000).required(),
  error: Joi.string().trim().min(1).max(4000).required(),
  language: Joi.string().trim().max(50).allow("").default(""),
  context: Joi.string().trim().max(6000).allow("").default(""),
});

const debugResponseSchema = Joi.object({
  problem: Joi.string().required(),
  rootCause: Joi.string().required(),
  whyItHappened: Joi.string().required(),
  solution: Joi.string().required(),
  fixedCode: Joi.string().allow("").required(),
  explanation: Joi.string().required(),

  testCases: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required(),
        expectedResult: Joi.string().required(),
      })
    )
    .required(),

  verification: Joi.string().required(),

  needsMoreInformation: Joi.boolean().required(),

  missingInformation: Joi.array()
    .items(Joi.string())
    .required(),
});

module.exports = {
    debugResponseSchema,
    debugRequestSchema,
};