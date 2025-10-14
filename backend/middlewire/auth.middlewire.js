// middlewire/auth.middlewire.js
const jwt = require("jsonwebtoken");

async function authChecker(req, res, next) {
  try {
    // 1️⃣ Read token properly from cookies
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWTKEY);
    console.log("Decoded token:", decoded);

    // 3️⃣ Attach user info to request
    req.user = decoded;

    // 4️⃣ Call next() to continue
    next();

  } catch (error) {
    console.error("AuthChecker Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authChecker };
