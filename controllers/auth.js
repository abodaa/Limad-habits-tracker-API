const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res
        .status(StatusCodes.PARTIAL_CONTENT)
        .json({success: false, msg: "Please provide Username, Email and Password" });
    }

    const user = await User.create({...req.body});
    const token = await user.createJWT()
    res.status(StatusCodes.CREATED).json({success: true,user: {name: user.username}, token});
  } catch (error) {
    res.send(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password is provided
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Please provide all credentials.");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "User not found" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      console.log("Incorrect Password");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Unauthorized User" });
    }

    const token = await user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.username }, token });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { register, login };
