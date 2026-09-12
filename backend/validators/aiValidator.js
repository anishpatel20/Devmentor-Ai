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


const explainRequestSchema = Joi.object({
  code: Joi.string().trim().min(1).max(20000).required(),

  language: Joi.string()
    .trim()
    .max(50)
    .allow("")
    .default(""),

  question: Joi.string()
    .trim()
    .max(1000)
    .allow("")
    .default(""),

  context: Joi.object({
    problem: Joi.string().trim().max(4000).allow("").default(""),
    rootCause: Joi.string().trim().max(4000).allow("").default(""),
    solution: Joi.string().trim().max(4000).allow("").default(""),
    fixedCode: Joi.string().trim().max(4000).allow("").default(""),
  })
    .default({}),
});


const reviewRequestSchema = Joi.object({
  code: Joi.string()
    .trim()
    .min(1)
    .max(50000)
    .required(),

  language: Joi.string()
    .trim()
    .lowercase()
    .valid(
      "javascript",
      "typescript",
      "python",
      "java",
      "c",
      "cpp",
      "csharp",
      "go",
      "rust",
      "php",
      "ruby",
      "kotlin",
      "swift",
      "dart",
      "sql"
    )
    .required(),

  requirements: Joi.string()
    .trim()
    .max(5000)
    .allow("")
    .default(""),

  mode: Joi.string()
    .valid("normal", "kill-critic")
    .default("normal"),

  context: Joi.object({
    code: Joi.string().trim().max(4000).allow("").default(""),
    language: Joi.string().trim().max(100).allow("").default(""),
    error: Joi.string().trim().max(4000).allow("").default(""),
    problem: Joi.string().trim().max(4000).allow("").default(""),
    rootCause: Joi.string().trim().max(4000).allow("").default(""),
    solution: Joi.string().trim().max(4000).allow("").default(""),
    fixedCode: Joi.string().trim().max(4000).allow("").default(""),
  }).default({}),
});


const reviewResponseSchema = Joi.object({
  overallAssessment: Joi.string().required(),

  findings: Joi.array()
    .items(
      Joi.object({
        severity: Joi.string()
          .valid(
            "Critical",
            "High",
            "Medium",
            "Low",
            "Suggestion"
          )
          .required(),

        category: Joi.string()
          .valid(
            "Correctness",
            "Security",
            "Performance",
            "Maintainability",
            "Readability",
            "Error Handling",
            "Testing",
            "Architecture"
          )
          .required(),

        location: Joi.string()
          .allow("")
          .required(),

        problem: Joi.string().required(),

        whyItMatters: Joi.string().required(),

        recommendation: Joi.string().required(),
      })
    )
    .required(),

  recommendedImprovements: Joi.array()
    .items(Joi.string())
    .required(),

  finalVerdict: Joi.string().required(),
});



const killCriticResponseSchema = Joi.object({
  overallAssessment: Joi.string().required(),

  attackSurface: Joi.array()
    .items(
      Joi.object({
        severity: Joi.string()
          .valid(
            "Critical",
            "High",
            "Medium",
            "Low"
          )
          .required(),

        category: Joi.string()
          .valid(
            "Correctness",
            "Security",
            "Performance",
            "Maintainability",
            "Architecture"
          )
          .required(),

        location: Joi.string()
          .allow("")
          .required(),

        weakness: Joi.string().required(),

        attack: Joi.string().required(),

        impact: Joi.string().required(),

        defense: Joi.string().required(),
      })
    )
    .required(),

  edgeCases: Joi.array()
    .items(Joi.string())
    .required(),

  interviewQuestions: Joi.array()
    .items(Joi.string())
    .required(),

  finalVerdict: Joi.string().required(),
});



const killCriticRequestSchema = Joi.object({
  input: Joi.string()
    .trim()
    .min(1)
    .max(4000)
    .required(),

  context: Joi.object({
    code: Joi.string().trim().max(4000).allow("").default(""),
    language: Joi.string().trim().max(100).allow("").default(""),
    error: Joi.string().trim().max(4000).allow("").default(""),
    problem: Joi.string().trim().max(4000).allow("").default(""),
    rootCause: Joi.string().trim().max(4000).allow("").default(""),
    solution: Joi.string().trim().max(4000).allow("").default(""),
    fixedCode: Joi.string().trim().max(4000).allow("").default(""),
  }).default({}),
});


const killCriticModeResponseSchema = Joi.object({
  verdict: Joi.string().required(),

  whatIUnderstood: Joi.string().required(),

  keyAssumptions: Joi.array()
    .items(Joi.string())
    .required(),

  whatHoldsUp: Joi.array()
    .items(Joi.string())
    .required(),

  whatImChallenging: Joi.array()
    .items(Joi.string())
    .required(),

  risksAndTradeoffs: Joi.array()
    .items(Joi.string())
    .required(),

  alternatives: Joi.array()
    .items(Joi.string())
    .required(),

  recommendation: Joi.string().required(),

  whatWouldChangeMyRecommendation: Joi.array()
    .items(Joi.string())
    .required(),

  confidence: Joi.string()
    .valid("High", "Medium", "Low")
    .required(),
});





module.exports = {
  debugResponseSchema,
  debugRequestSchema,
  explainRequestSchema,
  reviewRequestSchema,
  reviewResponseSchema,
  killCriticResponseSchema,
  killCriticRequestSchema,
  killCriticModeResponseSchema,
};