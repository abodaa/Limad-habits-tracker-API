const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "You must provide Username"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "You must provide Email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "You must provide Password"],
    minLength: 6,
  },
});

// mongoose middleware for hashing the password

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Use Schema method to sign/create a JWT
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_TOKENLIFETIME,
    }
  );
};

// Compare Password
UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatched = await bcrypt.compare(userPassword, this.password);
  return isMatched;
};


const Model = mongoose.model("Users", UserSchema);
module.exports = Model;
