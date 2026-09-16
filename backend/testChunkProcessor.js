const {
  cleanText,
} = require("./services/documentProcessing/textChunker");

const text = `
PARUL UNIVERSITY

FACULTY NAME: FACULTY OF ENGINEERING & TECHNOLOGY
ACADEMIC YEAR: 2026-27

-- 5 of 10 --

Computer Science Engineering

-- 8 of 10 --
`;

console.log(cleanText(text));