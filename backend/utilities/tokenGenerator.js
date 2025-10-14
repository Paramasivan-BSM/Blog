// utilities/tokenGenerator.js
const jwt = require("jsonwebtoken");

function tokenGenerator(user) {
  if (!process.env.JWTKEY) {
    throw new Error("JWTKEY not set in environment");
  }

  // Return signed JWT string
  const token = jwt.sign({ _id: user._id,role:user.role }, process.env.JWTKEY, { expiresIn: "5h" });
  return token;
}

module.exports = tokenGenerator;
