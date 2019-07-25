const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  //Get token
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "Authorization Denied!" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    //Set user based on the decoded user

    req.user = decoded.user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
