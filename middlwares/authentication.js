const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  try {
    // Get the token from header
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Unauthenticated user" });
    }

    // Extract the Token
    const token = header.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the job routes
      // Creates user property in the req object which contains
      // userID and name from the signed jwt token in the mongoose middleware

      req.user = { userId: payload.userId, name: payload.name };
      next();
    } catch (error) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid Authentiction" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
