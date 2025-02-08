const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "No token-Not Authorised" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token-Not Authorised" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = verifyToken;
