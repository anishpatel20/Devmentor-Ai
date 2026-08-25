const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevMentor AI backend is running",
  });
};

module.exports = {
  getHealth,
};